import { NotificationModel, INotification } from "../models/notification.model";

export class NotificationMongoRepository {
    async create(data: Partial<INotification>): Promise<INotification> {
        return NotificationModel.create(data);
    }
    async deleteById(id: string): Promise<INotification | null> {
        return NotificationModel.findByIdAndDelete(id);
    }
    async findRecent(limit: number): Promise<INotification[]> {
        return NotificationModel.find().sort({ createdAt: -1 }).limit(limit);
    }
    async findAll(page: number, limit: number): Promise<INotification[]> {
        return NotificationModel.find()
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);
    }
    async count(): Promise<number> {
        return NotificationModel.countDocuments();
    }
}