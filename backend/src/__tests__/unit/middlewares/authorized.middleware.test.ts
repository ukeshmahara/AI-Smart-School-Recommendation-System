import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { authorizedMiddleware, adminMiddleware } from "../../../middlewares/authorized.middleware";
import { SECRET_KEY } from "../../../configs/constant";
import { UserModel } from "../../../models/user.model";

function mockRes() {
    const res: Partial<Response> = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res as Response;
}

describe("Unit: authorizedMiddleware", () => {
    let realUserId: string;

    beforeAll(async () => {
        await UserModel.deleteMany({ email: "middlewaretest@example.com" });
        const user = await UserModel.create({
            fullName: "Middleware Test User",
            email: "middlewaretest@example.com",
            phone: "9800009999",
            password: "hashedpassword123",
            role: "student",
        });
        realUserId = String(user._id);
    });

    test("should return 401 when no authorization header is present", async () => {
        const req = { headers: {} } as Request;
        const res = mockRes();
        const next: NextFunction = jest.fn();

        await authorizedMiddleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(next).not.toHaveBeenCalled();
    });

    test("should return 401 when header does not start with 'Bearer '", async () => {
        const req = { headers: { authorization: "Token abc123" } } as Request;
        const res = mockRes();
        const next: NextFunction = jest.fn();

        await authorizedMiddleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(next).not.toHaveBeenCalled();
    });

    test("should return 401 for an invalid or malformed token", async () => {
        const req = { headers: { authorization: "Bearer not.a.valid.token" } } as Request;
        const res = mockRes();
        const next: NextFunction = jest.fn();

        await authorizedMiddleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(next).not.toHaveBeenCalled();
    });

    test("should return 401 when token is valid but references a user that no longer exists", async () => {
        const fakeToken = jwt.sign({ id: "000000000000000000000000" }, SECRET_KEY, { expiresIn: "1h" });
        const req = { headers: { authorization: `Bearer ${fakeToken}` } } as Request;
        const res = mockRes();
        const next: NextFunction = jest.fn();

        await authorizedMiddleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(next).not.toHaveBeenCalled();
    });

    test("should call next() and attach req.user (without password) for a valid token", async () => {
        const validToken = jwt.sign({ id: realUserId }, SECRET_KEY, { expiresIn: "1h" });
        const req = { headers: { authorization: `Bearer ${validToken}` } } as Request;
        const res = mockRes();
        const next: NextFunction = jest.fn();

        await authorizedMiddleware(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(req.user).toBeDefined();
        expect((req.user as any).email).toBe("middlewaretest@example.com");
        expect((req.user as any).password).toBeUndefined();
    });
});

describe("Unit: adminMiddleware", () => {
    test("should return 403 when req.user is missing", () => {
        const req = {} as Request;
        const res = mockRes();
        const next: NextFunction = jest.fn();

        adminMiddleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(next).not.toHaveBeenCalled();
    });

    test("should return 403 when req.user.role is not admin", () => {
        const req = { user: { role: "student" } } as Request;
        const res = mockRes();
        const next: NextFunction = jest.fn();

        adminMiddleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(next).not.toHaveBeenCalled();
    });

    test("should call next() when req.user.role is admin", () => {
        const req = { user: { role: "admin" } } as Request;
        const res = mockRes();
        const next: NextFunction = jest.fn();

        adminMiddleware(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
    });
});