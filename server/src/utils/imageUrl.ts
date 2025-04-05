import { PORT } from "../config/config";

export function buildImageUrl(protocol: string, host: string, filename: string) {
    return `${protocol}://${host}:${PORT}/uploads/${filename}`;
}
