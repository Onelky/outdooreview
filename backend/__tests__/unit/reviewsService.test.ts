import { Error } from 'mongoose'
import * as db from '../__db__'
import * as service from '../../services/reviews'
import Review, { ReviewDocument } from '../../models/review'
import User, { UserDocument } from '../../models/user'
import Campground, { CampgroundDocument } from '../../models/campground'
import { validCampground, validUser } from '../utils/constants'

describe('Reviews Service', () => {
    let campground: CampgroundDocument
    let author: UserDocument

    beforeAll(async () => {
        await db.connect()
    })
    beforeEach(async () => {
        author = new User(validUser)
        await author.save()
        campground = new Campground({ ...validCampground, author: author._id })
        await campground.save()
    })
    afterEach(async () => {
        await db.clearDatabase()
    })
    afterAll(async () => {
        await db.closeDatabase()
    })
    describe('Create Review', () => {
        beforeEach(async () => {})
        it('should insert a new doc in Review collection', async () => {
            const newReview = await service.createReview(campground._id, { body: 'Review', rating: 2 }, author._id)
            const found = await Review.findById(newReview._id)
            expect(found).not.toBeUndefined()
            expect(found?._id).toEqual(newReview?._id)
        })

        it('should throw ValidationError when creating Review without required fields', async () => {
            await expect(
                // @ts-expect-error
                async () => await service.createReview(campground._id, { body: 'Description' }, author._id)
            ).rejects.toThrow(Error.ValidationError)
        })
    })

    describe('Get, Update and Delete Review', () => {
        let savedReview: ReviewDocument

        beforeEach(async () => {
            savedReview = new Review({ body: 'Title', rating: 4, author: author._id })
            await savedReview.save()
            campground.reviews.push(savedReview._id)
            await campground.save()
        })

        it('should update Review in collection', async () => {
            const review = await service.updateReview(savedReview._id, { body: 'new body' })
            expect(review.body).toBe('new body')
        })

        it('should delete Review from Campground and Review collection', async () => {
            await service.deleteReview(campground.id, savedReview._id)
            const deleted = await Review.findById(savedReview._id)
            const updatedCampground = await Campground.findById(campground._id)
            expect(updatedCampground?.reviews?.length).toBe(0)
            expect(deleted).toBeNull()
        })
        describe('Errors', () => {
            it('should throw ValidationError when body is null', async () => {
                await expect(async () => await service.updateReview(savedReview._id, { body: null } as any)).rejects.toThrow(Error.ValidationError)
            })

            it('should throw ValidationError when rating is less than 0', async () => {
                await expect(async () => await service.updateReview(savedReview._id, { rating: -6 })).rejects.toThrow(Error.ValidationError)
            })

            it('should throw ValidationError when rating is bigger than 5', async () => {
                await expect(async () => await service.updateReview(savedReview._id, { rating: 6 })).rejects.toThrow(Error.ValidationError)
            })

            it('should throw ValidationError when id does not belong to a Review', async () => {
                const result = await service.updateReview('5effaa5662679b5af2c58829', { body: 'update' })
                expect(result).toBeNull()
            })
        })
    })
})
