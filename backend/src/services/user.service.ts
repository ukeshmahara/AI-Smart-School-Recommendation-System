import { UserMongoRepository } from "../repositories/user.repository";
import { CreateUserDTO, LoginUserDTO, UpdateUserDTO } from "../dtos/user.dto";
import { HttpException } from "../exceptions/http-exception";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../configs/constant";

const userRepository = new UserMongoRepository();

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
            fieldsToUpdate.profileImage = `/uploads/${file.filename}`;
        }

        const updatedUser = await userRepository.updateUser(userId, fieldsToUpdate);
        if (!updatedUser) {
            throw new HttpException(404, "User not found");
        }

        const { password, ...safeUser } = updatedUser.toObject();
        return safeUser;
    }
}