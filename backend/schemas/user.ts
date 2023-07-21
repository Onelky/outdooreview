import { z } from 'zod'

export const userSchema = z
    .object({
        email: z.string({ required_error: 'Email is required', invalid_type_error: 'Email must be a string' }).email().nonempty(),
        username: z.string({ required_error: 'Username is required' }).nonempty(),
        password: z.string({ required_error: 'Password is required' }).nonempty()
    })
    .required()

export default userSchema
