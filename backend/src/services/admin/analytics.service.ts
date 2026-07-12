import { UserMongoRepository } from "../../repositories/user.repository";
import { SchoolMongoRepository } from "../../repositories/school.repository";
import { FavoriteMongoRepository } from "../../repositories/favorite.repository";

const userRepository = new UserMongoRepository();
const schoolRepository = new SchoolMongoRepository();
const favoriteRepository = new FavoriteMongoRepository();

export class AdminAnalyticsService {
    async getDashboardStats() {
        const [usersByRole, signupTrend, schoolsByCategory, feeStats, topFavoritedRaw, totalUsers, totalSchools] =
            await Promise.all([
                userRepository.countByRole(),
                userRepository.getSignupTrend(6),
                schoolRepository.countByCategory(),
                schoolRepository.getFeeStats(),
                favoriteRepository.getTopFavoritedSchoolIds(5),
                userRepository.count(""),
                schoolRepository.count("", "", ""),
            ]);

        const topFavorited = (
            await Promise.all(
                topFavoritedRaw.map(async (item) => {
                    const school = await schoolRepository.getById(item.schoolId);
                    if (!school) return null;
                    return { schoolId: item.schoolId, name: school.name, favoriteCount: item.count };
                })
            )
        ).filter(Boolean);

        return {
            totalUsers,
            totalSchools,
            usersByRole,
            signupTrend,
            schoolsByCategory,
            feeStats,
            topFavorited,
        };
    }
}