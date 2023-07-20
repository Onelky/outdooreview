import { model, Schema, PassportLocalDocument } from 'mongoose'
import passportLocalMongoose from 'passport-local-mongoose'
import { isEmail } from 'validator'

export interface IUser {
    email: string
    username: string
    password: string
}

export interface UserDocument extends IUser, PassportLocalDocument {
    hash: string
    salt: string
}

const UserSchema = new Schema<UserDocument>({
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: isEmail,
            message: 'Invalid email'
        }
    },
    username: { type: String, required: true, unique: true },
    password: { type: String },
    hash: { type: String },
    salt: { type: String }
})

declare global {
    namespace Express {
        interface User extends UserDocument {}
    }
}

UserSchema.plugin(passportLocalMongoose, { errorMessages: { UserExistsError: 'Username is already registered' } })

export default model<UserDocument>('User', UserSchema)
