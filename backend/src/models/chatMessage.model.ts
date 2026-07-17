import mongoose, { Schema, Document } from "mongoose";

export interface IChatMessage extends Document {
    _id: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    role: "user" | "assistant";
    content: string;
    createdAt: Date;
}

const ChatMessageSchema: Schema = new Schema<IChatMessage>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        role: { type: String, enum: ["user", "assistant"], required: true },
        content: { type: String, required: true },
    },
    { timestamps: { createdAt: true, updatedAt: false } }
);

export const ChatMessageModel = mongoose.model<IChatMessage>("ChatMessage", ChatMessageSchema);