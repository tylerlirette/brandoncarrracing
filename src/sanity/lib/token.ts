import "server-only";

/**
 * Viewer (or broader) API token for draft preview.
 * Never import this module from client components.
 */
export const token = process.env.SANITY_API_READ_TOKEN;
