import { NextFunction, Request, Response } from 'express'
import { wrapAsync } from '../lib/utils'
import * as service from '../services/users'

export const register = wrapAsync(async (req, res, next) => {
    try {
        const newUser = await service.createUser(req.body)
        req.login(newUser, (err) => {
            if (err && next) return next(err)
            res.send(newUser).status(200)
        })
    } catch (err) {
        res.send({ error: err.message }).status(409)
    }
})

export const login = wrapAsync(async (req: Request, res: Response) => {
    try {
        return res.send(req.user).status(200)
    } catch (err) {
        return res.send({ error: 'Incorrect username or password' }).status(404)
    }
})
export const logout = (req: Request, res: Response, next: NextFunction) => {
    req.logout(function (err) {
        if (err) {
            return next(err)
        }
        return res.status(204).send({ message: 'Logged out' })
    })
}
