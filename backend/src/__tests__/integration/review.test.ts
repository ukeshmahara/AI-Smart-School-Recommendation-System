import request from "supertest";
import app from "../../app";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../../configs/constant";
import { UserModel } from "../../models/user.model";
import { SchoolModel } from "../../models/school.model";
import { ReviewModel } from "../../models/review.model";

describe("Integration: Review Routes", () => {
    let ownerToken: string;
    let otherToken: string;
    let schoolId: string;
    let reviewId: string;

    beforeAll(async () => {
        await UserModel.deleteMany({
            email: { $in: ["review-owner-int@example.com", "review-other-int@example.com"] },
        });
        await SchoolModel.deleteMany({ name: "Review Integration Test School" });
        await ReviewModel.deleteMany({});

        const owner = await UserModel.create({
            fullName: "Review Owner Integration",
            email: "review-owner-int@example.com",
            phone: "9800066666",
            password: "hashedpassword123",
            role: "student",
        });
        ownerToken = jwt.sign({ id: owner._id }, SECRET_KEY, { expiresIn: "1h" });

        const other = await UserModel.create({
            fullName: "Other Student Integration",
            email: "review-other-int@example.com",
            phone: "9800077777",
            password: "hashedpassword123",
            role: "student",
        });
        otherToken = jwt.sign({ id: other._id }, SECRET_KEY, { expiresIn: "1h" });

        const school = await SchoolModel.create({
            name: "Review Integration Test School",
            location: "Kathmandu",
            category: "private",
            streamsOffered: ["science"],
            fees: 95000,
        });
        schoolId = String(school._id);
    });

    describe("POST /api/v1/reviews", () => {
        test("should reject creating a review with no token", async () => {
            const res = await request(app)
                .post("/api/v1/reviews")
                .send({ schoolId, rating: 5, comment: "Great school" });
            expect(res.statusCode).toBe(401);
        });

        test("should successfully create a review", async () => {
            const res = await request(app)
                .post("/api/v1/reviews")
                .set("Authorization", `Bearer ${ownerToken}`)
                .send({ schoolId, rating: 5, comment: "Great school" });

            expect(res.statusCode).toBe(201);
            reviewId = res.body.data._id;
        });

        test("should reject an out-of-range rating", async () => {
            const res = await request(app)
                .post("/api/v1/reviews")
                .set("Authorization", `Bearer ${ownerToken}`)
                .send({ schoolId, rating: 10, comment: "Invalid rating" });
            expect(res.statusCode).toBe(400);
        });
    });

    describe("GET /api/v1/reviews/school/:schoolId", () => {
        test("should return reviews and a rating summary for the school", async () => {
            const res = await request(app)
                .get(`/api/v1/reviews/school/${schoolId}`)
                .set("Authorization", `Bearer ${ownerToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.data.summary.count).toBeGreaterThan(0);
        });
    });

    describe("PATCH /api/v1/reviews/:id", () => {
        test("should allow the owner to update their own review", async () => {
            const res = await request(app)
                .patch(`/api/v1/reviews/${reviewId}`)
                .set("Authorization", `Bearer ${ownerToken}`)
                .send({ rating: 4, comment: "Updated review" });

            expect(res.statusCode).toBe(200);
        });

        test("should reject a different student updating someone else's review", async () => {
            const res = await request(app)
                .patch(`/api/v1/reviews/${reviewId}`)
                .set("Authorization", `Bearer ${otherToken}`)
                .send({ rating: 1, comment: "Not mine" });

            expect(res.statusCode).toBe(403);
        });
    });

    describe("DELETE /api/v1/reviews/:id", () => {
        test("should reject a different student deleting someone else's review", async () => {
            const res = await request(app)
                .delete(`/api/v1/reviews/${reviewId}`)
                .set("Authorization", `Bearer ${otherToken}`);
            expect(res.statusCode).toBe(403);
        });

        test("should allow the owner to delete their own review", async () => {
            const res = await request(app)
                .delete(`/api/v1/reviews/${reviewId}`)
                .set("Authorization", `Bearer ${ownerToken}`);
            expect(res.statusCode).toBe(200);
        });
    });
});