const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8089";

/**
 * Builds a displayable <img> src from a stored image value.
 *
 * Older records (or the backend's local /uploads static route) store a
 * relative path like "/uploads/xyz.jpg", which needs the API base URL
 * prefixed. Newer records store a full Cloudinary URL like
 * "https://res.cloudinary.com/...", which is already a complete, working
 * URL and must NOT be prefixed (doing so produces a broken URL like
 * "http://localhost:8089https://res.cloudinary.com/...").
 */
export function getImageUrl(path?: string | null): string | undefined {
    if (!path) return undefined;
    if (path.startsWith("http://") || path.startsWith("https://")) {
        return path;
    }
    return `${API_BASE_URL}${path}`;
}