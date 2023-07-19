import express from 'express'
import { validateCampground, isCampgroundAuthor } from '../middlewares/campground'
import { isLoggedIn } from '../middlewares'
import { createCampground, deleteCampground, findAllCampgrounds, findCampground, updateCampground } from '../controllers/campgrounds'

const router = express.Router()

router.route('/').get(findAllCampgrounds).post(isLoggedIn, validateCampground, createCampground)

router
    .route('/:id')
    .get(findCampground)
    .put(isLoggedIn, validateCampground, isCampgroundAuthor, updateCampground)
    .delete(isLoggedIn, isCampgroundAuthor, deleteCampground)

export default router
