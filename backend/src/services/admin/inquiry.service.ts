import { InquiryMongoRepository } from "../../repositories/inquiry.repository";
import { HttpException } from "../../exceptions/http-exception";

const inquiryRepository = new InquiryMongoRepository();

export class AdminInquiryService {
    async getInquiries(page: number, limit: number) {
        const [inquiries, total] = await Promise.all([
            inquiryRepository.findAll(page, limit),
            inquiryRepository.count(),
        ]);
        return {
            inquiries,
            meta: { page, limit, total, totalPages: Math.max(Math.ceil(total / limit), 1) },
        };
    }

    async updateStatus(id: string, status: string) {
        const inquiry = await inquiryRepository.updateStatus(id, status);
        if (!inquiry) throw new HttpException(404, "Inquiry not found");
        return inquiry;
    }

    async replyToInquiry(id: string, adminReply: string) {
        const inquiry = await inquiryRepository.addReply(id, adminReply);
        if (!inquiry) throw new HttpException(404, "Inquiry not found");
        return inquiry;
    }

    async deleteInquiry(id: string) {
        const inquiry = await inquiryRepository.deleteById(id);
        if (!inquiry) throw new HttpException(404, "Inquiry not found");
    }
}