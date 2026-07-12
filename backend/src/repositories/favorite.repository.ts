import { FavoriteModel, IFavorite } from "../models/favorite.model";

export class FavoriteMongoRepository {
    async create(userId: string, schoolId: string): Promise<IFavorite> {
        return FavoriteModel.create({ userId, schoolId });
    }
    async delete(userId: string, schoolId: string): Promise<IFavorite | null> {
        return FavoriteModel.findOneAndDelete({ userId, schoolId });
    }
    async findOne(userId: string, schoolId: string): Promise<IFavorite | null> {
        return FavoriteModel.findOne({ userId, schoolId });
    }
    async findAllByUser(userId: string) {
        return FavoriteModel.find({ userId }).populate("schoolId").sort({ createdAt: -1 });
    }
    async getTopFavoritedSchoolIds(limit: number): Promise<{ schoolId: string; count: number }[]> {
        const results = await FavoriteModel.aggregate([
            { $group: { _id: "$schoolId", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: limit },
        ]);
        return results.map((r) => ({ schoolId: String(r._id), count: r.count }));
    }
}