const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ReviewSchema = new Schema({
    rating: Number,
    body: String
})

export default mongoose.model('Review', ReviewSchema)
