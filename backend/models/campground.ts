import { Schema, model, Document, Types } from 'mongoose'
import Review, { IReview } from './review'

export enum GeometryTypes {
    Point = 'Point'
}

export interface Image {
    url: string
    filename: string
}
export interface ICampground {
    title: string
    price: number
    description: string
    location: string
    geometry: { type: GeometryTypes; coordinates: number[] }
    author?: Types.ObjectId
    reviews: IReview[]
    images?: Image[]
    deleteImages?: string[]
}

export interface CampgroundDocument extends ICampground, Document {}

const ImageSchema = new Schema(
    { url: String, filename: String },
    {
        toJSON: { virtuals: true },
        virtuals: {
            // creates a virtual property with a 300px image
            thumbnail: {
                get() {
                    return this?.url?.replace('/upload', '/upload/w_300')
                }
            }
        }
    }
)

const CampgroundSchema = new Schema({
    title: { type: String, required: true },
    price: { type: Number, required: true },
    description: String,
    location: { type: String, required: true },
    geometry: { type: { type: String, enum: ['Point'], required: true }, coordinates: { type: [Number], required: true } },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
    images: [ImageSchema]
})

CampgroundSchema.post('findOneAndDelete', async (doc) => {
    if (doc) {
        await Review.deleteMany({
            _id: { $in: doc.reviews }
        })
    }
})
export default model<CampgroundDocument>('Campground', CampgroundSchema)
