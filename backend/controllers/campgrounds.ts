import { wrapAsync } from '../lib/utils'
import { Request, Response } from 'express'
import * as service from '../services/campground'

export const findAllCampgrounds = wrapAsync(async (req: Request, res: Response) => res.send(await service.findAllCampgrounds()).status(200))
export const createCampground = wrapAsync(async (req: Request, res: Response) => res.send(await service.createCampground(req.body, req.user?._id)).status(201))
export const findCampground = wrapAsync(async (req: Request, res: Response) => res.send(await service.findCampground(req.params.id)).status(200))
export const updateCampground = wrapAsync(async (req: Request, res: Response) => res.send(await service.updateCampground(req.params.id, req.body)).status(200))
export const deleteCampground = wrapAsync(async (req: Request, res: Response) => res.send(await service.deleteCampground(req.params.id)).status(200))
