import { NextFunction, Request, Response } from 'express'
import { validateSchemaData } from '../schemas'
import ExpressError from '../lib/classes'
import reviewSchema, { reviewUpdateSchema } from '../schemas/review'
import Review from '../models/review'
import { campgroundSchema, campgroundUpdateSchema } from '../schemas/campground'

export const validateReview = (req: Request, res: Response, next: NextFunction) => {
    const { errors } = validateSchemaData(req.body, req.method === 'post' ? reviewSchema : reviewUpdateSchema)
    if (errors) throw new ExpressError('', 400, errors)
    else next()
}

export const isReviewAuthor = async (req: Request, res: Response, next: NextFunction) => {
    const review = await Review.findById(req.params.reviewId)
    if (!review?.author?.equals(req.user?._id)) return res.status(403).send({ message: 'Unauthorized' })
    next()
}
