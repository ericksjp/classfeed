import { Request, Response, NextFunction } from "express";
import storageService from "../services/storage.service";
import path from "path";
import { FileError } from "../errors";

export async function imageHandler(req: Request, res: Response, next: NextFunction) {
    if (!req.file) {
        throw new FileError(400, "No file uploaded", "ERR_BAD_REQUEST");
    }

    const fileExtension = path.extname(req.file.originalname);
    const fileName = `${Date.now()}${fileExtension}`;

    const resultName = await storageService.uploadFile(fileName, req.file.buffer, req.file.mimetype);

    req.file.filename = resultName;

    next();
}
