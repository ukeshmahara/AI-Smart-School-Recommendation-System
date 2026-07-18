import mongoose from "mongoose";
import { MONGODB_URL, MONGODB_TEST_URL } from "../configs/constant";

export const connectToMongoDB = async () => {
    try {
        await mongoose.connect(MONGODB_URL);
        console.log("Connected to MongoDB successfully");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error;
    }
};

export const connectToMongoDBTest = async () => {
    await mongoose.connect(MONGODB_TEST_URL);
};