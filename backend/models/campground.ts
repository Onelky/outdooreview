import { Review } from './review'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CampgroundSchema = new Schema({
    title: String,
    price: Number,
    description: String,
    location: String,
    reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }]
})

// @ts-ignore
CampgroundSchema.post('findOneAndDelete', async doc => {
    if (doc) {
        await Review.deleteMany({
            _id: { $in: doc.reviews }
        })
    }
})
export const Campground = mongoose.model('Campground', CampgroundSchema)
