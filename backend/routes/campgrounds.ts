import express from 'express'
import multer from 'multer'
import { validateCampground, isCampgroundAuthor } from '../middlewares/campground'
import { isLoggedIn } from '../middlewares'
import { createCampground, deleteCampground, findAllCampgrounds, findCampground, updateCampground } from '../controllers/campgrounds'
import { storage } from '../cloudinaryConfig'

const router = express.Router()

// const upload = multer({ dest: 'uploads' })
const upload = multer({ storage })

router.route('/').get(findAllCampgrounds).post(isLoggedIn, upload.array('images'), validateCampground, createCampground)

router
    .route('/:id')
    .get(findCampground)
    .put(isLoggedIn, isCampgroundAuthor, upload.array('images'), validateCampground, updateCampground)
    .delete(isLoggedIn, isCampgroundAuthor, deleteCampground)

export default router
