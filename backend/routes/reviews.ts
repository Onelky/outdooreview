import { Request, Response } from 'express'
import Campground from '../models/campground'
import Review from '../models/review'
import { validateReview } from '../schemas/review'
import { wrapAsync } from '../lib/utils'

const express = require('express')
const router = express.Router({ mergeParams: true })

router.get(
    '/',
    wrapAsync(async (req: Request, res: Response) => {
        const campground = await Campground.findById(req.params.id)
        res.send(campground)
    })
)

router.post(
    '/',
    validateReview,
    wrapAsync(async (req: Request, res: Response) => {
        const campground = await Campground.findById(req.params.id)
        const review = new Review(req.body.review)
        campground?.reviews.push(review)
        await review.save()
        await campground?.save()
        res.send(campground?.reviews)
    })
)

router.delete(
    '/:reviewId',
    wrapAsync(async (req: Request, res: Response) => {
        const { id, reviewId } = req.params
        await Review.findByIdAndDelete(reviewId)
        const campground = await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
        res.send(campground)
    })
)

export default router
