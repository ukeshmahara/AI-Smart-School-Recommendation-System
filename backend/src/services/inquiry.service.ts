import { InquiryMongoRepository } from "../repositories/inquiry.repository";
import { SchoolMongoRepository } from "../repositories/school.repository";
import { CreateInquiryDTO } from "../dtos/inquiry.dto";
import { HttpException } from "../exceptions/http-exception";

const inquiryRepository = new InquiryMongoRepository();
const schoolRepository = new SchoolMongoRepository();

export class InquiryService {
    async createInquiry(studentId: string, data: CreateInquiryDTO) {
        const school = await schoolRepository.getById(data.schoolId);
        if (!school) throw new HttpException(404, "School not found");

        return inquiryRepository.create({
            studentId: studentId as any,
            schoolId: data.schoolId as any,
            message: data.message,
        });
    }

    async getMyInquiries(studentId: string) {
        return inquiryRepository.findByStudent(studentId);
    }
}