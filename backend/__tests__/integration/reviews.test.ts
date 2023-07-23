import app from '../../app'
import * as db from '../__db__'
import User, { UserDocument } from '../../models/user'
import Campground, { CampgroundDocument } from '../../models/campground'
import { MONGODB_ID_PATTERN } from '../../lib/constants'
import Review, { IReview } from '../../models/review'
import { validUser } from '../utils/constants'
import { before } from 'node:test'

const request = require('supertest')

const validReview: IReview = { body: 'Test review', rating: 5 }

const createReview = async (basePath: string, cookie: string): Promise<string> => {
    const createdReview = await request(app).post(basePath).set('cookie', cookie).send(validReview)
    return createdReview.body._id
}

const getUnauthorizedCookie = async (): Promise<string> => {
    await User.register(new User({ username: 'unauthorizedUser', email: 'unauthorizedUser@test.com' }), 'test')
    const res = await request(app).post('/api/users/login').send({
        username: 'unauthorizedUser',
        password: 'test'
    })
    return res.headers['set-cookie']
}

const basePath = '/api/campgrounds/'

describe('Reviews routes', () => {
    let path = basePath
    let cookie
    let campground: CampgroundDocument

    beforeAll(async () => {
        await db.connect()
    })
    beforeEach(async () => {
        const userRes = await request(app).post('/api/users/register').send(validUser)
        cookie = userRes.headers['set-cookie']

        const { body } = await request(app)
            .post('/api/campgrounds')
            .set('cookie', cookie)
            .send({ title: 'Campground', price: 200, description: 'Description', location: 'Location 1', reviews: [] })

        campground = body
        path = basePath + campground._id + '/reviews/'
    })

    afterEach(async () => {
        await db.clearDatabase()
    })
    afterAll(async () => {
        await db.closeDatabase()
    })

    describe('Success', () => {
        it('should create a Review and return it', async () => {
            const res = await request(app).post(path).set('cookie', cookie).send(validReview)
            expect(res.status).toBe(200)
            expect(res.body).toMatchObject({
                _id: expect.stringMatching(MONGODB_ID_PATTERN),
                author: expect.stringMatching(MONGODB_ID_PATTERN),
                ...validReview
            })
        })

        it('should update Review with creator credentials', async () => {
            const id = await createReview(path, cookie)

            const { status, body } = await request(app)
                .put(path + id)
                .set('cookie', cookie)
                .send({ body: 'Updated body' })

            expect(status).toBe(200)
            expect(body.body).toBe('Updated body')
            expect(body._id).toBe(id)
        })
    })

    describe('Errors', () => {
        it('should return 404 error when creating a review without being logged in', (done) => {
            request(app).post(path).send(validReview).expect(404, done)
        })
        it('should return Unauthorized message when updating a Review with invalid credentials', async () => {
            const id = await createReview(path, cookie)
            const unauthorizedUser = await getUnauthorizedCookie()

            const { status, body } = await request(app)
                .put(path + id)
                .set('cookie', unauthorizedUser)
                .send({ body: 'Updated body' })

            expect(status).toBe(403)
            expect(body.message).toBe('Unauthorized')
        })
        it('should delete a Review when using creator credentials', async () => {
            const id = await createReview(path, cookie)

            const res = await request(app)
                .delete(path + id)
                .set('cookie', cookie)

            const deletedReview = await Review.findOne({ _id: id })
            expect(deletedReview).toBeNull()
            expect(res.status).toBe(200)
        })
        it('should return Unauthorized message when deleting a Review with invalid credentials', async () => {
            const id = await createReview(path, cookie)
            const unauthorizedUser = await getUnauthorizedCookie()

            const { status, body } = await request(app)
                .delete(path + id)
                .set('cookie', unauthorizedUser)

            const deletedReview = await Review.findOne({ _id: id })
            expect(deletedReview).not.toBeNull()

            expect(status).toBe(403)
            expect(body.message).toBe('Unauthorized')
        })
    })
})
