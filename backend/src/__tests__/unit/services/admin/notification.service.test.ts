import { AdminNotificationService } from "../../../../services/admin/notification.service";
import { NotificationModel } from "../../../../models/notification.model";
import { UserModel } from "../../../../models/user.model";

describe("Unit: AdminNotificationService", () => {
    const adminNotificationService = new AdminNotificationService();
    let adminId: string;

    beforeAll(async () => {
        await NotificationModel.deleteMany({});
        await UserModel.deleteMany({ email: "admin-notif-service@example.com" });

        const admin = await UserModel.create({
            fullName: "Admin Notification Service Tester",
            email: "admin-notif-service@example.com",
            phone: "9800004040",
            password: "hashedpassword123",
            role: "admin",
        });
        adminId = String(admin._id);
    });

    test("should create a notification tied to the admin who created it", async () => {
        const notification = await adminNotificationService.createNotification(
            { title: "Admin Created Notice", message: "Testing creation", type: "important" },
            adminId
        );

        expect(notification).toBeDefined();
        expect(notification.title).toBe("Admin Created Notice");
        expect(String(notification.createdBy)).toBe(adminId);
    });

    test("should return paginated notifications with correct meta", async () => {
        await NotificationModel.deleteMany({});
        const bulkNotifications = Array.from({ length: 15 }, (_, i) => ({
            title: `Bulk Notice ${i + 1}`,
            message: "Pagination test",
            type: "general",
            createdBy: adminId,
        }));
        await NotificationModel.create(bulkNotifications);

        const result = await adminNotificationService.getNotifications(1, 10);

        expect(result.notifications.length).toBe(10);
        expect(result.meta.total).toBe(15);
        expect(result.meta.totalPages).toBe(2);
        expect(result.meta.page).toBe(1);
    });

    test("should return the remaining items on the second page", async () => {
        const result = await adminNotificationService.getNotifications(2, 10);
        expect(result.notifications.length).toBe(5);
        expect(result.meta.page).toBe(2);
    });

    test("should successfully delete an existing notification", async () => {
        const created = await NotificationModel.create({
            title: "To Be Deleted",
            message: "Testing deletion",
            type: "general",
            createdBy: adminId,
        });

        await adminNotificationService.deleteNotification(String(created._id));

        const stillExists = await NotificationModel.findById(created._id);
        expect(stillExists).toBeNull();
    });

    test("should throw 404 when deleting a notification that doesn't exist", async () => {
        await expect(
            adminNotificationService.deleteNotification("000000000000000000000000")
        ).rejects.toMatchObject({ status: 404, message: "Notification not found" });
    });
});