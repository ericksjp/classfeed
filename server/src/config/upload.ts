import multer from "multer";
import { FileError } from "../errors";

const allowedMimes = ["image/jpeg", "image/png", "application/pdf"];

const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    },
    fileFilter: (req, file, cb) => {
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
            return;
        }

        const error = new FileError(
            400,
            `Invalid file type. Only JPEG, PNG and PDF files are allowed.`,
            "ERR_BAD_REQUEST",
        );

        cb(error);
    },
});

export default upload;
