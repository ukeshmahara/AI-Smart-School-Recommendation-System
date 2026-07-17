import { ReviewMongoRepository } from "../repositories/review.repository";
import { SchoolMongoRepository } from "../repositories/school.repository";
import { CreateReviewDTO, UpdateReviewDTO } from "../dtos/review.dto";
import { HttpException } from "../exceptions/http-exception";

const reviewRepository = new ReviewMongoRepository();
const schoolRepository = new SchoolMongoRepository();

export class ReviewService {
    async createReview(studentId: string, data: CreateReviewDTO) {
        const school = await schoolRepository.getById(data.schoolId);
        if (!school) throw new HttpException(404, "School not found");

        return reviewRepository.create({
            studentId: studentId as any,
            schoolId: data.schoolId as any,
            rating: data.rating,
            comment: data.comment,
        });
    }

    async getSchoolReviews(schoolId: string) {
        const [reviews, summary] = await Promise.all([
            reviewRepository.findBySchool(schoolId),
            reviewRepository.getRatingSummary(schoolId),
        ]);
        return { reviews, summary };
    }

    async getMyReviews(studentId: string) {
        return reviewRepository.findByStudent(studentId);
    }

    async getTopRatedSchools(limit: number) {
        const topRatedIds = await reviewRepository.getTopRatedSchoolIds(limit);

        const results = await Promise.all(
            topRatedIds.map(async (item) => {
                const school = await schoolRepository.getById(item.schoolId);
                if (!school) return null;
                return { school, average: item.average, count: item.count };
            })
        );

        return results.filter(Boolean);
    }

    async updateReview(id: string, studentId: string, data: UpdateReviewDTO) {
        const review = await reviewRepository.getById(id);
        if (!review) throw new HttpException(404, "Review not found");
        if (String(review.studentId) !== studentId) {
            throw new HttpException(403, "You can only edit your own review");
        }
        return reviewRepository.updateById(id, data);
    }

    async deleteReview(id: string, studentId: string) {
        const review = await reviewRepository.getById(id);
        if (!review) throw new HttpException(404, "Review not found");
        if (String(review.studentId) !== studentId) {
            throw new HttpException(403, "You can only delete your own review");
        }
        await reviewRepository.deleteById(id);
    }
}