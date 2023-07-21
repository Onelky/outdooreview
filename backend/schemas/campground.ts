import { z } from 'zod'

export const campgroundSchema = z.object({
    title: z.string({ required_error: 'Title is required!' }).nonempty(),
    price: z.coerce.number({ required_error: 'Price is required' }).positive().gte(0),
    location: z.string({ required_error: 'Location is required' }).nonempty(),
    description: z.string().optional()
    // files: z.array(z.any())
})

export const campgroundUpdateSchema = z.object({
    title: z.string().optional(),
    // price: z.preprocess((val) => Number(val), z.number({ required_error: 'Price is required' }).positive().gte(0)).optional(),
    price: z.coerce.number({ required_error: 'Price is required' }).positive().gte(0).optional(),
    description: z.string().optional(),
    location: z.string().optional()
    // images: z.array(image)
    // files: z.array(z.any())
})
