import { z } from 'zod'

type SchemaError = {
    error: string
}

// todo: improve error that it's returned
function validateSchemaData(inputs: unknown, schema: z.Schema): SchemaError {
    const result = schema.safeParse(inputs)
    if (!result.success) {
        console.log('format', result.error.format())
        return { error: 'Invalid campground!' }
    }
    return { error: '' }
}

export { validateSchemaData }
