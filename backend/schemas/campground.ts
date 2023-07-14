import { z } from 'zod'
import { NextFunction, Request, Response } from 'express'
import { validateSchemaData } from './index'
import ExpressError from '../lib/classes'

const customErrorMap: z.ZodErrorMap = (issue, ctx) => {
    if (issue.code === z.ZodIssueCode.invalid_type) return { message: 'Invalid data' }

    return { message: ctx.defaultError }
}

z.setErrorMap(customErrorMap)

export const campgroundSchema = z.object({
    title: z.string({ required_error: 'Title is required!' }).nonempty(),
    price: z.number({ required_error: 'Price is required' }).positive().gte(0),
    description: z.string({ required_error: 'Description is required' }).nonempty(),
    location: z.string({ required_error: 'Location is required' }).nonempty()
})

export const campgroundUpdateSchema = z.object({
    title: z.string().optional(),
    price: z.number().positive().gte(0).optional(),
    description: z.string().optional(),
    location: z.string().optional()
})

export const validateCampground = (req: Request, res: Response, next: NextFunction) => {
    const { errors } = validateSchemaData(req.body, req.method === 'post' ? campgroundSchema : campgroundUpdateSchema)
    if (errors) throw new ExpressError('', 400, errors)
    else next()
}
