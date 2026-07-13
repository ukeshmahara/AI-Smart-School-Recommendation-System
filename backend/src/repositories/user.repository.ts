import { UserModel, IUser } from "../models/user.model";

export class UserMongoRepository {
    async getUserById(id: string): Promise<IUser | null> {
        return UserModel.findOne({ _id: id });
    }
    async getUserByEmail(email: string): Promise<IUser | null> {
        return UserModel.findOne({ email });
    }
    async getUserByResetToken(hashedToken: string): Promise<IUser | null> {
        return UserModel.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: new Date() },
        });
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
    async countByRole(): Promise<Record<string, number>> {
        const results = await UserModel.aggregate([{ $group: { _id: "$role", count: { $sum: 1 } } }]);
        const counts: Record<string, number> = { student: 0, admin: 0 };
        results.forEach((r) => {
            if (counts[r._id] !== undefined) counts[r._id] = r.count;
        });
        return counts;
    }
    async getSignupTrend(months: number): Promise<{ month: string; count: number }[]> {
        const since = new Date();
        since.setMonth(since.getMonth() - (months - 1));
        since.setDate(1);
        since.setHours(0, 0, 0, 0);

        const results = await UserModel.aggregate([
            { $match: { createdAt: { $gte: since } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
                    count: { $sum: 1 },
                },
            },
        ]);

        const countsByMonth: Record<string, number> = {};
        results.forEach((r) => {
            countsByMonth[r._id] = r.count;
        });

        const trend: { month: string; count: number }[] = [];
        for (let i = 0; i < months; i++) {
            const d = new Date(since);
            d.setMonth(d.getMonth() + i);
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
            trend.push({ month: key, count: countsByMonth[key] || 0 });
        }
        return trend;
    }
    private buildSearchQuery(search: string) {
        if (!search) return {};
        const regex = new RegExp(search, "i");
        return { $or: [{ fullName: regex }, { email: regex }] };
    }
}