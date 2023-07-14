import { Schema, model, Document } from 'mongoose'

export interface IReview extends Document {
    rating: number
    body: string
}
const ReviewSchema = new Schema({
    rating: Number,
    body: String
})

export default model<IReview>('Review', ReviewSchema)
