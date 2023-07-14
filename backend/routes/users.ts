import { NextFunction, Request, Response } from 'express'
import passport from 'passport'
import pick from 'lodash/pick'
import Campground from '../models/campground'
import User from '../models/user'
import validateUser from '../schemas/user'
import { wrapAsync } from '../lib/utils'

const express = require('express')
const router = express.Router({ mergeParams: true })

router.post(
    '/register',
    validateUser,
    wrapAsync(async (req, res, next) => {
        try {
            const { email, username, password } = req.body
            const user = new User({ email, username })
            const newUser = await User.register(user, password)
            req.login(newUser, err => {
                if (err && next) return next(err)
                res.send(pick(newUser, ['_id', 'username', 'email'])).status(200)
            })
        } catch (err) {
            // @ts-ignore
            res.send({ error: err.message }).status(409)
        }
    })
)

router.post(
    '/login',
    passport.authenticate('local', { failureMessage: true, failWithError: true }),
    wrapAsync(async (req: Request, res: Response) => {
        try {
            return res.send('Signed up!').status(200)
        } catch (err) {
            return res.send({ error: 'Incorrect username or password' }).status(404)
        }
    })
)

router.get('/logout', (req: Request, res: Response, next: NextFunction) => {
    req.logout(function (err) {
        if (err) {
            return next(err)
        }
        res.send({ message: 'Logged out' })
    })
})
export default router
