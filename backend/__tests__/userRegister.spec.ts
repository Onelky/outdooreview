import app from '../index'
import * as db from './__db__'
const request = require('supertest')

describe('Users Endpoint', () => {
    beforeAll(async () => {
        await db.connect()
    })
    afterEach(async () => {
        await db.clearDatabase()
    })
    afterAll(async () => {
        await db.closeDatabase()
    })

    it('returns OK 200 when register request is valid', () => {
        request(app).post('/api/users/register').send({ username: 'onetest', email: 'onetest@email.com', password: '123' }).expect(200)
    })

    it('returns Error when register request is invalid', () => {
        request(app).post('/api/users/register').send({}).expect(200)
    })
})
