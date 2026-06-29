import { UserModel, IUser } from "../models/user.model";

export class UserMongoRepository {
    async getUserById(id: string): Promise<IUser | null> {
        return UserModel.findOne({ _id: id });
    }
    async getUserByEmail(email: string): Promise<IUser | null> {
        return UserModel.findOne({ email });
    }
    async createUser(user: Partial<IUser>): Promise<IUser> {
        return UserModel.create(user);
    }
}
