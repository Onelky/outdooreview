import { NextFunction, Request, Response } from 'express'
import Campground from '../models/campground'
import { validateSchemaData } from '../schemas'
import ExpressError from '../lib/classes'
import { campgroundSchema, campgroundUpdateSchema } from '../schemas/campground'

export const isCampgroundAuthor = async (req: Request, res: Response, next: NextFunction) => {
    const campground = await Campground.findById(req.params.id)
    if (!campground?.author?.equals(req.user?._id)) return res.status(403).send({ message: 'Unauthorized' })
    next()
}

export const validateCampground = (req: Request, res: Response, next: NextFunction) => {
    const { errors } = validateSchemaData(req.body, req.method === 'post' ? campgroundSchema : campgroundUpdateSchema)
    if (errors) throw new ExpressError('', 400, errors)
    else next()
}
