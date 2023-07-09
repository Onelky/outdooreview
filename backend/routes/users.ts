import { Request, Response } from 'express'
import Campground from '../models/campground'
import User from '../models/user'
import validateUser from '../schemas/user'
import { wrapAsync } from '../lib/utils'

const express = require('express')
const router = express.Router({ mergeParams: true })

router.post(
    '/register',
    validateUser,
    wrapAsync(async (req: Request, res: Response) => {
        try {
            const { email, username, password } = req.body
            const user = new User({ email, username })
            const newUser = await User.register(user, password)
            console.log('newUser', newUser)
            res.send(newUser).status(200)
        } catch (err) {
            // @ts-ignore
            res.send({ error: err.message }).status(409)
        }
    })
)
export default router
