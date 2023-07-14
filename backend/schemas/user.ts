import { z } from 'zod'
import { NextFunction, Request, Response } from 'express'
import { validateSchemaData } from './index'
import ExpressError from '../lib/classes'

export const userSchema = z
    .object({
        email: z.string({ required_error: 'Email is required', invalid_type_error: 'Email must be a string' }).nonempty(),
        username: z.string({ required_error: 'Username is required' }).nonempty(),
        password: z.string({ required_error: 'Password is required' }).nonempty()
    })
    .required()

const validateUser = (req: Request, res: Response, next: NextFunction) => {
    const { errors } = validateSchemaData(req.body, userSchema)
    if (errors) throw new ExpressError('', 400, errors)
    else next()
}

export default validateUser
