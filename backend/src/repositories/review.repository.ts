import { ReviewModel, IReview } from "../models/review.model";

export class ReviewMongoRepository {
    async create(data: Partial<IReview>): Promise<IReview> {
        return ReviewModel.create(data);
    }
    async getById(id: string): Promise<IReview | null> {
        return ReviewModel.findById(id);
    }
    async findBySchool(schoolId: string) {
        return ReviewModel.find({ schoolId }).populate("studentId", "fullName").sort({ createdAt: -1 });
    }
    async findByStudent(studentId: string) {
        return ReviewModel.find({ studentId }).populate("schoolId", "name").sort({ createdAt: -1 });
    }
    async getRatingSummary(schoolId: string): Promise<{ average: number; count: number }> {
        const results = await ReviewModel.aggregate([
            { $match: { schoolId: new (require("mongoose").Types.ObjectId)(schoolId) } },
            { $group: { _id: null, average: { $avg: "$rating" }, count: { $sum: 1 } } },
        ]);
        if (results.length === 0) return { average: 0, count: 0 };
        return { average: Math.round(results[0].average * 10) / 10, count: results[0].count };
    }
    async updateById(id: string, data: Partial<IReview>): Promise<IReview | null> {
        return ReviewModel.findByIdAndUpdate(id, data, { new: true });
    }
    async deleteById(id: string): Promise<IReview | null> {
        return ReviewModel.findByIdAndDelete(id);
    }
    async findAll(page: number, limit: number, ratingFilter?: number) {
        const query: Record<string, any> = {};
        if (ratingFilter) query.rating = ratingFilter;
        return ReviewModel.find(query)
            .populate("studentId", "fullName email")
            .populate("schoolId", "name")
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);
    }
    async count(ratingFilter?: number): Promise<number> {
        const query: Record<string, any> = {};
        if (ratingFilter) query.rating = ratingFilter;
        return ReviewModel.countDocuments(query);
    }
}