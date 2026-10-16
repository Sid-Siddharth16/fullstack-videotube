export const ENV = {
  API_BASE_URL: import.meta.env.VITE_API_URL,
  API_TIMEOUT_MS: 15_000,
  // Register uploads images to Cloudinary server-side, which can be slow
  UPLOAD_TIMEOUT_MS: 60_000,
  // Video goes browser → server → Cloudinary; large files on slow links need minutes
  VIDEO_UPLOAD_TIMEOUT_MS: 15 * 60_000,
} as const;
