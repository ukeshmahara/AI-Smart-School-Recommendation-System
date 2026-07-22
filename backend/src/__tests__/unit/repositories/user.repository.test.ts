import { UserMongoRepository } from "../../../repositories/user.repository";
import { UserModel } from "../../../models/user.model";

describe("Unit: UserMongoRepository", () => {
    const userRepository = new UserMongoRepository();

    beforeAll(async () => {
        await UserModel.deleteMany({}); // clear users collection before tests
    });

    const userData = {
        fullName: "Ram Sharma",
        email: "ram.sharma@example.com",
        phone: "9800000011",
        password: "hashedpassword123", // repository doesn't hash, that's the service's job
        role: "student" as const,
    };

    test("should create a user", async () => {
        const user = await userRepository.createUser(userData);
        expect(user).toBeDefined();
        expect(user).toHaveProperty("_id");
        expect(user.fullName).toBe(userData.fullName);
        expect(user.email).toBe(userData.email);
    });

    test("should get a user by email when it exists", async () => {
        const user = await userRepository.getUserByEmail(userData.email);
        expect(user).not.toBeNull();
        expect(user?.email).toBe(userData.email);
    });

    test("should return null when getting a user by a non-existent email", async () => {
        const user = await userRepository.getUserByEmail("doesnotexist@example.com");
        expect(user).toBeNull();
    });

    test("should count users by role correctly", async () => {
        await userRepository.createUser({
            fullName: "Admin User",
            email: "admin.test@example.com",
            phone: "9800000022",
            password: "hashedpassword123",
            role: "admin",
        });

        const counts = await userRepository.countByRole();
        expect(counts.student).toBeGreaterThanOrEqual(1);
        expect(counts.admin).toBeGreaterThanOrEqual(1);
    });
});