import express, { Express, NextFunction, Request, Response } from 'express'
import { Campground } from './models/campground'
import { wrapAsync } from './lib/utils'
import { campgroundSchema, validateSchemaData } from './schemas'
import * as process from 'process'

const mongoose = require('mongoose')
const ExpressError = require('./lib/classes')
require('dotenv').config()

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
    console.log('Database connected')
})

const app: Express = express()

const validateCampground = (req: Request, res: Response, next: NextFunction) => {
    const { error } = validateSchemaData(req.body, campgroundSchema)
    if (error) throw new ExpressError(error, 400)
    else next()
}

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

app.all('*', (req, res, next) => {
    next(new ExpressError('Endpoint not found', 404))
})

app.use((error: typeof ExpressError, req: Request, res: Response, next: NextFunction) => {
    const { statusCode = 500, message = 'Something went wrong' } = error
    res.status(statusCode).send(message)
})

app.listen(5000, () => {
    console.log('Serving on port 5000')
})
