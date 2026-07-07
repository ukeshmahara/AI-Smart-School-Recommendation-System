import { SchoolModel, ISchool } from "../models/school.model";
import { BUDGET_FRIENDLY_THRESHOLD } from "../configs/constant";

export class SchoolMongoRepository {
    async findAll(page: number, limit: number, search: string, category: string, stream: string): Promise<ISchool[]> {
        const query = this.buildQuery(search, category, stream);
        return SchoolModel.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);
    }
    async count(search: string, category: string, stream: string): Promise<number> {
        const query = this.buildQuery(search, category, stream);
        return SchoolModel.countDocuments(query);
    }
    async getById(id: string): Promise<ISchool | null> {
        return SchoolModel.findById(id);
    }
    async create(data: Partial<ISchool>): Promise<ISchool> {
        return SchoolModel.create(data);
    }
    async updateById(id: string, data: Partial<ISchool>): Promise<ISchool | null> {
        return SchoolModel.findByIdAndUpdate(id, data, { new: true });
    }
    async deleteById(id: string): Promise<ISchool | null> {
        return SchoolModel.findByIdAndDelete(id);
    }
    async countByCategory(): Promise<Record<string, number>> {
        const [results, budgetFriendlyCount] = await Promise.all([
            SchoolModel.aggregate([{ $group: { _id: "$category", count: { $sum: 1 } } }]),
            SchoolModel.countDocuments({ fees: { $lte: BUDGET_FRIENDLY_THRESHOLD } }),
        ]);
        const counts: Record<string, number> = {
            international: 0,
            public: 0,
            private: 0,
            budget_friendly: budgetFriendlyCount,
        };
        results.forEach((r) => {
            if (counts[r._id] !== undefined) counts[r._id] = r.count;
        });
        return counts;
    }
    private buildQuery(search: string, category: string, stream: string) {
        const query: Record<string, any> = {};
        if (search) {
            const regex = new RegExp(search, "i");
            query.$or = [{ name: regex }, { location: regex }];
        }
        if (category === "budget_friendly") {
            query.fees = { $lte: BUDGET_FRIENDLY_THRESHOLD };
        } else if (category) {
            query.category = category;
        }
        if (stream) {
            query.streamsOffered = stream;
        }
        return query;
    }
}