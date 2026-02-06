import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import s3Client from "../config/s3Client";
import config from "../config/config";

class StorageService {
    private bucketName: string;
    private bucketUrl: string;

    constructor() {
        this.bucketName = config.S3_BUCKET_NAME;
        this.bucketUrl = config.S3_PUBLIC_URL;
    }

    async uploadFile(filename: string, fileBody: Buffer, mimetype: string) {
        const command = new PutObjectCommand({
            Bucket: this.bucketName,
            Key: filename,
            Body: fileBody,
            ContentType: mimetype,
        });

        try {
            await s3Client.send(command);
            return filename;
        } catch (error) {
            console.error("S3 Upload Error: ", error);
            throw new Error("S3 Upload Error");
        }
    }

    async deleteFile(filename: string) {
        const command = new DeleteObjectCommand({
            Bucket: this.bucketName,
            Key: filename,
        });

        await s3Client.send(command);
    }

    getPublicUrl(filename: string): string {
        return `${this.bucketUrl}/${filename}`;
    }
}

export default new StorageService();
