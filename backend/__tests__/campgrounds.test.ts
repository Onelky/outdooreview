import app from '../app'
import * as db from './__db__'
import User, { IUser } from '../models/user'
import Campground, { ICampground } from '../models/campground'
import { MONGODB_ID_PATTERN } from '../lib/constants'

const request = require('supertest')

const validCampground: ICampground = { title: 'Campground', price: 200, description: 'Description', location: 'Location 1', reviews: [] }

const getUnauthorizedCookie = async (): Promise<string> => {
    await User.register(new User({ username: 'unauthorizedUser', email: 'unauthorizedUser@test.com' }), 'test')
    const res = await request(app).post('/api/users/login').send({
        username: 'unauthorizedUser',
        password: 'test'
    })
    return res.headers['set-cookie']
}

const createCampground = async (validUserId: string): Promise<string> => {
    const savedCampground = new Campground({ ...validCampground, author: validUserId })
    await savedCampground.save()
    return savedCampground._id.toString()
}

describe('Campgrounds', () => {
    const basePath = '/api/campgrounds/'
    let cookie, validUserId

    beforeAll(async () => {
        await db.connect()
    })
    beforeEach(async () => {
        const user: IUser = new User({ username: 'test', email: 'test@test.com' })
        await User.register(user, 'test')
        const res = await request(app).post('/api/users/login').send({
            username: 'test',
            password: 'test'
        })
        validUserId = res.body._id
        cookie = res.headers['set-cookie']
    })

    afterEach(async () => {
        await db.clearDatabase()
    })
    afterAll(async () => {
        await db.closeDatabase()
    })

    it('returns 404 error when creating a campground without being logged in', done => {
        request(app).post(basePath).send(validCampground).expect(404, done)
    })
    it('creates a Campground', done => {
        request(app)
            .post(basePath)
            .send(validCampground)
            .set('cookie', cookie)
            .then(response => {
                const { status, body } = response
                expect(status).toBe(200)
                expect(body).toMatchObject({ _id: expect.stringMatching(MONGODB_ID_PATTERN), author: expect.stringMatching(MONGODB_ID_PATTERN), ...validCampground })
                done()
            })
    })

    it('returns a Campground with its author', async () => {
        const id = await createCampground(validUserId)
        const result = await request(app).get(basePath + id)
        expect(result.status).toBe(200)
        expect(result.body).toBeDefined()
        expect(result.body._id).toEqual(id)
        expect(result.body.author).not.toBeUndefined()
    })

    it('updates Campground when using creator credentials', async () => {
        const id = await createCampground(validUserId)

        const result = await request(app)
            .put(basePath + id)
            .set('cookie', cookie)
            .send({ title: 'Updated title' })

        expect(result.status).toBe(200)
        expect(result.body.title).toBe('Updated title')
        expect(result.body._id).toBe(id)
    })

    it('returns Unauthorized message when using invalid credentials to update a Campground', async () => {
        const unauthorizedUser = await getUnauthorizedCookie()
        const id = await createCampground(validUserId)

        const result = await request(app)
            .put(basePath + id)
            .send({ title: 'Updated title' })
            .set('cookie', unauthorizedUser)

        expect(result.status).toBe(403)
        expect(result.body.message).toBe('Unauthorized')
    })

    it('returns Unauthorized message when updating a Campground without being logged in', async () => {
        const id = await createCampground(validUserId)
        const result = await request(app)
            .put(basePath + id)
            .send({ title: 'Updated title' })

        expect(result.status).toBe(404)
        expect(result.body.message).toBe('Must be logged in')
    })

    it('deletes a Campground when using creator credentials', async () => {
        const id = await createCampground(validUserId)
        const result = await request(app)
            .delete(basePath + id)
            .set('cookie', cookie)

        const deletedCampground = await Campground.findOne({ _id: id })
        expect(deletedCampground).toBeNull()
        expect(result.status).toBe(200)
    })

    it('returns Unauthorized message when using invalid credentials to delete a Campground', async () => {
        const id = await createCampground(validUserId)
        const unauthorizedUser = await getUnauthorizedCookie()

        const result = await request(app)
            .delete(basePath + id)
            .set('cookie', unauthorizedUser)

        expect(result.status).toBe(403)
        expect(result.body.message).toBe('Unauthorized')
    })
})
