import { NextFunction, Request, Response } from 'express'
import { validateSchemaData } from '../schemas'
import ExpressError from '../lib/classes'
import userSchema from '../schemas/user'

export const validateUser = (req: Request, res: Response, next: NextFunction) => {
    const { errors } = validateSchemaData(req.body, userSchema)
    if (errors) throw new ExpressError('', 400, errors)
    else next()
}
