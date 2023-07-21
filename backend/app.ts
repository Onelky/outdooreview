import * as process from 'process'
import express, { Express, Request, Response } from 'express'
import bodyParser from 'body-parser'
import mongoose, { ConnectOptions } from 'mongoose'
import dotenv from 'dotenv'
import session from 'express-session'
import passport from 'passport'
import { Strategy } from 'passport-local'
import ExpressError from './lib/classes'
import campgroundRoutes from './routes/campgrounds'
import reviewsRoutes from './routes/reviews'
import usersRoutes from './routes/users'
import User from './models/user'

const sessionConfig = {
    secret: 'anAwfulSecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: new Date(new Date().getDate() + 1000 * 60 * 60 * 24),
        maxAge: 1000 * 60 * 60 * 24
    }
}

if (process.env.NODE_ENV !== 'PROD') dotenv.config()
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
passport.use(new Strategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use('/api/campgrounds', campgroundRoutes)
app.use('/api/campgrounds/:id/reviews', reviewsRoutes)
app.use('/api/users', usersRoutes)

app.all('*', (req, res, next) => {
    next(new ExpressError('Endpoint not found', 404))
})

app.use((error: ExpressError, req: Request, res: Response, next) => {
    const { statusCode = 500, message = 'Something went wrong', errors } = error
    res.status(statusCode).send(errors ?? message)
})

export default app
