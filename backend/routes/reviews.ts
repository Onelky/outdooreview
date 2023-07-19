import express, { Request, Response } from 'express'
import Campground from '../models/campground'
import Review from '../models/review'
import { isReviewAuthor, validateReview } from '../middlewares/reviews'
import { wrapAsync } from '../lib/utils'
import { isLoggedIn } from '../middlewares'

const router = express.Router({ mergeParams: true })

router.get(
    '/',
    wrapAsync(async (req: Request, res: Response) => {
        const campground = await Campground.findById(req.params.id)
        res.send(campground).status(200)
    })
)

router.post(
    '/',
    isLoggedIn,
    validateReview,
    wrapAsync(async (req: Request, res: Response) => {
        const campground = await Campground.findById(req.params.id)
        const review = new Review({ ...req.body, author: req.user?._id })
        campground?.reviews.push(review)
        await review.save()
        await campground?.save()
        res.send(review).status(200)
    })
)

router.put(
    '/:reviewId',
    isLoggedIn,
    validateReview,
    isReviewAuthor,
    wrapAsync(async (req: Request, res: Response) => {
        const review = await Review.findByIdAndUpdate(req.params.reviewId, req.body, { returnDocument: 'after' })
        res.status(200).send(review)
    })
)

router.delete(
    '/:reviewId',
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(async (req: Request, res: Response) => {
        const { id, reviewId } = req.params
        await Review.findByIdAndDelete(reviewId)
        const campground = await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
        res.send(campground).status(200)
    })
)

export default router
