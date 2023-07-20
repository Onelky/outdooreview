import { Schema, model, Document, Types } from 'mongoose'

export interface IReview {
    rating: number
    body: string
    author?: Types.ObjectId
}

export interface ReviewDocument extends IReview, Document {}

const ReviewSchema = new Schema({
    rating: { type: Number, required: true, min: 0, max: 5 },
    body: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true }
})

export default model<ReviewDocument>('Review', ReviewSchema)
