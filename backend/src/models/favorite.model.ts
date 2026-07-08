import mongoose, { Schema, Document } from "mongoose";

export interface IFavorite extends Document {
    _id: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    schoolId: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const FavoriteMongoSchema: Schema = new Schema<IFavorite>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        schoolId: { type: Schema.Types.ObjectId, ref: "School", required: true },
    },
    { timestamps: true }
);

FavoriteMongoSchema.index({ userId: 1, schoolId: 1 }, { unique: true });

export const FavoriteModel = mongoose.model<IFavorite>("Favorite", FavoriteMongoSchema);