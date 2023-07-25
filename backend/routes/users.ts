import express from 'express'
import passport from 'passport'
import { validateUser } from '../middlewares/users'
import { login, logout, register } from '../controllers/users'
import { isLoggedIn } from '../middlewares'

const router = express.Router({ mergeParams: true })

router.post('/register', validateUser, register)

router.post('/login', passport.authenticate('local', { failureMessage: 'Invalid username or password' }), login)
router.get('/auth/google', passport.authenticate('google', { scope: ['email', 'profile'] }))
router.get('/auth/google/callback', passport.authenticate('google'), (req, res) => {
    res.send(req.user)
})
router.get('/logout', isLoggedIn, logout)
export default router
