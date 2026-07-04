import { SchoolMongoRepository } from "../../repositories/school.repository";
import { CreateSchoolDTO, UpdateSchoolDTO } from "../../dtos/school.dto";
import { HttpException } from "../../exceptions/http-exception";

const schoolRepository = new SchoolMongoRepository();

export class AdminSchoolService {
    async createSchool(data: CreateSchoolDTO, file?: Express.Multer.File) {
        const payload: Record<string, any> = { ...data };
        if (file) payload.image = `/uploads/${file.filename}`;
        return schoolRepository.create(payload);
    }

    async updateSchool(id: string, data: UpdateSchoolDTO, file?: Express.Multer.File) {
        const school = await schoolRepository.getById(id);
        if (!school) throw new HttpException(404, "School not found");

        const payload: Record<string, any> = { ...data };
        if (file) payload.image = `/uploads/${file.filename}`;

        return schoolRepository.updateById(id, payload);
    }

    async deleteSchool(id: string) {
        const school = await schoolRepository.getById(id);
        if (!school) throw new HttpException(404, "School not found");
        await schoolRepository.deleteById(id);
    }
}