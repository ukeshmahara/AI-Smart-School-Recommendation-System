import mongoose, { Schema, Document } from "mongoose";

export interface IReview extends Document {
    _id: mongoose.Types.ObjectId;
    studentId: mongoose.Types.ObjectId;
    schoolId: mongoose.Types.ObjectId;
    rating: number;
    comment: string;
    createdAt: Date;
    updatedAt: Date;
}

const ReviewMongoSchema: Schema = new Schema<IReview>(
    {
        studentId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        schoolId: { type: Schema.Types.ObjectId, ref: "School", required: true },
        rating: { type: Number, min: 1, max: 5, required: true },
        comment: { type: String, required: true },
    },
    { timestamps: true }
);

export const ReviewModel = mongoose.model<IReview>("Review", ReviewMongoSchema);