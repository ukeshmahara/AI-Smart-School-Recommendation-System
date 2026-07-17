import { ChatMessageModel, IChatMessage } from "../models/chatMessage.model";

export class ChatMessageMongoRepository {
    async create(data: Partial<IChatMessage>): Promise<IChatMessage> {
        return ChatMessageModel.create(data);
    }
    async findByUser(userId: string): Promise<IChatMessage[]> {
        return ChatMessageModel.find({ userId }).sort({ createdAt: 1 });
    }
    async deleteAllByUser(userId: string): Promise<void> {
        await ChatMessageModel.deleteMany({ userId });
    }
}