import { Schema, model, Document } from 'mongoose'

export interface IReview {
    rating: number
    body: string
}

export interface ReviewDocument extends IReview, Document {}

const ReviewSchema = new Schema({
    rating: Number,
    body: String
})

export default model<ReviewDocument>('Review', ReviewSchema)
