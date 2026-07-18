import request from "supertest";
import app from "../../app";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../../configs/constant";
import { UserModel } from "../../models/user.model";
import { SchoolModel } from "../../models/school.model";
import { FavoriteModel } from "../../models/favorite.model";

describe("Integration: Favorite Routes", () => {
    let studentToken: string;
    let schoolId: string;

    beforeAll(async () => {
        await UserModel.deleteMany({ email: "favorite-integration-test@example.com" });
        await SchoolModel.deleteMany({ name: "Favorite Integration Test School" });
        await FavoriteModel.deleteMany({});

        const student = await UserModel.create({
            fullName: "Favorite Integration Tester",
            email: "favorite-integration-test@example.com",
            phone: "9800055555",
            password: "hashedpassword123",
            role: "student",
        });
        studentToken = jwt.sign({ id: student._id }, SECRET_KEY, { expiresIn: "1h" });

        const school = await SchoolModel.create({
            name: "Favorite Integration Test School",
            location: "Kathmandu",
            category: "private",
            streamsOffered: ["science"],
            fees: 70000,
        });
        schoolId = String(school._id);
    });

    describe("POST /api/v1/favorites", () => {
        test("should reject adding a favorite with no token", async () => {
            const res = await request(app).post("/api/v1/favorites").send({ schoolId });
            expect(res.statusCode).toBe(401);
        });

        test("should successfully add a favorite", async () => {
            const res = await request(app)
                .post("/api/v1/favorites")
                .set("Authorization", `Bearer ${studentToken}`)
                .send({ schoolId });

            expect(res.statusCode).toBe(201);
        });

        test("should reject a duplicate favorite", async () => {
            const res = await request(app)
                .post("/api/v1/favorites")
                .set("Authorization", `Bearer ${studentToken}`)
                .send({ schoolId });

            expect(res.statusCode).toBe(400);
        });
    });

    describe("GET /api/v1/favorites", () => {
        test("should return the user's favorited schools", async () => {
            const res = await request(app).get("/api/v1/favorites").set("Authorization", `Bearer ${studentToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.data.length).toBeGreaterThan(0);
            expect(res.body.data[0]._id).toBe(schoolId);
        });
    });

    describe("DELETE /api/v1/favorites/:schoolId", () => {
        test("should successfully remove the favorite", async () => {
            const res = await request(app)
                .delete(`/api/v1/favorites/${schoolId}`)
                .set("Authorization", `Bearer ${studentToken}`);

            expect(res.statusCode).toBe(200);
        });

        test("should reflect the removal in the favorites list afterward", async () => {
            const res = await request(app).get("/api/v1/favorites").set("Authorization", `Bearer ${studentToken}`);
            expect(res.body.data.length).toBe(0);
        });
    });
});