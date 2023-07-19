import { z } from 'zod'

const reviewSchema = z
    .object({
        body: z.string({ required_error: 'Body is required!', invalid_type_error: 'Body must be a string' }),
        rating: z
            .number({ required_error: 'Rating is required', invalid_type_error: 'Body must be a number' })
            .min(1, 'Rating must be bigger than 1')
            .max(5, 'Rating must be smaller than 5')
    })
    .required()

export const reviewUpdateSchema = z.object({
    body: z.string().optional(),
    rating: z.number().min(1, 'Rating must be bigger than 1').max(5, 'Rating must be smaller than 5').optional()
})
export default reviewSchema
