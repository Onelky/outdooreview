import User, { IUser } from '../models/user'

export const createUser = async (data: IUser): Promise<IUser> => {
    const { email, username, password } = data
    const user = new User({ email, username })
    return await User.register(user, password)
}
