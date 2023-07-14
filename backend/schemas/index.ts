import { z } from 'zod'

export type SchemaError = {
    errors?: { [p: string]: string[] | undefined; [p: number]: string[] | undefined; [p: symbol]: string[] | undefined }
}

function validateSchemaData(inputs: unknown, schema: z.Schema): SchemaError {
    const result = schema.safeParse(inputs)
    if (!result.success) {
        const { fieldErrors } = result.error.flatten()
        return { errors: fieldErrors }
    }
    return {}
}

export { validateSchemaData }
