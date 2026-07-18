import request from "supertest";
import app from "../../app";
import { SchoolModel } from "../../models/school.model";

describe("Integration: School Routes (public)", () => {
    beforeAll(async () => {
        await SchoolModel.deleteMany({ name: { $regex: /Integration Test School/ } });

        await SchoolModel.create([
            {
                name: "Integration Test School A",
                location: "Kathmandu",
                category: "private",
                streamsOffered: ["science"],
                fees: 30000, // budget-friendly
            },
            {
                name: "Integration Test School B",
                location: "Lalitpur",
                category: "public",
                streamsOffered: ["humanities"],
                fees: 150000,
            },
        ]);
    });

    describe("GET /api/v1/schools", () => {
        test("should return a paginated list of schools", async () => {
            const res = await request(app).get("/api/v1/schools?page=1&limit=10");

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(Array.isArray(res.body.data)).toBe(true);
            expect(res.body.meta).toHaveProperty("total");
        });

        test("should filter by budget-friendly category correctly", async () => {
            const res = await request(app).get("/api/v1/schools?category=budget_friendly");

            expect(res.statusCode).toBe(200);
            res.body.data.forEach((school: any) => {
                expect(school.fees).toBeLessThanOrEqual(50000);
            });
        });

        test("should not require any authentication", async () => {
            const res = await request(app).get("/api/v1/schools");
            expect(res.statusCode).toBe(200); // no Authorization header sent at all
        });
    });

    describe("GET /api/v1/schools/category-counts", () => {
        test("should return counts for all four categories", async () => {
            const res = await request(app).get("/api/v1/schools/category-counts");

            expect(res.statusCode).toBe(200);
            expect(res.body.data).toHaveProperty("international");
            expect(res.body.data).toHaveProperty("public");
            expect(res.body.data).toHaveProperty("private");
            expect(res.body.data).toHaveProperty("budget_friendly");
        });
    });

    describe("GET /api/v1/schools/:id", () => {
        test("should return a school's full details by id", async () => {
            const school = await SchoolModel.findOne({ name: "Integration Test School A" });
            const res = await request(app).get(`/api/v1/schools/${school!._id}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.data.name).toBe("Integration Test School A");
        });

        test("should return 404 for a non-existent school id", async () => {
            const res = await request(app).get("/api/v1/schools/000000000000000000000000");
            expect(res.statusCode).toBe(404);
        });
    });
});