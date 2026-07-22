import { FavoriteService } from "../../../services/favorite.service";
import { UserModel } from "../../../models/user.model";
import { SchoolModel } from "../../../models/school.model";
import { FavoriteModel } from "../../../models/favorite.model";

describe("Unit: FavoriteService", () => {
    const favoriteService = new FavoriteService();
    let studentId: string;
    let schoolId: string;

    beforeAll(async () => {
        await FavoriteModel.deleteMany({});
        await UserModel.deleteMany({ email: "favoriteservicetest@example.com" });
        await SchoolModel.deleteMany({ name: "Favorite Service Test School" });

        const student = await UserModel.create({
            fullName: "Favorite Service Tester",
            email: "favoriteservicetest@example.com",
            phone: "9800006666",
            password: "hashedpassword123",
            role: "student",
        });
        studentId = String(student._id);

        const school = await SchoolModel.create({
            name: "Favorite Service Test School",
            location: "Kathmandu",
            category: "private",
            streamsOffered: ["science"],
            fees: 80000,
        });
        schoolId = String(school._id);
    });

    test("should throw 404 when adding a favorite for a school that doesn't exist", async () => {
        await expect(favoriteService.addFavorite(studentId, "000000000000000000000000")).rejects.toMatchObject({
            status: 404,
            message: "School not found",
        });
    });

    test("should successfully add a favorite for a real school", async () => {
        const favorite = await favoriteService.addFavorite(studentId, schoolId);
        expect(favorite).toBeDefined();
        expect(String(favorite.schoolId)).toBe(schoolId);
    });

    test("should throw 400 when adding a duplicate favorite", async () => {
        await expect(favoriteService.addFavorite(studentId, schoolId)).rejects.toMatchObject({
            status: 400,
            message: "School is already in your favorites",
        });
    });

    test("should include the newly favorited school when getting user favorites", async () => {
        const favorites = await favoriteService.getUserFavorites(studentId);
        const found = favorites.find((s: any) => String(s._id) === schoolId);
        expect(found).toBeDefined();
    });

    test("should successfully remove an existing favorite", async () => {
        await favoriteService.removeFavorite(studentId, schoolId);
        const favorites = await favoriteService.getUserFavorites(studentId);
        const found = favorites.find((s: any) => String(s._id) === schoolId);
        expect(found).toBeUndefined();
    });

    test("should throw 404 when removing a favorite that doesn't exist", async () => {
        await expect(favoriteService.removeFavorite(studentId, schoolId)).rejects.toMatchObject({
            status: 404,
            message: "Favorite not found",
        });
    });
});