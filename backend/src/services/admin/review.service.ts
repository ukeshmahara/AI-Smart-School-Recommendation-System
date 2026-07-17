import { ReviewMongoRepository } from "../../repositories/review.repository";
import { HttpException } from "../../exceptions/http-exception";

const reviewRepository = new ReviewMongoRepository();

export class AdminReviewService {
    async getReviews(page: number, limit: number, ratingFilter?: number) {
        const [reviews, total] = await Promise.all([
            reviewRepository.findAll(page, limit, ratingFilter),
            reviewRepository.count(ratingFilter),
        ]);
        return {
            reviews,
            meta: { page, limit, total, totalPages: Math.max(Math.ceil(total / limit), 1) },
        };
    }

    async deleteReview(id: string) {
        const review = await reviewRepository.deleteById(id);
        if (!review) throw new HttpException(404, "Review not found");
    }
}