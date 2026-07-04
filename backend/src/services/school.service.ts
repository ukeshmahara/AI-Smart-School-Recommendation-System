import { SchoolMongoRepository } from "../repositories/school.repository";
import { HttpException } from "../exceptions/http-exception";

const schoolRepository = new SchoolMongoRepository();

export class SchoolService {
    async getSchools(page: number, limit: number, search: string, category: string, stream: string) {
        const [schools, total] = await Promise.all([
            schoolRepository.findAll(page, limit, search, category, stream),
            schoolRepository.count(search, category, stream),
        ]);
        return {
            schools,
            meta: { page, limit, total, totalPages: Math.max(Math.ceil(total / limit), 1) },
        };
    }

    async getSchoolById(id: string) {
        const school = await schoolRepository.getById(id);
        if (!school) throw new HttpException(404, "School not found");
        return school;
    }

    async getCategoryCounts() {
        return schoolRepository.countByCategory();
    }
}