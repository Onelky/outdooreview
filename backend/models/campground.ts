import { Schema, model, Document, Types } from 'mongoose'
import Review, { IReview } from './review'

export interface Image {
    url: string
    filename: string
}
export interface ICampground {
    title: string
    price: number
    description: string
    location: string
    author?: Types.ObjectId
    reviews: IReview[]
    images?: Image[]
}

export interface CampgroundDocument extends ICampground, Document {}

const CampgroundSchema = new Schema({
    title: { type: String, required: true },
    price: { type: Number, required: true },
    description: String,
    location: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
    images: [{ url: String, filename: String }]
})

CampgroundSchema.post('findOneAndDelete', async (doc) => {
    if (doc) {
        await Review.deleteMany({
            _id: { $in: doc.reviews }
        })
    }
})
export default model<CampgroundDocument>('Campground', CampgroundSchema)
