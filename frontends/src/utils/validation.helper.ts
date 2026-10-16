export type FieldErrors<T> = Partial<Record<keyof T, string>>;

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const USERNAME_PATTERN = /^[a-zA-Z0-9_.]{3,30}$/;
// Matches the backend passwordSchema (user.validator.js)
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 64;
export const PASSWORD_HINT = `${PASSWORD_MIN_LENGTH}+ characters with uppercase, lowercase, a number and a special character`;
const PASSWORD_RULES: readonly [RegExp, string][] = [
  [/[a-z]/, "Password must contain a lowercase letter"],
  [/[A-Z]/, "Password must contain an uppercase letter"],
  [/[0-9]/, "Password must contain a number"],
  [/[^A-Za-z0-9]/, "Password must contain a special character"],
];
export const MAX_IMAGE_SIZE_MB = 5;
// Matches the backend multer limit
export const MAX_VIDEO_SIZE_MB = 100;

export const isBlank = (value: string) => value.trim().length === 0;

export const hasErrors = <T>(errors: FieldErrors<T>) => Object.values(errors).some(Boolean);

export const validatePassword = (password: string): string | undefined => {
  if (password.length < PASSWORD_MIN_LENGTH) return `Password must be at least ${PASSWORD_MIN_LENGTH} characters`;
  if (password.length > PASSWORD_MAX_LENGTH) return `Password must be at most ${PASSWORD_MAX_LENGTH} characters`;
  return PASSWORD_RULES.find(([pattern]) => !pattern.test(password))?.[1];
};

export const validateImage = (file: File | null, required: boolean): string | undefined => {
  if (!file) return required ? "Please choose an image" : undefined;
  if (!file.type.startsWith("image/")) return "Only image files are allowed";
  if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) return `Image must be under ${MAX_IMAGE_SIZE_MB} MB`;
  return undefined;
};

export const validateVideo = (file: File | null): string | undefined => {
  if (!file) return "Please choose a video";
  if (!file.type.startsWith("video/")) return "Only video files are allowed";
  if (file.size > MAX_VIDEO_SIZE_MB * 1024 * 1024) return `Video must be under ${MAX_VIDEO_SIZE_MB} MB`;
  return undefined;
};
