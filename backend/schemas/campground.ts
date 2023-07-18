import { z } from 'zod'

const customErrorMap: z.ZodErrorMap = (issue, ctx) => {
    if (issue.code === z.ZodIssueCode.invalid_type) return { message: 'Invalid data' }

    return { message: ctx.defaultError }
}

z.setErrorMap(customErrorMap)

export const campgroundSchema = z.object({
    title: z.string({ required_error: 'Title is required!' }).nonempty(),
    price: z.number({ required_error: 'Price is required' }).positive().gte(0),
    description: z.string({ required_error: 'Description is required' }).nonempty(),
    location: z.string({ required_error: 'Location is required' }).nonempty()
})

export const campgroundUpdateSchema = z.object({
    title: z.string().optional(),
    price: z.number().positive().gte(0).optional(),
    description: z.string().optional(),
    location: z.string().optional()
})
