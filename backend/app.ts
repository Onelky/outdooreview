import * as process from 'process'
import express, { Express, Request, Response } from 'express'
import bodyParser from 'body-parser'
import mongoose, { ConnectOptions } from 'mongoose'
import dotenv from 'dotenv'
import session from 'express-session'
import passport from 'passport'
import mongoSanitize from 'express-mongo-sanitize'
import helmet from 'helmet'
import { Strategy as LocalStrategy } from 'passport-local'
import { Strategy as GoogleStrategy } from 'passport-google-oidc'
import ExpressError from './lib/classes'
import campgroundRoutes from './routes/campgrounds'
import reviewsRoutes from './routes/reviews'
import usersRoutes from './routes/users'
import User, { AuthMethods } from './models/user'
import { createUser, findUser } from './services/users'

dotenv.config()

const sessionConfig = {
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: true,
    cookie: {
        name: 'session',
        httpOnly: true,
        // secure: true,
        expires: new Date(new Date().getDate() + 1000 * 60 * 60 * 24),
        maxAge: 1000 * 60 * 60 * 24
    }
}

if (process.env.NODE_ENV !== 'TEST') mongoose.connect(process.env.DATABASE_URL as string, { useNewUrlParser: true } as ConnectOptions)

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
    console.log('Database connected')
})

const app: Express = express()

app.use(bodyParser.json())
app.use(session(sessionConfig))

app.use(passport.initialize())
app.use(passport.session())
app.use(mongoSanitize())
app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                'script-src': ["'self'", 'example.com'],
                'style-src': null,
                imgSrc: ['self', 'blob:', 'data:', process.env.CLOUDINARY_URL as string]
            }
        }
    })
)
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL
        },
        async (issuer, profile, done) => {
            try {
                const existingUser = await findUser(profile.id, true)
                if (existingUser) {
                    return done(null, existingUser)
                }
                const newUser = await createUser({
                    method: AuthMethods.google,
                    username: profile.id,
                    email: profile.emails[0].value
                })

                return done(null, newUser)
            } catch (error) {
                return done(error, false)
            }
        }
    )
)
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use('/api/campgrounds', campgroundRoutes)
app.use('/api/campgrounds/:id/reviews', reviewsRoutes)
app.use('/api/users', usersRoutes)

app.all('*', (req, res, next) => {
    next(new ExpressError('Endpoint not found', 404))
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: ExpressError, req: Request, res: Response, next) => {
    const { statusCode = 500, message = 'Something went wrong', errors } = error
    res.status(statusCode).send(errors ?? message)
})

export default app
