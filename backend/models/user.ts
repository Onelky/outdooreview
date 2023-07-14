import { model, Schema, PassportLocalDocument } from 'mongoose'
import passportLocalMongoose from 'passport-local-mongoose'

export interface IUser extends PassportLocalDocument {
    email: string
    username: string
    password: string
    hash: string
    salt: string
}

const UserSchema = new Schema<IUser>({
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String },
    hash: { type: String },
    salt: { type: String }
})

declare global {
    namespace Express {
        interface User extends IUser {}
    }
}

UserSchema.plugin(passportLocalMongoose, { errorMessages: { UserExistsError: 'Username is already registered' } })

export default model<IUser>('User', UserSchema)
