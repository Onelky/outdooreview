import { NextFunction, Request, Response } from 'express'
import { validateSchemaData } from '../schemas'
import ExpressError from '../lib/classes'
import reviewSchema from '../schemas/review'

export const validateReview = (req: Request, res: Response, next: NextFunction) => {
    const { errors } = validateSchemaData(req.body, reviewSchema)
    if (errors) throw new ExpressError('', 400, errors)
    else next()
}
