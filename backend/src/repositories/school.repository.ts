import { SchoolModel, ISchool } from "../models/school.model";
import { BUDGET_FRIENDLY_THRESHOLD } from "../configs/constant";

export class SchoolMongoRepository {
    async findAll(
        page: number,
        limit: number,
        search: string,
        category: string,
        stream: string,
        minFee?: number,
        maxFee?: number,
        sort?: string
    ): Promise<ISchool[]> {
        const query = this.buildQuery(search, category, stream, minFee, maxFee);
        const sortOption = this.buildSort(sort);
        return SchoolModel.find(query)
            .sort(sortOption)
            .skip((page - 1) * limit)
            .limit(limit);
    }
    async count(search: string, category: string, stream: string, minFee?: number, maxFee?: number): Promise<number> {
        const query = this.buildQuery(search, category, stream, minFee, maxFee);
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
    async getFeeStats(): Promise<{ average: number; min: number; max: number; total: number }> {
        const results = await SchoolModel.aggregate([
            {
                $group: {
                    _id: null,
                    average: { $avg: "$fees" },
                    min: { $min: "$fees" },
                    max: { $max: "$fees" },
                    total: { $sum: 1 },
                },
            },
        ]);
        if (results.length === 0) return { average: 0, min: 0, max: 0, total: 0 };
        const stat = results[0];
        return { average: Math.round(stat.average), min: stat.min, max: stat.max, total: stat.total };
    }
    private buildQuery(search: string, category: string, stream: string, minFee?: number, maxFee?: number) {
        const query: Record<string, any> = {};
        if (search) {
            const regex = new RegExp(search, "i");
            query.$or = [{ name: regex }, { location: regex }];
        }
        if (stream) {
            query.streamsOffered = stream;
        }

        const feeConstraints: Record<string, number> = {};
        if (category === "budget_friendly") {
            feeConstraints.$lte = BUDGET_FRIENDLY_THRESHOLD;
        } else if (category) {
            query.category = category;
        }
        if (minFee !== undefined) {
            feeConstraints.$gte = minFee;
        }
        if (maxFee !== undefined) {
            feeConstraints.$lte = feeConstraints.$lte !== undefined ? Math.min(feeConstraints.$lte, maxFee) : maxFee;
        }
        if (Object.keys(feeConstraints).length > 0) {
            query.fees = feeConstraints;
        }

        return query;
    }
    private buildSort(sort?: string) {
        switch (sort) {
            case "fees_asc":
                return { fees: 1 as const };
            case "fees_desc":
                return { fees: -1 as const };
            case "name_asc":
                return { name: 1 as const };
            default:
                return { createdAt: -1 as const };
        }
    }
}