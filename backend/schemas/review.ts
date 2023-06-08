import { z } from 'zod'
import { NextFunction, Request, Response } from 'express'
import { validateSchemaData } from './index'
import ExpressError from '../lib/classes'

export const reviewSchema = z
    .object({
        body: z.string({ required_error: 'Body is required!', invalid_type_error: 'Body must be a string' }).nonempty(),
        rating: z
            .number({ required_error: 'Rating is required', invalid_type_error: 'Body must be a number' })
            .min(1, 'Rating must be bigger than 1')
            .max(5, 'Rating must be smaller than 5')
    })
    .required()

export const validateReview = (req: Request, res: Response, next: NextFunction) => {
    const { error } = validateSchemaData(req.body.review ?? req.body, reviewSchema)
    if (error) throw new ExpressError(error, 400)
    else next()
}
