import { wrapAsync } from '../lib/utils'
import { Request, Response } from 'express'
import * as service from '../services/campground'

export const findAllCampgrounds = wrapAsync(async (req: Request, res: Response) => res.send(await service.findAllCampgrounds()).status(200))
export const createCampground = wrapAsync(async (req: Request, res: Response) => {
    const { files = [], body } = req
    const campground = {
        ...body,
        price: Number(body.price),
        author: req.user?._id,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        ...(files.length && { images: files.map((file) => ({ url: file.path, filename: file.filename })) })
    }
    res.send(await service.createCampground(campground, req.user?._id)).status(201)
})
export const findCampground = wrapAsync(async (req: Request, res: Response) => res.send(await service.findCampground(req.params.id)).status(200))
export const updateCampground = wrapAsync(async (req: Request, res: Response) => res.send(await service.updateCampground(req.params.id, req.body)).status(200))
export const deleteCampground = wrapAsync(async (req: Request, res: Response) => res.send(await service.deleteCampground(req.params.id)).status(200))
