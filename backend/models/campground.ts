import { Schema, model, Document } from 'mongoose'
import Review, { IReview } from './review'

export interface ICampground extends Document {
    email: string
    title: string
    price: number
    description: string
    location: string
    reviews: IReview[]
}
const CampgroundSchema = new Schema({
    title: String,
    price: Number,
    description: String,
    location: String,
    reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }]
})

CampgroundSchema.post('findOneAndDelete', async doc => {
    if (doc) {
        await Review.deleteMany({
            _id: { $in: doc.reviews }
        })
    }
})
export default model<ICampground>('Campground', CampgroundSchema)
