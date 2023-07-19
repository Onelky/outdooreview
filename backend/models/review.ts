import { Schema, model, Document, Types } from 'mongoose'

export interface IReview {
    rating: number
    body: string
    author?: Types.ObjectId
}

export interface ReviewDocument extends IReview, Document {}

const ReviewSchema = new Schema({
    rating: Number,
    body: String,
    author: { type: Schema.Types.ObjectId, ref: 'User' }
})

export default model<ReviewDocument>('Review', ReviewSchema)
