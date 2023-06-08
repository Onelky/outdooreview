const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ReviewSchema = new Schema({
    rating: Number,
    body: String
})

export const Review = mongoose.model('Review', ReviewSchema)
