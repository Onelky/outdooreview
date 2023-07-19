import Review, { ReviewDocument, IReview } from '../models/review'
import Campground, { CampgroundDocument } from '../models/campground'

export const createReview = async (campgroundId: string, data: IReview, author: string): Promise<ReviewDocument> => {
    const campground = await Campground.findById(campgroundId)
    const review = new Review({ ...data, author })
    campground?.reviews.push(review)
    await review.save()
    await campground?.save()
    return review
}

export const updateReview = async (id: string, data: Partial<IReview>): Promise<ReviewDocument> => {
    return (await Review.findByIdAndUpdate(id, data, { returnDocument: 'after' })) as ReviewDocument
}
export const deleteReview = async (id: string, reviewId: string): Promise<CampgroundDocument> => {
    await Review.findByIdAndDelete(reviewId)
    const campground = await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    return campground as CampgroundDocument
}
