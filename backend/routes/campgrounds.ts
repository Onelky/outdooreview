import express, { Request, Response } from 'express'
import Campground from '../models/campground'
import { validateCampground } from '../schemas/campground'
import { wrapAsync } from '../lib/utils'
import { isLoggedIn } from '../lib/middlewares'

const router = express.Router()

router.get(
    '/',
    wrapAsync(async (req: Request, res: Response) => {
        const campgrounds = await Campground.find({})
        res.send(campgrounds)
    })
)

router.post(
    '/',
    isLoggedIn,
    validateCampground,
    wrapAsync(async (req: Request, res: Response) => {
        const campground = new Campground(req.body)
        await campground.save()
        res.send(campground)
    })
)

router.get(
    '/:id',
    wrapAsync(async (req: Request, res: Response) => {
        const campground = await Campground.findById(req.params.id)
        res.send(campground)
    })
)

router.put(
    '/:id',
    isLoggedIn,
    validateCampground,
    wrapAsync(async (req: Request, res: Response) => {
        const campground = await Campground.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' })
        res.send(campground)
    })
)

router.delete(
    '/:id',
    isLoggedIn,
    wrapAsync(async (req: Request, res: Response) => {
        const campground = await Campground.findByIdAndDelete(req.params.id)
        res.send(campground)
    })
)

export default router
