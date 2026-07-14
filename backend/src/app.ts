import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import { HttpException } from "./exceptions/http-exception";
import { ApiResponseHelper } from "./utils/apihelper.util";
import userRoutes from "./routes/user.route";
import adminUserRoutes from "./routes/admin/user.route";
import schoolRoutes from "./routes/school.route";
import adminSchoolRoutes from "./routes/admin/school.route";
import favoriteRoutes from "./routes/favorite.route";
import adminAnalyticsRoutes from "./routes/admin/analytics.route";
import notificationRoutes from "./routes/notification.route";
import adminNotificationRoutes from "./routes/admin/notification.route";
import inquiryRoutes from "./routes/inquiry.route";
import adminInquiryRoutes from "./routes/admin/inquiry.route";

const app: Application = express();

app.use(cors({ origin: ["*"] }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("combined"));

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/admin/users", adminUserRoutes);
app.use("/api/v1/schools", schoolRoutes);
app.use("/api/v1/admin/schools", adminSchoolRoutes);
app.use("/api/v1/favorites", favoriteRoutes);
app.use("/api/v1/admin/analytics", adminAnalyticsRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/admin/notifications", adminNotificationRoutes);
app.use("/api/v1/inquiries", inquiryRoutes);
app.use("/api/v1/admin/inquiries", adminInquiryRoutes);

app.use((req: Request, res: Response) => {
    return res.status(404).json({ message: "API not found" });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error("Error:", err);
    if (err instanceof HttpException) {
        return ApiResponseHelper.error(res, err.message, err.status);
    }
    return ApiResponseHelper.error(res, err?.message || "Internal Server Error", 500);
});

export default app;