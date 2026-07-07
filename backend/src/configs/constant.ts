import dotenv from "dotenv";
dotenv.config();

export const PORT: number = Number(process.env.PORT) || 8089;
export const MONGODB_URL: string =
    process.env.MONGODB_URL || "mongodb://localhost:27017/school-recommendation-db";
export const SECRET_KEY: string =
    process.env.SECRET_KEY || "changethissecretkey";
export const BUDGET_FRIENDLY_THRESHOLD: number = 50000;