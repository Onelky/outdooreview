import { z } from 'zod'

export const campgroundSchema = z.object({
    title: z.string({ required_error: 'Title is required!' }).nonempty(),
    price: z.coerce.number({ required_error: 'Price is required' }).positive().gte(0),
    location: z.string({ required_error: 'Location is required' }).nonempty(),
    description: z.string().optional(),
    deleteImages: z.array(z.string()).optional()
})

export const campgroundUpdateSchema = z.object({
    title: z.string().optional(),
    price: z.coerce.number({ required_error: 'Price is required' }).positive().gte(0).optional(),
    description: z.string().optional(),
    location: z.string().optional(),
    deleteImages: z.array(z.string()).optional()
})
