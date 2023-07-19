import express from 'express'
import { isReviewAuthor, validateReview } from '../middlewares/reviews'
import { isLoggedIn } from '../middlewares'
import { findCampground } from '../controllers/campgrounds'
import { createReview, deleteReview, updateReview } from '../controllers/reviews'

const router = express.Router({ mergeParams: true })

router.get('/', findCampground)

router.post('/', isLoggedIn, validateReview, createReview)

router.put('/:reviewId', isLoggedIn, validateReview, isReviewAuthor, updateReview)

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, deleteReview)

export default router
