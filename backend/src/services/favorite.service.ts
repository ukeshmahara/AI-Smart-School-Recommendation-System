import { FavoriteMongoRepository } from "../repositories/favorite.repository";
import { SchoolMongoRepository } from "../repositories/school.repository";
import { HttpException } from "../exceptions/http-exception";

const favoriteRepository = new FavoriteMongoRepository();
const schoolRepository = new SchoolMongoRepository();

export class FavoriteService {
    async addFavorite(userId: string, schoolId: string) {
        const school = await schoolRepository.getById(schoolId);
        if (!school) throw new HttpException(404, "School not found");

        const existing = await favoriteRepository.findOne(userId, schoolId);
        if (existing) throw new HttpException(400, "School is already in your favorites");

        return favoriteRepository.create(userId, schoolId);
    }

    async removeFavorite(userId: string, schoolId: string) {
        const existing = await favoriteRepository.findOne(userId, schoolId);
        if (!existing) throw new HttpException(404, "Favorite not found");
        await favoriteRepository.delete(userId, schoolId);
    }

    async getUserFavorites(userId: string) {
        const favorites = await favoriteRepository.findAllByUser(userId);
        // filter out any favorite whose school was since deleted
        return favorites.filter((f: any) => f.schoolId).map((f: any) => f.schoolId);
    }
}