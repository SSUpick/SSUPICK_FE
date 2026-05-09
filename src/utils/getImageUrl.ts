const BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL as string;

export function getImageUrl(path: string | null | undefined, fallback: string): string {
    if (!path) return fallback;
    if (path.startsWith('http')) return path;
    return `${BASE_URL}/${path}`;
}
