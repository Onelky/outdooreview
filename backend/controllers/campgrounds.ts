import geocoding from '@mapbox/mapbox-sdk/services/geocoding'
import { wrapAsync } from '../lib/utils'
import { Request, Response } from 'express'
import * as service from '../services/campground'

const geocoder = geocoding({ accessToken: process.env.MAPBOX_TOKEN })

const formatCampground = (campground, geoData, files) => {
    return {
        ...campground,
        ...(campground.price && { price: Number(campground.price) }),
        ...(geoData && { geometry: geoData.body.features[0].geometry }),
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        ...(files.length && { images: files.map((file) => ({ url: file.path, filename: file.filename })) })
    }
}

export const findAllCampgrounds = wrapAsync(async (req: Request, res: Response) => res.send(await service.findAllCampgrounds()).status(200))
export const createCampground = wrapAsync(async (req: Request, res: Response) => {
    const { files = [], body } = req
    const geoData = await geocoder.forwardGeocode({ query: body.location, limit: 1 }).send()
    const campground = formatCampground({ ...body, author: req.user?._id }, geoData, files)
    res.send(await service.createCampground(campground, req.user?._id)).status(201)
})
export const findCampground = wrapAsync(async (req: Request, res: Response) => res.send(await service.findCampground(req.params.id)).status(200))

export const updateCampground = wrapAsync(async (req: Request, res: Response) => {
    const { files = [], body } = req
    let geoData
    if (body.location) geoData = await geocoder.forwardGeocode({ query: body.location, limit: 1 }).send()
    const campground = formatCampground(body, geoData, files)
    res.send(await service.updateCampground(req.params.id, campground)).status(200)
})

export const deleteCampground = wrapAsync(async (req: Request, res: Response) => res.send(await service.deleteCampground(req.params.id)).status(200))
