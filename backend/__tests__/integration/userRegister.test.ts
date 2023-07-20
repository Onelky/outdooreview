import app from '../../app'
import * as db from '../__db__'
import { MONGODB_ID_PATTERN } from '../../lib/constants'
import User, { IUser, UserDocument } from '../../models/user'
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
    describe('Success', () => {
        it('should return 200 and user data after registration', (done) => {
            request(app)
                .post('/api/users/register')
                .send(mockUserWithPassword)
                .then((response) => {
                    const { body, status } = response
                    expect(status).toBe(200)
                    expect(body).toMatchObject({ _id: expect.stringMatching(MONGODB_ID_PATTERN), ...mockUser })
                    done()
                })
        })
    })

    describe('Errors', () => {
        it('should return Bad Request 400 and error message when password is null', (done) => {
            request(app)
                .post('/api/users/register')
                .send(mockUser)
                .then((response) => {
                    expect(response.body.password).not.toBeUndefined()
                    done()
                })
        })

        it('should return Bad Request 400 and error message when username is null', (done) => {
            request(app)
                .post('/api/users/register')
                .send({ ...mockUserWithPassword, username: null })
                .then((response) => {
                    expect(response.body.username).not.toBeUndefined()
                    done()
                })
        })
    })
})
