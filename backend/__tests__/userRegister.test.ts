import app from '../app'
import * as db from './__db__'
import { MONGODB_ID_PATTERN } from '../lib/constants'
import User, { IUser } from '../models/user'
const request = require('supertest')

describe('User Registration', () => {
    const mockUser = { username: 'onelky', email: 'onelky@email.com' }
    const mockUserWithPassword = { ...mockUser, password: '123' }

    beforeAll(async () => {
        await db.connect()
    })

    afterEach(async () => {
        await db.clearDatabase()
    })
    afterAll(async () => {
        await db.closeDatabase()
    })

    it('returns OK 200 when register request is valid', done => {
        request(app).post('/api/users/register').send(mockUserWithPassword).expect(200, done)
    })

    it('returns user when register request is valid', done => {
        request(app)
            .post('/api/users/register')
            .send(mockUserWithPassword)
            .then(response => {
                expect(response.body).toMatchObject({ _id: expect.stringMatching(MONGODB_ID_PATTERN), ...mockUser })
                done()
            })
    })

    it('returns Bad Request 400 when password is null', done => {
        request(app).post('/api/users/register').send(mockUser).expect(400, done)
    })

    it('returns Bad Request 400 when username is null', done => {
        request(app)
            .post('/api/users/register')
            .send({ ...mockUserWithPassword, username: null })
            .expect(400, done)
    })

    it('inserts a valid user into users collection', async () => {
        const user: IUser = new User(mockUser)
        const newUser = await User.register(user, mockUserWithPassword.password)

        expect(newUser._id).toBeDefined()
        expect(newUser.hash).toBeDefined()
        expect(newUser.salt).toBeDefined()
        expect(newUser.email).toBe(mockUser.email)
        expect(newUser.username).toBe(mockUser.username)
    })

    it('returns MissingUsernameError error when username is not defined', async () => {
        try {
            const user: IUser = new User({ email: 'randomUsername' })
            const newUser = await User.register(user, mockUserWithPassword.password)
        } catch (error) {
            expect(error).toBeDefined()
            expect(error.name).toBe('MissingUsernameError')
        }
    })

    it('returns UserExistsError when username already exists', async () => {
        try {
            const user: IUser = new User(mockUser)
            const registeredUser = await User.register(user, mockUserWithPassword.password)
            const newUser = await User.register(user, 'differentPassword')
        } catch (error) {
            expect(error).toBeDefined()
            expect(error.name).toBe('UserExistsError')
        }
    })
})
