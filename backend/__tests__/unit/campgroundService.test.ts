import * as service from '../../services/campground'
import * as db from '../__db__'
import { Error } from 'mongoose'
import Campground, { CampgroundDocument } from '../../models/campground'
import User, { UserDocument } from '../../models/user'
import { validCampground, validUser } from '../utils/constants'

describe('Campgrounds Service', () => {
    beforeAll(async () => {
        await db.connect()
    })
    afterEach(async () => {
        await db.clearDatabase()
    })
    afterAll(async () => {
        await db.closeDatabase()
    })
    describe('Get All Campgrounds', () => {
        it('should return all campgrounds', async () => {
            const campgrounds = await service.findAllCampgrounds()
            expect(campgrounds).not.toBeUndefined()
        })
    })
    describe('Create Campground', () => {
        let author: UserDocument

        beforeAll(async () => {
            author = new User(validUser)
            await author.save()
        })
        it('should insert a new doc in Campground collection', async () => {
            const newCampground = await service.createCampground(validCampground, author._id)
            const found = await Campground.findById(newCampground._id)
            expect(found).not.toBeUndefined()
            expect(found?._id).toEqual(newCampground?._id)
        })

        it('should throw ValidationError when creating Campground without required fields', async () => {
            await expect(
                // @ts-expect-error
                async () => await service.createCampground({ description: 'Description', location: 'location', price: 200, reviews: [] }, author._id)
            ).rejects.toThrow(Error.ValidationError)
        })
    })

    describe('Get, Update and Delete Campground', () => {
        let author: UserDocument
        let savedCampground: CampgroundDocument

        beforeAll(async () => {
            author = new User(validUser)
            await author.save()
        })
        beforeEach(async () => {
            savedCampground = new Campground({ ...validCampground, author: author._id })
            await savedCampground.save()
        })
        it('should return data of Campground', async () => {
            const campground = await service.findCampground(savedCampground._id)
            expect(campground).not.toBeUndefined()
            expect(campground?._id).toEqual(savedCampground?._id)
        })

        it('should update Campground in collection', async () => {
            const campground = await service.updateCampground(savedCampground._id, { title: 'new title' })
            expect(campground.title).toBe('new title')
        })

        it('should delete Campground from collection', async () => {
            await service.deleteCampground(savedCampground._id)
            const deleted = await Campground.findById(savedCampground._id)
            expect(deleted).toBeNull()
        })
        describe('Errors', () => {
            it('should throw ValidationError when Campground title is null', async () => {
                await expect(async () => await service.updateCampground(savedCampground._id, { title: null } as any)).rejects.toThrow(Error.ValidationError)
            })

            it('should throw ValidationError when id does not belong to a Campground', async () => {
                await expect(async () => await service.updateCampground('5effaa5662679b5af2c58829', { title: null } as any)).rejects.toThrow(
                    Error.ValidationError
                )
            })
        })
    })
})
