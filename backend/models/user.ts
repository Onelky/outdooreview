import mongoose, { model, Schema, PassportLocalDocument } from 'mongoose'
import passportLocalMongoose from 'passport-local-mongoose'

export interface IUser extends PassportLocalDocument {
    email: string
}

const UserSchema = new Schema({
    email: { type: String, required: true, unique: true }
})

declare global {
    namespace Express {
        interface User extends IUser {}
    }
}

UserSchema.plugin(passportLocalMongoose, { errorMessages: { UserExistsError: 'Username is already registered' } })

export default model<IUser>('User', UserSchema)
