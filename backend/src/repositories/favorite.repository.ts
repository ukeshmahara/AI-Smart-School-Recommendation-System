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
}