import { Request, Response, NextFunction } from "express";
import { SECRET_KEY } from "../configs/constant";
import jwt from "jsonwebtoken";
import { IUser } from "../models/user.model";
import { UserMongoRepository } from "../repositories/user.repository";
import { HttpException } from "../exceptions/http-exception";
import { ApiResponseHelper } from "../utils/apihelper.util";

declare global {
    namespace Express {
        interface Request {
            user?: Record<string, any> | IUser;
        }
    }
}

const userRepository = new UserMongoRepository();

export const authorizedMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new HttpException(401, "Unauthorized");
        }
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, SECRET_KEY) as Record<string, any>;
        const user = await userRepository.getUserById(decoded.id);
        if (!user) throw new HttpException(401, "Unauthorized");
        const { password, ...safeUser } = user.toObject();
        req.user = safeUser;
        return next();
    } catch (err: Error | any) {
        return ApiResponseHelper.error(res, err.message || "Unauthorized", err.status || 401);
    }
};

export const adminMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || req.user.role !== "admin") {
        return ApiResponseHelper.error(res, "Forbidden", 403);
    }
    return next();
};
