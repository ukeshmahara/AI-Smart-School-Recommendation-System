import { InquiryService } from "../../../services/inquiry.service";
import { UserModel } from "../../../models/user.model";
import { SchoolModel } from "../../../models/school.model";
import { InquiryModel } from "../../../models/inquiry.model";

describe("Unit: InquiryService", () => {
    const inquiryService = new InquiryService();
    let studentId: string;
    let schoolId: string;

    beforeAll(async () => {
        await InquiryModel.deleteMany({});
        await UserModel.deleteMany({ email: "inquiryservicetest@example.com" });
        await SchoolModel.deleteMany({ name: "Inquiry Service Test School" });

        const student = await UserModel.create({
            fullName: "Inquiry Service Tester",
            email: "inquiryservicetest@example.com",
            phone: "9800001010",
            password: "hashedpassword123",
            role: "student",
        });
        studentId = String(student._id);

        const school = await SchoolModel.create({
            name: "Inquiry Service Test School",
            location: "Kathmandu",
            category: "private",
            streamsOffered: ["science"],
            fees: 85000,
        });
        schoolId = String(school._id);
    });

    test("should throw 404 when creating an inquiry for a school that doesn't exist", async () => {
        await expect(
            inquiryService.createInquiry(studentId, {
                schoolId: "000000000000000000000000",
                message: "Testing not found case",
            })
        ).rejects.toMatchObject({ status: 404, message: "School not found" });
    });

    test("should successfully create an inquiry for a real school", async () => {
        const inquiry = await inquiryService.createInquiry(studentId, {
            schoolId,
            message: "What is the admission process for Grade 11 Science?",
        });

        expect(inquiry).toBeDefined();
        expect(String(inquiry.schoolId)).toBe(schoolId);
        expect(String(inquiry.studentId)).toBe(studentId);
        expect(inquiry.status).toBe("pending"); // default status
    });

    test("should return only inquiries belonging to that specific student", async () => {
        const myInquiries = await inquiryService.getMyInquiries(studentId);
        expect(myInquiries.length).toBeGreaterThan(0);
        myInquiries.forEach((inquiry: any) => {
            expect(String(inquiry.studentId._id || inquiry.studentId)).toBe(studentId);
        });
    });

    test("should return an empty array for a student who has never submitted an inquiry", async () => {
        const otherStudent = await UserModel.create({
            fullName: "No Inquiries Student",
            email: "no-inquiries@example.com",
            phone: "9800002020",
            password: "hashedpassword123",
            role: "student",
        });

        const myInquiries = await inquiryService.getMyInquiries(String(otherStudent._id));
        expect(myInquiries).toEqual([]);
    });
});