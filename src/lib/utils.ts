/**
 * Normalizes image paths to ensure they are consistent and point to the correct location.
 * Handles uploads, assets, and external URLs.
 */
export function normalizeImagePath(path?: string) {
  if (!path) return "/placeholder.webp";

  // If it's already an absolute path (starts with /), return as is
  if (path.startsWith("/")) {
    // If it's just /uploads/ (missing filename), return placeholder
    if (path === "/uploads/" || path === "/uploads") return "/placeholder.webp";
    return path;
  }

  // If it's an external URL, return as is
  if (path.startsWith("http")) return path;

  // Otherwise, assume it's a filename in the uploads directory
  return `/api/media/${path}`;
}

export function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')     // Replace spaces with -
    .replace(/[^\w\u0621-\u064A-]+/g, '') // Remove all non-word chars (support Arabic)
    .replace(/--+/g, '-')     // Replace multiple - with single -
    .replace(/^-+/, '')       // Trim - from start of text
    .replace(/-+$/, '');      // Trim - from end of text
}
