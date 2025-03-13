export function buildImageUrl(protocol: string, host: string, imagePath: string) {
    return `${protocol}://${host}:${process.env.SERVER_PORT || 3000}/${imagePath}`;
}