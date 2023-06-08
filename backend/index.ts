import * as process from 'process'
import express, { Express, NextFunction, Request, Response } from 'express'
import { Campground } from './models/campground'
import { wrapAsync } from './lib/utils'
import { Review } from './models/review'
import { validateCampground } from './schemas/campground'
import ExpressError from './lib/classes'
import { validateReview } from './schemas/review'

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

app.get('/', (req: Request, res: Response) => {
    res.send('Hi!')
})

app.get(
    '/campgrounds',
    wrapAsync(async (req: Request, res: Response) => {
        const campgrounds = await Campground.find({})
        res.send(campgrounds)
    })
)

app.post(
    '/campgrounds',
    validateCampground,
    wrapAsync(async (req: Request, res: Response) => {
        const campground = new Campground(req.body)
        await campground.save()
        res.send(campground)
    })
)

app.get(
    '/campgrounds/:id',
    wrapAsync(async (req: Request, res: Response) => {
        const campground = await Campground.findById(req.params.id)
        res.send(campground)
    })
)

app.put(
    '/campgrounds/:id',
    validateCampground,
    wrapAsync(async (req: Request, res: Response) => {
        const campground = await Campground.findByIdAndUpdate(req.params.id, req.body)
        res.send(campground)
    })
)

app.delete(
    '/campgrounds/:id',
    wrapAsync(async (req: Request, res: Response) => {
        const campground = await Campground.findByIdAndDelete(req.params.id)
        res.send(campground)
    })
)

app.get(
    '/campgrounds/:id/reviews',
    wrapAsync(async (req: Request, res: Response) => {
        const campground = await Campground.findById(req.params.id)
        res.send(campground)
    })
)

app.post(
    '/campgrounds/:id/reviews',
    validateReview,
    wrapAsync(async (req: Request, res: Response) => {
        const campground = await Campground.findById(req.params.id)
        const review = new Review(req.body.review)
        campground.reviews.push(review)

        await review.save()
        await campground.save()
        res.send(campground.reviews)
    })
)

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
