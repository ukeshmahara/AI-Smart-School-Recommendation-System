import { ReviewMongoRepository } from "../../../repositories/review.repository";
import { ReviewModel } from "../../../models/review.model";
import { SchoolModel } from "../../../models/school.model";
import { UserModel } from "../../../models/user.model";
import mongoose from "mongoose";

describe("Unit: ReviewMongoRepository", () => {
    const reviewRepository = new ReviewMongoRepository();
    let studentId: mongoose.Types.ObjectId;
    let schoolAId: mongoose.Types.ObjectId;
    let schoolBId: mongoose.Types.ObjectId;

    beforeAll(async () => {
        await ReviewModel.deleteMany({});
        await SchoolModel.deleteMany({ name: { $in: ["Review Test School A", "Review Test School B"] } });
        await UserModel.deleteMany({ email: "reviewtester@example.com" });

        const student = await UserModel.create({
            fullName: "Review Tester",
            email: "reviewtester@example.com",
            phone: "9800005555",
            password: "hashedpassword123",
            role: "student",
        });
        studentId = student._id;

        const schoolA = await SchoolModel.create({
            name: "Review Test School A",
            location: "Kathmandu",
            category: "private",
            streamsOffered: ["science"],
            fees: 100000,
        });
        schoolAId = schoolA._id;

        const schoolB = await SchoolModel.create({
            name: "Review Test School B",
            location: "Kathmandu",
            category: "public",
            streamsOffered: ["humanities"],
            fees: 40000,
        });
        schoolBId = schoolB._id;

        // School A: two reviews averaging 5 stars (higher rated)
        await ReviewModel.create([
            { studentId, schoolId: schoolAId, rating: 5, comment: "Excellent" },
            { studentId, schoolId: schoolAId, rating: 5, comment: "Loved it" },
        ]);

        // School B: one review at 3 stars (lower rated)
        await ReviewModel.create({ studentId, schoolId: schoolBId, rating: 3, comment: "It was okay" });
    });

    test("should create a review", async () => {
        const review = await reviewRepository.create({
            studentId,
            schoolId: schoolAId,
            rating: 4,
            comment: "Test review",
        } as any);

        expect(review).toBeDefined();
        expect(review).toHaveProperty("_id");
        expect(review.rating).toBe(4);
    });

    test("should correctly calculate rating summary average and count for a school", async () => {
        const summary = await reviewRepository.getRatingSummary(String(schoolAId));
        expect(summary.count).toBeGreaterThanOrEqual(2);
        expect(summary.average).toBeGreaterThan(0);
        expect(summary.average).toBeLessThanOrEqual(5);
    });

    test("should return zero average and count for a school with no reviews", async () => {
        const schoolWithNoReviews = await SchoolModel.create({
            name: "Never Reviewed School",
            location: "Bhaktapur",
            category: "private",
            streamsOffered: ["management"],
            fees: 75000,
        });

        const summary = await reviewRepository.getRatingSummary(String(schoolWithNoReviews._id));
        expect(summary.average).toBe(0);
        expect(summary.count).toBe(0);
    });

    test("should rank top rated schools with the highest average first", async () => {
        const topSchools = await reviewRepository.getTopRatedSchoolIds(5);
        expect(topSchools.length).toBeGreaterThan(0);

        // School A (avg 5) should rank above School B (avg 3)
        const schoolAEntry = topSchools.find((s) => s.schoolId === String(schoolAId));
        const schoolBEntry = topSchools.find((s) => s.schoolId === String(schoolBId));

        expect(schoolAEntry).toBeDefined();
        expect(schoolBEntry).toBeDefined();
        expect(schoolAEntry!.average).toBeGreaterThan(schoolBEntry!.average);
    });
});