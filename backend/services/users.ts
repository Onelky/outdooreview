import User, { IUser, IUserGoogleAuth, UserDocument } from '../models/user'

export const registerUser = async (data: IUser): Promise<UserDocument> => {
    const { email, username, password } = data
    const user = new User({ email, username })
    return await User.register(user, password)
}

export const createUser = async (data: IUser | IUserGoogleAuth): Promise<UserDocument> => {
    const user = new User(data)
    await user.save()
    return user
}

export const findUser = async (id: string, byUsername?: boolean): Promise<UserDocument> => {
    return (await User.findOne({ [byUsername ? 'username' : '_id']: id })) as unknown as UserDocument
}
