import request from "supertest";
import app from "../../app";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../../configs/constant";
import { UserModel } from "../../models/user.model";
import { SchoolModel } from "../../models/school.model";
import { InquiryModel } from "../../models/inquiry.model";

describe("Integration: Admin Inquiry Routes", () => {
    let adminToken: string;
    let studentToken: string;
    let schoolId: string;
    let inquiryId: string;

    beforeAll(async () => {
        await UserModel.deleteMany({
            email: { $in: ["admin-inquiry-int@example.com", "student-inquiry-int@example.com"] },
        });
        await SchoolModel.deleteMany({ name: "Admin Inquiry Integration Test School" });
        await InquiryModel.deleteMany({});

        const admin = await UserModel.create({
            fullName: "Admin Inquiry Tester",
            email: "admin-inquiry-int@example.com",
            phone: "9800088888",
            password: "hashedpassword123",
            role: "admin",
        });
        adminToken = jwt.sign({ id: admin._id }, SECRET_KEY, { expiresIn: "1h" });

        const student = await UserModel.create({
            fullName: "Student Inquiry Tester",
            email: "student-inquiry-int@example.com",
            phone: "9800099999",
            password: "hashedpassword123",
            role: "student",
        });
        studentToken = jwt.sign({ id: student._id }, SECRET_KEY, { expiresIn: "1h" });

        const school = await SchoolModel.create({
            name: "Admin Inquiry Integration Test School",
            location: "Kathmandu",
            category: "private",
            streamsOffered: ["science"],
            fees: 65000,
        });
        schoolId = String(school._id);

        const inquiry = await InquiryModel.create({
            studentId: student._id,
            schoolId: school._id,
            message: "What is the admission deadline?",
        });
        inquiryId = String(inquiry._id);
    });

    describe("GET /api/v1/admin/inquiries", () => {
        test("should reject a non-admin student", async () => {
            const res = await request(app)
                .get("/api/v1/admin/inquiries")
                .set("Authorization", `Bearer ${studentToken}`);
            expect(res.statusCode).toBe(403);
        });

        test("should return a paginated list of inquiries for an admin", async () => {
            const res = await request(app)
                .get("/api/v1/admin/inquiries?page=1&limit=10")
                .set("Authorization", `Bearer ${adminToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.data.length).toBeGreaterThan(0);
            expect(res.body.meta).toHaveProperty("total");
        });
    });

    describe("PATCH /api/v1/admin/inquiries/:id/status", () => {
        test("should reject an invalid status value", async () => {
            const res = await request(app)
                .patch(`/api/v1/admin/inquiries/${inquiryId}/status`)
                .set("Authorization", `Bearer ${adminToken}`)
                .send({ status: "not_a_real_status" });
            expect(res.statusCode).toBe(400);
        });

        test("should successfully update the status", async () => {
            const res = await request(app)
                .patch(`/api/v1/admin/inquiries/${inquiryId}/status`)
                .set("Authorization", `Bearer ${adminToken}`)
                .send({ status: "closed" });

            expect(res.statusCode).toBe(200);
            expect(res.body.data.status).toBe("closed");
        });
    });

    describe("PATCH /api/v1/admin/inquiries/:id/reply", () => {
        test("should reject an empty reply", async () => {
            const res = await request(app)
                .patch(`/api/v1/admin/inquiries/${inquiryId}/reply`)
                .set("Authorization", `Bearer ${adminToken}`)
                .send({ adminReply: "" });
            expect(res.statusCode).toBe(400);
        });

        test("should successfully reply and auto-set status to responded", async () => {
            const res = await request(app)
                .patch(`/api/v1/admin/inquiries/${inquiryId}/reply`)
                .set("Authorization", `Bearer ${adminToken}`)
                .send({ adminReply: "Admissions close on the 15th of this month." });

            expect(res.statusCode).toBe(200);
            expect(res.body.data.adminReply).toBe("Admissions close on the 15th of this month.");
            expect(res.body.data.status).toBe("responded"); // auto-set, even though we manually set it to "closed" above
        });
    });

    describe("DELETE /api/v1/admin/inquiries/:id", () => {
        test("should reject deletion from a non-admin student", async () => {
            const res = await request(app)
                .delete(`/api/v1/admin/inquiries/${inquiryId}`)
                .set("Authorization", `Bearer ${studentToken}`);
            expect(res.statusCode).toBe(403);
        });

        test("should successfully delete the inquiry as admin", async () => {
            const res = await request(app)
                .delete(`/api/v1/admin/inquiries/${inquiryId}`)
                .set("Authorization", `Bearer ${adminToken}`);
            expect(res.statusCode).toBe(200);
        });

        test("should return 404 when deleting an inquiry that no longer exists", async () => {
            const res = await request(app)
                .delete(`/api/v1/admin/inquiries/${inquiryId}`)
                .set("Authorization", `Bearer ${adminToken}`);
            expect(res.statusCode).toBe(404);
        });
    });
});