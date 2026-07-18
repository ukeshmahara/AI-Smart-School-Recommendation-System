import { NotificationService } from "../../../services/notification.service";
import { NotificationModel } from "../../../models/notification.model";
import { UserModel } from "../../../models/user.model";

describe("Unit: NotificationService", () => {
    const notificationService = new NotificationService();
    let adminId: string;

    beforeAll(async () => {
        await NotificationModel.deleteMany({});
        await UserModel.deleteMany({ email: "notif-admin@example.com" });

        const admin = await UserModel.create({
            fullName: "Notification Admin",
            email: "notif-admin@example.com",
            phone: "9800003030",
            password: "hashedpassword123",
            role: "admin",
        });
        adminId = String(admin._id);
    });

    test("should return an empty array when no notifications exist", async () => {
        const notifications = await notificationService.getRecentNotifications();
        expect(notifications).toEqual([]);
    });

    test("should return notifications once some exist", async () => {
        await NotificationModel.create({
            title: "Test Notification",
            message: "This is a test",
            type: "general",
            createdBy: adminId,
        });

        const notifications = await notificationService.getRecentNotifications();
        expect(notifications.length).toBe(1);
        expect(notifications[0].title).toBe("Test Notification");
    });

    test("should never return more than 20 notifications, even if more exist", async () => {
        await NotificationModel.deleteMany({});

        const manyNotifications = Array.from({ length: 25 }, (_, i) => ({
            title: `Notification ${i + 1}`,
            message: "Bulk test notification",
            type: "general",
            createdBy: adminId,
        }));
        await NotificationModel.create(manyNotifications);

        const notifications = await notificationService.getRecentNotifications();
        expect(notifications.length).toBeLessThanOrEqual(20);
    });
});