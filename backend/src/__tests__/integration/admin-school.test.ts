import request from "supertest";
import app from "../../app";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../../configs/constant";
import { UserModel } from "../../models/user.model";
import { SchoolModel } from "../../models/school.model";

describe("Integration: Admin School Routes", () => {
    let adminToken: string;
    let studentToken: string;

    beforeAll(async () => {
        await UserModel.deleteMany({
            email: { $in: ["admin-school-test@example.com", "student-school-test@example.com"] },
        });
        await SchoolModel.deleteMany({ name: { $regex: /Admin Integration Test School/ } });

        const admin = await UserModel.create({
            fullName: "Admin School Tester",
            email: "admin-school-test@example.com",
            phone: "9800033333",
            password: "hashedpassword123",
            role: "admin",
        });
        adminToken = jwt.sign({ id: admin._id }, SECRET_KEY, { expiresIn: "1h" });

        const student = await UserModel.create({
            fullName: "Student School Tester",
            email: "student-school-test@example.com",
            phone: "9800044444",
            password: "hashedpassword123",
            role: "student",
        });
        studentToken = jwt.sign({ id: student._id }, SECRET_KEY, { expiresIn: "1h" });
    });

    describe("POST /api/v1/admin/schools", () => {
        test("should reject creation with no token", async () => {
            const res = await request(app).post("/api/v1/admin/schools").send({
                name: "Admin Integration Test School",
                location: "Kathmandu",
                category: "private",
                streamsOffered: ["science"],
                fees: 50000,
            });
            expect(res.statusCode).toBe(401);
        });

        test("should reject creation from a non-admin student", async () => {
            const res = await request(app)
                .post("/api/v1/admin/schools")
                .set("Authorization", `Bearer ${studentToken}`)
                .send({
                    name: "Admin Integration Test School",
                    location: "Kathmandu",
                    category: "private",
                    streamsOffered: ["science"],
                    fees: 50000,
                });
            expect(res.statusCode).toBe(403);
        });

        test("should successfully create a school as admin", async () => {
            const res = await request(app)
                .post("/api/v1/admin/schools")
                .set("Authorization", `Bearer ${adminToken}`)
                .send({
                    name: "Admin Integration Test School",
                    location: "Kathmandu",
                    category: "private",
                    streamsOffered: ["science"],
                    fees: 50000,
                });

            expect(res.statusCode).toBe(201);
            expect(res.body.data.name).toBe("Admin Integration Test School");
        });

        test("should reject creation with a missing required field", async () => {
            const res = await request(app)
                .post("/api/v1/admin/schools")
                .set("Authorization", `Bearer ${adminToken}`)
                .send({
                    name: "Missing Category School",
                    location: "Kathmandu",
                    streamsOffered: ["science"],
                    fees: 50000,
                });
            expect(res.statusCode).toBe(400);
        });
    });

    describe("PATCH /api/v1/admin/schools/:id", () => {
        test("should successfully update a school's fees", async () => {
            const school = await SchoolModel.findOne({ name: "Admin Integration Test School" });
            const res = await request(app)
                .patch(`/api/v1/admin/schools/${school!._id}`)
                .set("Authorization", `Bearer ${adminToken}`)
                .send({ fees: 60000 });

            expect(res.statusCode).toBe(200);
            expect(res.body.data.fees).toBe(60000);
        });
    });

    describe("DELETE /api/v1/admin/schools/:id", () => {
        test("should successfully delete a school as admin", async () => {
            const school = await SchoolModel.findOne({ name: "Admin Integration Test School" });
            const res = await request(app)
                .delete(`/api/v1/admin/schools/${school!._id}`)
                .set("Authorization", `Bearer ${adminToken}`);

            expect(res.statusCode).toBe(200);
        });

        test("should reject deletion with no token", async () => {
            const res = await request(app).delete("/api/v1/admin/schools/000000000000000000000000");
            expect(res.statusCode).toBe(401);
        });
    });
});