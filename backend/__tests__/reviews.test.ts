import app from '../app'
import * as db from './__db__'
import User, { IUser } from '../models/user'
import Campground, { CampgroundDocument, ICampground } from '../models/campground'
import { MONGODB_ID_PATTERN } from '../lib/constants'
import Review, { IReview } from '../models/review'
const request = require('supertest')

describe('Reviews CRUD', () => {
    let basePath = '/api/campgrounds/'
    let cookie
    let campground: CampgroundDocument
    const validReview: IReview = { body: 'Test review', rating: 5 }

    beforeAll(async () => {
        await db.connect()
        campground = new Campground({ title: 'Campground', price: 200, description: 'Description', location: 'Location 1', reviews: [] })
        await campground.save()
        basePath += campground._id + '/reviews'
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
        expect(res.body).toMatchObject({ _id: expect.stringMatching(MONGODB_ID_PATTERN), ...validReview })
    })

    // it('returns a Campground', async () => {
    //     const newCampground = new Campground(validCampground)
    //     await newCampground.save()
    //     const id = newCampground._id.toString()
    //     const result = await request(app).get(basePath + id)
    //     expect(result.status).toBe(200)
    //     expect(result.body).toBeDefined()
    //     expect(result.body._id).toEqual(id)
    // })
    //
    // it('updates a Campground', async () => {
    //     const savedCampground = new Campground(validCampground)
    //     await savedCampground.save()
    //     const id = savedCampground._id.toString()
    //
    //     const result = await request(app)
    //         .put(basePath + id)
    //         .send({ title: 'Updated title' })
    //         .set('cookie', cookie)
    //
    //     expect(result.status).toBe(200)
    //     expect(result.body.title).toBe('Updated title')
    //     expect(result.body._id).toBe(id)
    // })
    //
    it('deletes a Review', async () => {
        const createdReview = await request(app).post(basePath).send(validReview).set('cookie', cookie)
        const id = createdReview.body._id
        expect(id).toMatch(MONGODB_ID_PATTERN)

        const res = await request(app)
            .delete(basePath + '/' + id)
            .set('cookie', cookie)

        const deletedReview = await Review.findOne({ _id: id })
        expect(deletedReview).toBeNull()
        expect(res.status).toBe(200)
    })
})
