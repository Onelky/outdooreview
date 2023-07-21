import Campground, { CampgroundDocument, ICampground } from '../models/campground'
import isEmpty from 'lodash/isEmpty'
import cloudinary from '../cloudinaryConfig'
export const findAllCampgrounds = async (): Promise<ICampground[]> => await Campground.find({})

export const createCampground = async (data: ICampground, author: string): Promise<CampgroundDocument> => {
    const campground = new Campground({ ...data, author })
    await campground.save()
    return campground as CampgroundDocument
}

export const findCampground = async (id: string): Promise<CampgroundDocument> => {
    return (await Campground.findById(id)
        .populate({ path: 'reviews', populate: { path: 'author' } })
        .populate('author')) as CampgroundDocument
}

export const updateCampground = async (id: string, data: Partial<ICampground>): Promise<CampgroundDocument> => {
    const { images, deleteImages, ...update } = data
    if (!isEmpty(deleteImages)) deleteImages?.forEach((filename) => cloudinary.uploader.destroy(filename))
    return (await Campground.findByIdAndUpdate(
        id,
        { ...update, ...(images && { $push: { images } }), ...(deleteImages && { $pull: { images: { filename: { $in: deleteImages } } } }) },
        { runValidators: true, returnDocument: 'after' }
    )) as CampgroundDocument
}
export const deleteCampground = async (id: string): Promise<CampgroundDocument> => {
    return (await Campground.findByIdAndDelete(id)) as CampgroundDocument
}
