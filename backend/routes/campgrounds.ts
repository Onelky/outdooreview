import express, { Request, Response } from 'express'
import Campground from '../models/campground'
import { validateCampground, isCampgroundAuthor } from '../middlewares/campground'
import { wrapAsync } from '../lib/utils'
import { isLoggedIn } from '../middlewares'

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
        const campground = new Campground({ ...req.body, author: req.user?._id })
        await campground.save()
        res.send(campground)
    })
)

router.get(
    '/:id',
    wrapAsync(async (req: Request, res: Response) => {
        const campground = await Campground.findById(req.params.id)
            .populate({ path: 'reviews', populate: { path: 'author' } })
            .populate('author')
        res.send(campground)
    })
)

router.put(
    '/:id',
    isLoggedIn,
    validateCampground,
    isCampgroundAuthor,
    wrapAsync(async (req: Request, res: Response) => {
        res.send(await Campground.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' }))
    })
)

router.delete(
    '/:id',
    isLoggedIn,
    isCampgroundAuthor,
    wrapAsync(async (req: Request, res: Response) => {
        const campground = await Campground.findByIdAndDelete(req.params.id)
        res.send(campground)
    })
)

export default router
