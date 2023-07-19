import express from 'express'
import passport from 'passport'
import { validateUser } from '../middlewares/users'
import { login, logout, register } from '../controllers/users'

const router = express.Router({ mergeParams: true })

router.post('/register', validateUser, register)

router.post('/login', passport.authenticate('local', { failureMessage: 'Invalid username or password' }), login)

router.get('/logout', logout)
export default router
