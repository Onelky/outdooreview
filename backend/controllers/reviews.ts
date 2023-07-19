import { wrapAsync } from '../lib/utils'
import { Request, Response } from 'express'
import * as service from '../services/reviews'

export const createReview = wrapAsync(async (req: Request, res: Response) => res.send(await service.createReview(req.params.id, req.body, req.user?._id)).status(201))
export const updateReview = wrapAsync(async (req: Request, res: Response) => res.send(await service.updateReview(req.params.reviewId, req.body)).status(200))
export const deleteReview = wrapAsync(async (req: Request, res: Response) => res.send(await service.deleteReview(req.params.id, req.params.reviewId)).status(200))
