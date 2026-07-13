import { UserService } from "../services/user.service";
import { z } from "zod";
import { CreateUserDTO, LoginUserDTO } from "../dtos/user.dto";
import { ForgotPasswordDTO, ResetPasswordDTO } from "../dtos/password-reset.dto";
import { ApiResponseHelper } from "../utils/apihelper.util";
import { Request, Response } from "express";

const userService = new UserService();

export class UserController {
    async createUser(req: Request, res: Response) {
        try {
            const userData = CreateUserDTO.safeParse(req.body);
            if (!userData.success) {
                return ApiResponseHelper.error(res, z.prettifyError(userData.error), 400);
            }
            const user = await userService.createUser(userData.data);
            return ApiResponseHelper.success(res, user, "User registered successfully", 201);
        } catch (error: Error | any) {
            return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
        }
    }

    async loginUser(req: Request, res: Response) {
        try {
            const parsedData = LoginUserDTO.safeParse(req.body);
            if (!parsedData.success) {
                return ApiResponseHelper.error(res, z.prettifyError(parsedData.error), 400);
            }
            const { user, token } = await userService.loginUser(parsedData.data);
            return ApiResponseHelper.success(res, { user, token }, "Login successful");
        } catch (error: Error | any) {
            return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
        }
    }

    async whoami(req: Request, res: Response) {
        return ApiResponseHelper.success(res, req.user, "User details fetched successfully");
    }

    async forgotPassword(req: Request, res: Response) {
        try {
            const parsed = ForgotPasswordDTO.safeParse(req.body);
            if (!parsed.success) {
                return ApiResponseHelper.error(res, z.prettifyError(parsed.error), 400);
            }
            await userService.forgotPassword(parsed.data.email);
            return ApiResponseHelper.success(
                res,
                null,
                "If that email is registered, a reset link has been sent"
            );
        } catch (error: Error | any) {
            return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
        }
    }

    async resetPassword(req: Request, res: Response) {
        try {
            const parsed = ResetPasswordDTO.safeParse(req.body);
            if (!parsed.success) {
                return ApiResponseHelper.error(res, z.prettifyError(parsed.error), 400);
            }
            await userService.resetPassword(req.params.token, parsed.data.newPassword);
            return ApiResponseHelper.success(res, null, "Password reset successfully");
        } catch (error: Error | any) {
            return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
        }
    }
}