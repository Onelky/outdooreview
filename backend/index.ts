import * as process from 'process'
import express, { Express, NextFunction, Request, Response } from 'express'
import ExpressError from './lib/classes'
import campgroundRoutes from './routes/campgrounds'
import reviewsRoutes from './routes/reviews'

const bodyParser = require('body-parser')
const mongoose = require('mongoose')
require('dotenv').config()

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
    console.log('Database connected')
})

const app: Express = express()

app.use(bodyParser.json())
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
