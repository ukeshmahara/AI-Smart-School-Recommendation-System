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
    async updateUser(id: string, updateData: Partial<IUser>): Promise<IUser | null> {
        return UserModel.findByIdAndUpdate(id, updateData, { new: true });
    }
    async deleteUser(id: string): Promise<IUser | null> {
        return UserModel.findByIdAndDelete(id);
    }
    async findAll(page: number, limit: number, search: string): Promise<IUser[]> {
        const query = this.buildSearchQuery(search);
        return UserModel.find(query)
            .select("-password")
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);
    }
    async count(search: string): Promise<number> {
        const query = this.buildSearchQuery(search);
        return UserModel.countDocuments(query);
    }
    private buildSearchQuery(search: string) {
        if (!search) return {};
        const regex = new RegExp(search, "i");
        return { $or: [{ fullName: regex }, { email: regex }] };
    }
}