import multer from "multer";
import { Request } from "express";

// Store the file in memory (as a Buffer) instead of writing to disk.
// Render's free-tier filesystem is ephemeral and gets wiped on every
// restart/redeploy, so anything saved to local disk (like the old
// diskStorage setup) disappears. Cloudinary is used as permanent storage
// instead — see configs/cloudinary.ts.
const storage = multer.memoryStorage();

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Only image files are allowed"));
    }
};

export const uploadMiddleware = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});