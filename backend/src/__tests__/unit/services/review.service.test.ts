import { ReviewService } from "../../../services/review.service";
import { UserModel } from "../../../models/user.model";
import { SchoolModel } from "../../../models/school.model";
import { ReviewModel } from "../../../models/review.model";

describe("Unit: ReviewService", () => {
    const reviewService = new ReviewService();
    let ownerStudentId: string;
    let otherStudentId: string;
    let schoolId: string;
    let reviewId: string;

    beforeAll(async () => {
        await ReviewModel.deleteMany({});
        await UserModel.deleteMany({
            email: { $in: ["review-owner@example.com", "review-other@example.com"] },
        });
        await SchoolModel.deleteMany({ name: "Review Service Test School" });

        const owner = await UserModel.create({
            fullName: "Review Owner",
            email: "review-owner@example.com",
            phone: "9800007777",
            password: "hashedpassword123",
            role: "student",
        });
        ownerStudentId = String(owner._id);

        const other = await UserModel.create({
            fullName: "Other Student",
            email: "review-other@example.com",
            phone: "9800008888",
            password: "hashedpassword123",
            role: "student",
        });
        otherStudentId = String(other._id);

        const school = await SchoolModel.create({
            name: "Review Service Test School",
            location: "Kathmandu",
            category: "private",
            streamsOffered: ["science"],
            fees: 90000,
        });
        schoolId = String(school._id);
    });

    test("should throw 404 when creating a review for a school that doesn't exist", async () => {
        await expect(
            reviewService.createReview(ownerStudentId, {
                schoolId: "000000000000000000000000",
                rating: 5,
                comment: "Testing",
            })
        ).rejects.toMatchObject({ status: 404, message: "School not found" });
    });

    test("should successfully create a review for a real school", async () => {
        const review = await reviewService.createReview(ownerStudentId, {
            schoolId,
            rating: 5,
            comment: "Great school",
        });
        expect(review).toBeDefined();
        expect(String(review.studentId)).toBe(ownerStudentId);
        reviewId = String(review._id);
    });

    test("should return reviews and a rating summary for a school", async () => {
        const result = await reviewService.getSchoolReviews(schoolId);
        expect(result.reviews.length).toBeGreaterThan(0);
        expect(result.summary.count).toBeGreaterThan(0);
        expect(result.summary.average).toBeGreaterThan(0);
    });

    test("should return only the reviews belonging to a specific student", async () => {
        const myReviews = await reviewService.getMyReviews(ownerStudentId);
        expect(myReviews.length).toBeGreaterThan(0);
        myReviews.forEach((review: any) => {
            expect(String(review.studentId)).toBe(ownerStudentId);
        });
    });

    test("should allow the owner to update their own review", async () => {
        const updated = await reviewService.updateReview(reviewId, ownerStudentId, {
            rating: 4,
            comment: "Updated comment",
        });
        expect(updated).toBeDefined();
        expect(updated!.rating).toBe(4);
    });

    test("should throw 403 when a different student tries to update someone else's review", async () => {
        await expect(
            reviewService.updateReview(reviewId, otherStudentId, { rating: 1, comment: "Not mine" })
        ).rejects.toMatchObject({ status: 403, message: "You can only edit your own review" });
    });

    test("should throw 404 when updating a review that doesn't exist", async () => {
        await expect(
            reviewService.updateReview("000000000000000000000000", ownerStudentId, { rating: 3 })
        ).rejects.toMatchObject({ status: 404, message: "Review not found" });
    });

    test("should throw 403 when a different student tries to delete someone else's review", async () => {
        await expect(reviewService.deleteReview(reviewId, otherStudentId)).rejects.toMatchObject({
            status: 403,
            message: "You can only delete your own review",
        });
    });

    test("should allow the owner to delete their own review", async () => {
        await reviewService.deleteReview(reviewId, ownerStudentId);
        const myReviews = await reviewService.getMyReviews(ownerStudentId);
        const stillExists = myReviews.find((r: any) => String(r._id) === reviewId);
        expect(stillExists).toBeUndefined();
    });

    test("should return an empty array for top rated schools when there are no reviews at all", async () => {
        await ReviewModel.deleteMany({});
        const topSchools = await reviewService.getTopRatedSchools(3);
        expect(topSchools).toEqual([]);
    });
});