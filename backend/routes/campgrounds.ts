import { Request, Response } from 'express'
import Campground from '../models/campground'
import { validateCampground } from '../schemas/campground'
import { wrapAsync } from '../lib/utils'

const express = require('express')
const router = express.Router()

router.get(
    '/',
    wrapAsync(async (req: Request, res: Response) => {
        const campgrounds = await Campground.find({})
        res.send(campgrounds)
    })
)

router.post(
    '/',
    validateCampground,
    wrapAsync(async (req: Request, res: Response) => {
        const campground = new Campground(req.body)
        await campground.save()
        res.send(campground)
    })
)

router.get(
    '/:id',
    wrapAsync(async (req: Request, res: Response) => {
        const campground = await Campground.findById(req.params.id)
        res.send(campground)
    })
)

router.put(
    '/:id',
    validateCampground,
    wrapAsync(async (req: Request, res: Response) => {
        const campground = await Campground.findByIdAndUpdate(req.params.id, req.body)
        res.send(campground)
    })
)

router.delete(
    '/:id',
    wrapAsync(async (req: Request, res: Response) => {
        const campground = await Campground.findByIdAndDelete(req.params.id)
        res.send(campground)
    })
)

export default router
