import app from '../app'
import * as db from './__db__'
import User, { IUser } from '../models/user'
import Campground, { CampgroundDocument } from '../models/campground'
import { MONGODB_ID_PATTERN } from '../lib/constants'
import Review, { IReview } from '../models/review'

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

describe('Reviews CRUD', () => {
    let basePath = '/api/campgrounds/'
    let cookie
    let campground: CampgroundDocument

    beforeAll(async () => {
        await db.connect()
        campground = new Campground({ title: 'Campground', price: 200, description: 'Description', location: 'Location 1', reviews: [] })
        await campground.save()
        basePath += campground._id + '/reviews/'
    })
    beforeEach(async () => {
        const user: IUser = new User({ username: 'test', email: 'test@test.com' })
        await User.register(user, 'test')
        const res = await request(app).post('/api/users/login').send({
            username: 'test',
            password: 'test'
        })
        cookie = res.headers['set-cookie']
    })

    afterEach(async () => {
        await db.clearDatabase()
    })
    afterAll(async () => {
        await db.closeDatabase()
    })

    it('returns 404 error when creating a review without being logged in', done => {
        request(app).post(basePath).send(validReview).expect(404, done)
    })
    it('creates a Review', async () => {
        const res = await request(app).post(basePath).send(validReview).set('cookie', cookie)
        expect(res.status).toBe(200)
        expect(res.body).toMatchObject({ _id: expect.stringMatching(MONGODB_ID_PATTERN), author: expect.stringMatching(MONGODB_ID_PATTERN), ...validReview })
    })

    it('updates Review with creator credentials', async () => {
        const id = await createReview(basePath, cookie)

        const { status, body } = await request(app)
            .put(basePath + id)
            .set('cookie', cookie)
            .send({ body: 'Updated body' })

        expect(status).toBe(200)
        expect(body.body).toBe('Updated body')
        expect(body._id).toBe(id)
    })

    it('returns Unauthorized message when updating a Review with invalid credentials', async () => {
        const id = await createReview(basePath, cookie)
        const unauthorizedUser = await getUnauthorizedCookie()

        const { status, body } = await request(app)
            .put(basePath + id)
            .set('cookie', unauthorizedUser)
            .send({ body: 'Updated body' })

        expect(status).toBe(403)
        expect(body.message).toBe('Unauthorized')
    })
    it('deletes a Review when using creator credentials', async () => {
        const id = await createReview(basePath, cookie)

        const res = await request(app)
            .delete(basePath + id)
            .set('cookie', cookie)

        const deletedReview = await Review.findOne({ _id: id })
        expect(deletedReview).toBeNull()
        expect(res.status).toBe(200)
    })
    it('returns Unauthorized message when deleting a Review with invalid credentials', async () => {
        const id = await createReview(basePath, cookie)
        const unauthorizedUser = await getUnauthorizedCookie()

        const { status, body } = await request(app)
            .delete(basePath + id)
            .set('cookie', unauthorizedUser)

        const deletedReview = await Review.findOne({ _id: id })
        expect(deletedReview).not.toBeNull()

        expect(status).toBe(403)
        expect(body.message).toBe('Unauthorized')
    })
})
