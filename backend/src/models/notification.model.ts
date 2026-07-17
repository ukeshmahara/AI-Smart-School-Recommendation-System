import mongoose, { Schema, Document } from "mongoose";
import { NotificationType } from "../types/notification.type";

export interface INotification extends NotificationType, Document {
    _id: mongoose.Types.ObjectId;
    createdBy: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const NotificationMongoSchema: Schema = new Schema<INotification>(
    {
        title: { type: String, required: true },
        message: { type: String, required: true },
        type: { type: String, enum: ["general", "wish", "important"], default: "general" },
        createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    },
    { timestamps: true }
);

export const NotificationModel = mongoose.model<INotification>("Notification", NotificationMongoSchema);