import express from 'express'
import { isReviewAuthor, validateReview } from '../middlewares/reviews'
import { isLoggedIn } from '../middlewares'
import { findCampground } from '../controllers/campgrounds'
import { createReview, deleteReview, updateReview } from '../controllers/reviews'

const router = express.Router({ mergeParams: true })

router.route('/').get(findCampground).post(isLoggedIn, validateReview, createReview)

router.route('/:reviewId').put(isLoggedIn, validateReview, isReviewAuthor, updateReview).delete(isLoggedIn, isReviewAuthor, deleteReview)

export default router
