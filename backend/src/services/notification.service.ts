import { NotificationMongoRepository } from "../repositories/notification.repository";

const notificationRepository = new NotificationMongoRepository();

export class NotificationService {
    async getRecentNotifications() {
        return notificationRepository.findRecent(20);
    }
}