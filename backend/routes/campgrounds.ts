import express from 'express'
import { validateCampground, isCampgroundAuthor } from '../middlewares/campground'
import { isLoggedIn } from '../middlewares'
import { createCampground, deleteCampground, findAllCampgrounds, findCampground, updateCampground } from '../controllers/campgrounds'

const router = express.Router()

router.get('/', findAllCampgrounds)

router.post('/', isLoggedIn, validateCampground, createCampground)

router.get('/:id', findCampground)

router.put('/:id', isLoggedIn, validateCampground, isCampgroundAuthor, updateCampground)

router.delete('/:id', isLoggedIn, isCampgroundAuthor, deleteCampground)

export default router
