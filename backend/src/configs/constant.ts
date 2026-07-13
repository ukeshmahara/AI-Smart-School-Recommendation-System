import dotenv from "dotenv";
dotenv.config();

export const PORT: number = Number(process.env.PORT) || 8089;
export const MONGODB_URL: string =
    process.env.MONGODB_URL || "mongodb://localhost:27017/school-recommendation-db";
export const SECRET_KEY: string =
    process.env.SECRET_KEY || "changethissecretkey";
export const BUDGET_FRIENDLY_THRESHOLD: number = 50000;
export const FRONTEND_URL: string = process.env.FRONTEND_URL || "http://localhost:3000";
export const GMAIL_USER: string = process.env.GMAIL_USER || "";
export const GMAIL_APP_PASSWORD: string = process.env.GMAIL_APP_PASSWORD || "";