import { SchemaError } from '../schemas'

export default class ExpressError extends Error {
    public statusCode: number
    public errors?: SchemaError
    constructor(message: string = '', statusCode: number, errors?: SchemaError) {
        super()
        this.message = message
        this.errors = errors
        this.statusCode = statusCode
    }
}
