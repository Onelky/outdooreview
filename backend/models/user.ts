import { model, Schema, PassportLocalDocument } from 'mongoose'
import passportLocalMongoose from 'passport-local-mongoose'
import { isEmail } from 'validator'

export enum AuthMethods {
    google = 'google',
    local = 'local'
}
export interface IUser {
    email: string
    username: string
    password: string
    method?: AuthMethods
}

export interface IUserGoogleAuth extends Omit<IUser, 'password'> {}

export interface UserDocument extends IUser, PassportLocalDocument {
    hash: string
    salt: string
}

const UserSchema = new Schema<UserDocument>({
    username: { type: String, required: true, unique: true },
    hash: { type: String },
    salt: { type: String },
    password: { type: String },
    method: { type: String, enum: AuthMethods, required: true, default: AuthMethods.local },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: isEmail,
            message: 'Invalid email'
        }
    }
})

declare global {
    namespace Express {
        interface User extends UserDocument {}
    }
}

UserSchema.plugin(passportLocalMongoose, { errorMessages: { UserExistsError: 'Username is already registered' } })

export default model<UserDocument>('User', UserSchema)
