import app from '../../app'
import * as db from '../__db__'
import { MONGODB_ID_PATTERN } from '../../lib/constants'
import User, { IUser, UserDocument } from '../../models/user'
const request = require('supertest')

describe('User Login', () => {
    const password = 'test'
    const email = 'test@email.com'
    const path = '/api/users/login'
    let mockUser: Partial<IUser> = { username: 'test', password }
    let postRequest

    beforeAll(async () => {
        await db.connect()
        postRequest = request(app).post
    })

    beforeEach(async () => {
        const user: UserDocument = new User({ ...mockUser, email })
        const newUser = await User.register(user, password)
    })
    afterEach(async () => {
        await db.clearDatabase()
    })
    afterAll(async () => {
        await db.closeDatabase()
    })

    describe('Success', () => {
        it('should return OK 200 and user data when login request is valid', (done) => {
            postRequest(path)
                .send(mockUser)
                .then((response) => {
                    const { body, status } = response
                    expect(status).toBe(200)
                    expect(body._id).toMatch(MONGODB_ID_PATTERN)
                    expect(body.username).toBe(mockUser.username)
                    expect(body.email).toBe(email)
                    done()
                })
        })
        it('should log out and return 204 code', async () => {
            const loginRequest = await postRequest(path).send(mockUser)
            const cookie = loginRequest.headers['set-cookie']
            const logoutReq = await request(app).get('/api/users/logout').set('cookie', cookie)
            expect(logoutReq.status).toBe(204)
        })
    })

    describe('Errors', () => {
        it('should return Bad Request 400 when password is null', (done) => {
            postRequest(path)
                .send({ ...mockUser, password: null })
                .expect(400, done)
        })

        it('should return Bad Request 400 when username is null', (done) => {
            postRequest(path)
                .send({ ...mockUser, username: null })
                .expect(400, done)
        })

        it('should return 401 Unauthorized code when username or password is invalid', (done) => {
            postRequest(path)
                .send({ ...mockUser, username: 'wrongUsername' })
                .expect(401, done)
        })
    })
})
