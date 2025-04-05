import multer from "multer";
import path from "path";
import { FILE_STORAGE_PATH } from "./config";

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, FILE_STORAGE_PATH),
    filename: (req, file, cb) => {
        const fileExtension = path.extname(file.originalname);
        const fileName = Date.now() + fileExtension;
        cb(null, fileName);
    }
});

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024
    }  
});

export default upload;
