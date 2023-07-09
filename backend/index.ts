import * as process from 'process'
import express, { Express, NextFunction, Request, Response } from 'express'
import bodyParser from 'body-parser'
import mongoose, { ConnectOptions } from 'mongoose'
import dotenv from 'dotenv'
import session from 'express-session'
import ExpressError from './lib/classes'
import campgroundRoutes from './routes/campgrounds'
import reviewsRoutes from './routes/reviews'

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

dotenv.config()
mongoose.connect(process.env.DATABASE_URL as string, { useNewUrlParser: true } as ConnectOptions)

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
    console.log('Database connected')
})

const app: Express = express()

app.use(bodyParser.json())
app.use(session(sessionConfig))

app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/reviews', reviewsRoutes)

app.all('*', (req, res, next) => {
    next(new ExpressError('Endpoint not found', 404))
})

app.use((error: ExpressError, req: Request, res: Response, next: NextFunction) => {
    const { statusCode = 500, message = 'Something went wrong' } = error
    res.status(statusCode).send(message)
})

app.listen(5000, () => {
    console.log('Serving on port 5000')
})
