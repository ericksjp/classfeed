export function buildImageUrl(protocol: string, host: string, filename: string) {
    return `${protocol}://${host}:${process.env.SERVER_PORT || 3000}/uploads/${filename}`;
}
