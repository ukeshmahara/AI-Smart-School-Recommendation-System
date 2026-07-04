import mongoose, { Schema, Document } from "mongoose";
import { SchoolType } from "../types/school.type";

export interface ISchool extends SchoolType, Document {
    _id: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const SchoolMongoSchema: Schema = new Schema<ISchool>(
    {
        name: { type: String, required: true },
        location: { type: String, required: true },
        category: {
            type: String,
            enum: ["international", "public", "private", "budget_friendly"],
            required: true,
        },
        streamsOffered: {
            type: [String],
            enum: ["science", "management", "humanities"],
            required: true,
        },
        fees: { type: Number, required: true },
        image: { type: String },
    },
    { timestamps: true }
);

export const SchoolModel = mongoose.model<ISchool>("School", SchoolMongoSchema);