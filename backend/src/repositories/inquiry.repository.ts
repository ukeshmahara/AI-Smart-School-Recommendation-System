import { InquiryModel, IInquiry } from "../models/inquiry.model";

export class InquiryMongoRepository {
    async create(data: Partial<IInquiry>): Promise<IInquiry> {
        return InquiryModel.create(data);
    }
    async findByStudent(studentId: string) {
        return InquiryModel.find({ studentId }).populate("schoolId", "name location image").sort({ createdAt: -1 });
    }
    async findAll(page: number, limit: number) {
        return InquiryModel.find()
            .populate("studentId", "fullName email")
            .populate("schoolId", "name")
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);
    }
    async count(): Promise<number> {
        return InquiryModel.countDocuments();
    }
    async getById(id: string): Promise<IInquiry | null> {
        return InquiryModel.findById(id);
    }
    async updateStatus(id: string, status: string): Promise<IInquiry | null> {
        return InquiryModel.findByIdAndUpdate(id, { status }, { new: true });
    }
    async addReply(id: string, adminReply: string): Promise<IInquiry | null> {
        return InquiryModel.findByIdAndUpdate(id, { adminReply, status: "responded" }, { new: true });
    }
    async deleteById(id: string): Promise<IInquiry | null> {
        return InquiryModel.findByIdAndDelete(id);
    }
}