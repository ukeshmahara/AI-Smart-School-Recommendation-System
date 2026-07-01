import { UserMongoRepository } from "../../repositories/user.repository";
import { AdminCreateUserDTO, AdminUpdateUserDTO } from "../../dtos/admin/user.dto";
import { HttpException } from "../../exceptions/http-exception";
import bcryptjs from "bcryptjs";

const userRepository = new UserMongoRepository();

export class AdminUserService {
    async getUsers(page: number, limit: number, search: string) {
        const [users, total] = await Promise.all([
            userRepository.findAll(page, limit, search),
            userRepository.count(search),
        ]);
        return {
            users,
            meta: { page, limit, total, totalPages: Math.max(Math.ceil(total / limit), 1) },
        };
    }

    async getUserById(id: string) {
        const user = await userRepository.getUserById(id);
        if (!user) throw new HttpException(404, "User not found");
        const { password, ...safeUser } = user.toObject();
        return safeUser;
    }

    async createUser(data: AdminCreateUserDTO) {
        const existing = await userRepository.getUserByEmail(data.email);
        if (existing) throw new HttpException(400, "Email already exists");

        const hashedPassword = await bcryptjs.hash(data.password, 10);
        const user = await userRepository.createUser({ ...data, password: hashedPassword });
        const { password, ...safeUser } = user.toObject();
        return safeUser;
    }

    async updateUser(id: string, data: AdminUpdateUserDTO) {
        const user = await userRepository.getUserById(id);
        if (!user) throw new HttpException(404, "User not found");

        const fieldsToUpdate: Record<string, any> = {};
        if (data.fullName) fieldsToUpdate.fullName = data.fullName;
        if (data.phone) fieldsToUpdate.phone = data.phone;
        if (data.role) fieldsToUpdate.role = data.role;

        if (data.email && data.email !== user.email) {
            const existing = await userRepository.getUserByEmail(data.email);
            if (existing) throw new HttpException(400, "Email already in use by another account");
            fieldsToUpdate.email = data.email;
        }

        if (data.password) {
            fieldsToUpdate.password = await bcryptjs.hash(data.password, 10);
        }

        const updatedUser = await userRepository.updateUser(id, fieldsToUpdate);
        const { password, ...safeUser } = updatedUser!.toObject();
        return safeUser;
    }

    async deleteUser(id: string, requestingAdminId: string) {
        if (id === requestingAdminId) {
            throw new HttpException(400, "You cannot delete your own account");
        }
        const user = await userRepository.getUserById(id);
        if (!user) throw new HttpException(404, "User not found");
        await userRepository.deleteUser(id);
    }
}