import { Schema, model, Document, Types } from 'mongoose'
import Review, { IReview } from './review'

export interface ICampground {
    title: string
    price: number
    description: string
    location: string
    author?: Types.ObjectId
    reviews: IReview[]
}

export interface CampgroundDocument extends ICampground, Document {}

const CampgroundSchema = new Schema({
    title: String,
    price: Number,
    description: String,
    location: String,
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }]
})

CampgroundSchema.post('findOneAndDelete', async doc => {
    if (doc) {
        await Review.deleteMany({
            _id: { $in: doc.reviews }
        })
    }
})
export default model<CampgroundDocument>('Campground', CampgroundSchema)
