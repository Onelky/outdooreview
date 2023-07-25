import * as service from '../../services/users'
import * as db from '../__db__'
import { Error } from 'mongoose'
import User from '../../models/user'

describe('Users Service', () => {
    beforeAll(async () => {
        await db.connect()
    })
    afterEach(async () => {
        await db.clearDatabase()
    })
    afterAll(async () => {
        await db.closeDatabase()
    })
    describe('Create User', () => {
        const validUser = { username: 'username', email: 'username@email.com' }
        const validUserWithPassword = { ...validUser, password: 'password' }

        it('should insert a new doc in User collection', async () => {
            const newUser = await service.registerUser(validUserWithPassword)
            const found = await User.findById(newUser._id)
            expect(found).not.toBeUndefined()
            expect(found?._id).toEqual(newUser?._id)
        })

        describe('Errors', () => {
            it('should throw MissingUsernameError when username is not given', async () => {
                await expect(
                    // @ts-expect-error
                    async () => await service.registerUser({ email: 'email', password: 'passw0rd' })
                ).rejects.toMatchObject({ name: 'MissingUsernameError' })
            })

            it('should throw ValidationError when email is invalid', async () => {
                await expect(
                    async () => await service.registerUser({ username: 'username', email: 'invalidEmail', password: 'passw0rd' })
                ).rejects.toThrowError(Error.ValidationError)
            })
            it('should return UserExistsError when username already exists', async () => {
                await expect(async () => {
                    await service.registerUser(validUserWithPassword)
                    await service.registerUser({ ...validUserWithPassword, password: 'differentPassword' })
                }).rejects.toMatchObject({ name: 'UserExistsError' })
            })
        })
    })
})
