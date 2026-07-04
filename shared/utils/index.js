/**
 * Sarvhit — Shared Utility Functions
 * Isomorphic helpers that work in both Node.js and Browser
 */

/**
 * Format a date to a readable string
 */
export function formatDate(date, locale = "en-IN") {
  return new Date(date).toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Generate a URL-safe slug from a string
 */
export function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Validate an email address
 */
export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
