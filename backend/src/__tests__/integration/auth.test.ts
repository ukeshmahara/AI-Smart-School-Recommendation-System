import request from "supertest";
import app from "../../app";
import { UserModel } from "../../models/user.model";

describe("Integration: Auth Routes", () => {
    beforeAll(async () => {
        await UserModel.deleteMany({ email: { $regex: /integrationtest/ } });
    });

    describe("POST /api/v1/auth/register", () => {
        test("should validate missing required fields", async () => {
            const res = await request(app).post("/api/v1/auth/register").send({
                fullName: "Incomplete User",
            });

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
        });

        test("should register a new user successfully", async () => {
            const res = await request(app).post("/api/v1/auth/register").send({
                fullName: "Integration Test User",
                email: "integrationtest1@example.com",
                phone: "9800011111",
                password: "IntTest@123",
            });

            expect(res.statusCode).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveProperty("_id");
            expect(res.body.data.password).toBeUndefined();
        });

        test("should reject registration with a duplicate email", async () => {
            const res = await request(app).post("/api/v1/auth/register").send({
                fullName: "Duplicate User",
                email: "integrationtest1@example.com",
                phone: "9800022222",
                password: "IntTest@123",
            });

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
        });
    });

    describe("POST /api/v1/auth/login", () => {
        test("should log in successfully with correct credentials", async () => {
            const res = await request(app).post("/api/v1/auth/login").send({
                email: "integrationtest1@example.com",
                password: "IntTest@123",
            });

            expect(res.statusCode).toBe(200);
            expect(res.body.data).toHaveProperty("token");
            expect(res.body.data.user.email).toBe("integrationtest1@example.com");
        });

        test("should reject login with wrong password", async () => {
            const res = await request(app).post("/api/v1/auth/login").send({
                email: "integrationtest1@example.com",
                password: "WrongPassword",
            });

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
        });

        test("should reject login for a non-existent email", async () => {
            const res = await request(app).post("/api/v1/auth/login").send({
                email: "doesnotexist@example.com",
                password: "IntTest@123",
            });

            expect(res.statusCode).toBe(400);
        });
    });

    describe("GET /api/v1/auth/whoami", () => {
        test("should reject a request with no token", async () => {
            const res = await request(app).get("/api/v1/auth/whoami");
            expect(res.statusCode).toBe(401);
        });

        test("should return the user's own details with a valid token", async () => {
            const loginRes = await request(app).post("/api/v1/auth/login").send({
                email: "integrationtest1@example.com",
                password: "IntTest@123",
            });
            const token = loginRes.body.data.token;

            const res = await request(app).get("/api/v1/auth/whoami").set("Authorization", `Bearer ${token}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.data.email).toBe("integrationtest1@example.com");
        });
    });
});