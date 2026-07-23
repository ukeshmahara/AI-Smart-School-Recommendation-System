import { UserMongoRepository } from "../repositories/user.repository";
import { CreateUserDTO, LoginUserDTO, UpdateUserDTO } from "../dtos/user.dto";
import { HttpException } from "../exceptions/http-exception";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { SECRET_KEY, FRONTEND_URL } from "../configs/constant";
import { sendPasswordResetEmail } from "../configs/email";
import { uploadBufferToCloudinary } from "../configs/cloudinary";

const userRepository = new UserMongoRepository();
const RESET_TOKEN_EXPIRY_MS = 15 * 60 * 1000; // 15 minutes

export class UserService {
    async createUser(userData: CreateUserDTO) {
        const existingUser = await userRepository.getUserByEmail(userData.email);
        if (existingUser) {
            throw new HttpException(400, "Email already exists");
        }

        const hashedPassword = await bcryptjs.hash(userData.password, 10);
        const user = await userRepository.createUser({
            ...userData,
            password: hashedPassword,
        });

        const { password, ...safeUser } = user.toObject();
        return safeUser;
    }

    async loginUser(loginData: LoginUserDTO) {
        const user = await userRepository.getUserByEmail(loginData.email);
        if (!user) {
            throw new HttpException(400, "Invalid email or password");
        }

        const isPasswordValid = await bcryptjs.compare(loginData.password, user.password);
        if (!isPasswordValid) {
            throw new HttpException(400, "Invalid email or password");
        }

        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            SECRET_KEY,
            { expiresIn: "30d" }
        );

        const { password, ...safeUser } = user.toObject();
        return { user: safeUser, token };
    }

    async updateUser(userId: string, updateData: UpdateUserDTO, file?: Express.Multer.File) {
        const user = await userRepository.getUserById(userId);
        if (!user) {
            throw new HttpException(404, "User not found");
        }

        const fieldsToUpdate: Record<string, any> = {};

        if (updateData.fullName) fieldsToUpdate.fullName = updateData.fullName;
        if (updateData.phone) fieldsToUpdate.phone = updateData.phone;

        if (updateData.newPassword) {
            const isCurrentPasswordValid = await bcryptjs.compare(
                updateData.currentPassword as string,
                user.password
            );
            if (!isCurrentPasswordValid) {
                throw new HttpException(400, "Current password is incorrect");
            }
            fieldsToUpdate.password = await bcryptjs.hash(updateData.newPassword, 10);
        }

        if (file) {
            fieldsToUpdate.profileImage = await uploadBufferToCloudinary(file.buffer, "profile-images");
        }

        const updatedUser = await userRepository.updateUser(userId, fieldsToUpdate);
        if (!updatedUser) {
            throw new HttpException(404, "User not found");
        }

        const { password, ...safeUser } = updatedUser.toObject();
        return safeUser;
    }

    async forgotPassword(email: string) {
        const user = await userRepository.getUserByEmail(email);

        // Always behave the same way whether or not the email exists,
        // so a caller can't tell which emails are registered.
        if (!user) return;

        const rawToken = crypto.randomBytes(32).toString("hex");
        const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");
        const expires = new Date(Date.now() + RESET_TOKEN_EXPIRY_MS);

        await userRepository.updateUser(String(user._id), {
            resetPasswordToken: hashedToken,
            resetPasswordExpires: expires,
        });

        const resetLink = `${FRONTEND_URL}/reset-password?token=${rawToken}`;
        await sendPasswordResetEmail(user.email, resetLink);
    }

    async resetPassword(rawToken: string, newPassword: string) {
        const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");
        const user = await userRepository.getUserByResetToken(hashedToken);

        if (!user) {
            throw new HttpException(400, "This reset link is invalid or has expired");
        }

        const hashedPassword = await bcryptjs.hash(newPassword, 10);
        await userRepository.updateUser(String(user._id), {
            password: hashedPassword,
            resetPasswordToken: undefined,
            resetPasswordExpires: undefined,
        });
    }
}