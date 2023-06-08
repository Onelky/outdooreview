import { z } from 'zod'
import { campgroundSchema } from './campground'

type SchemaError = {
    error: string
}

function validateSchemaData(inputs: unknown, schema: z.Schema): SchemaError {
    const result = schema.safeParse(inputs)
    if (!result.success) {
        console.log('format', result.error.format())
        return { error: 'Invalid campground!' }
    }
    return { error: '' }
}

export { validateSchemaData, campgroundSchema }
