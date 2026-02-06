import { HeadBucketCommand, S3Client, S3ServiceException } from "@aws-sdk/client-s3";
import config from "./config";

const hasS3Credentials = config.AWS_ACCESS_KEY_ID && config.AWS_SECRET_ACCESS_KEY;

const s3Client = new S3Client({
    region: config.AWS_REGION,
    endpoint: config.S3_ENDPOINT,
    credentials: hasS3Credentials
        ? {
              accessKeyId: config.AWS_ACCESS_KEY_ID!,
              secretAccessKey: config.AWS_SECRET_ACCESS_KEY!,
          }
        : undefined,
    forcePathStyle: config.S3_FORCE_PATH_STYLE,
});

export async function verifyS3Connection(): Promise<void> {
    const command = new HeadBucketCommand({
        Bucket: config.S3_BUCKET_NAME,
    });

    try {
        await s3Client.send(command);
    } catch (error: unknown) {
        let errorMessage = undefined;
        console.error("S3 Connection Failed:");

        if (error instanceof S3ServiceException) {
            if (error.$metadata?.httpStatusCode === 403) {
                errorMessage = `-> Access Denied: Check your AWS credentials and permissions for bucket "${config.S3_BUCKET_NAME}".`;
            }
            if (error.$metadata?.httpStatusCode === 404) {
                errorMessage = `-> Bucket Not Found: The bucket "${config.S3_BUCKET_NAME}" does not exist.`;
            }
        }

        if (!errorMessage && error instanceof Error) {
            const networkError = error as Error & { code?: string };

            if (networkError.code === "ECONNREFUSED") {
                errorMessage = "-> Connection Refused: Is MinIO running? Check the host/port.";
            } else {
                errorMessage = `-> ${error.name}: ${error.message}`;
            }
        }

        errorMessage = errorMessage || "An unknown error occurred while connecting to S3.";

        throw new Error("S3 Connection Failed:" + "\n" + errorMessage);
    }
}

export default s3Client;
