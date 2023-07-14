import { NextFunction, Request, Response } from 'express'

type FunctionType = (req: Request, res: Response, next?: NextFunction) => Promise<unknown>
export const wrapAsync = (fn: FunctionType) => {
    return (req: Request, res: Response, next: NextFunction) => fn(req, res, next).catch(next)
}

module.exports = {
    wrapAsync
}
