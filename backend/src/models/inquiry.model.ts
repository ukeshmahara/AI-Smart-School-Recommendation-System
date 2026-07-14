import mongoose, { Schema, Document } from "mongoose";

export interface IInquiry extends Document {
    _id: mongoose.Types.ObjectId;
    studentId: mongoose.Types.ObjectId;
    schoolId: mongoose.Types.ObjectId;
    message: string;
    adminReply?: string;
    status: "pending" | "responded" | "closed";
    createdAt: Date;
    updatedAt: Date;
}

const InquiryMongoSchema: Schema = new Schema<IInquiry>(
    {
        studentId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        schoolId: { type: Schema.Types.ObjectId, ref: "School", required: true },
        message: { type: String, required: true },
        adminReply: { type: String },
        status: { type: String, enum: ["pending", "responded", "closed"], default: "pending" },
    },
    { timestamps: true }
);

export const InquiryModel = mongoose.model<IInquiry>("Inquiry", InquiryMongoSchema);