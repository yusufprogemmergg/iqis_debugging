import { Request } from "express";
import multer from "multer";

const storage = multer.diskStorage({
    destination: (request: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
        cb(null, "public/studio_picture/"); // LOCAL directory, not a URL
    },
    filename: (request: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const uploadFile = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 } // 2MB limit
});

export default uploadFile;
