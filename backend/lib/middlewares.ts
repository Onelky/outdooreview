import { NextFunction, Response, Request } from 'express'

export const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated()) return res.status(404).send({ message: 'Must be logged in' })
    next()
}
