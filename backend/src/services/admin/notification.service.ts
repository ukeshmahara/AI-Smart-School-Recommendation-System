import { NotificationMongoRepository } from "../../repositories/notification.repository";
import { CreateNotificationDTO } from "../../dtos/notification.dto";
import { HttpException } from "../../exceptions/http-exception";

const notificationRepository = new NotificationMongoRepository();

export class AdminNotificationService {
    async createNotification(data: CreateNotificationDTO, createdBy: string) {
        return notificationRepository.create({ ...data, createdBy: createdBy as any });
    }

    async deleteNotification(id: string) {
        const notification = await notificationRepository.deleteById(id);
        if (!notification) throw new HttpException(404, "Notification not found");
    }

    async getNotifications(page: number, limit: number) {
        const [notifications, total] = await Promise.all([
            notificationRepository.findAll(page, limit),
            notificationRepository.count(),
        ]);
        return {
            notifications,
            meta: { page, limit, total, totalPages: Math.max(Math.ceil(total / limit), 1) },
        };
    }
}