import { STORAGE_KEYS } from "../constants/storage.constant";
import type { AuthSession, AuthTokens } from "../types/auth.types";
import type { User } from "../types/user.types";

// localStorage can throw (private mode, quota), so every access is guarded
const read = (key: string): string | null => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const write = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* storage unavailable */
  }
};

const remove = (key: string) => {
  try {
    localStorage.removeItem(key);
  } catch {
    /* storage unavailable */
  }
};

export const authStorage = {
  getAccessToken: () => read(STORAGE_KEYS.ACCESS_TOKEN),
  getRefreshToken: () => read(STORAGE_KEYS.REFRESH_TOKEN),

  getUser(): User | null {
    const raw = read(STORAGE_KEYS.USER);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  },

  // User is only trusted when a token accompanies it
  getSessionUser(): User | null {
    return authStorage.getAccessToken() ? authStorage.getUser() : null;
  },

  setTokens({ accessToken, refreshToken }: AuthTokens) {
    write(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    write(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
  },

  setUser(user: User) {
    write(STORAGE_KEYS.USER, JSON.stringify(user));
  },

  setSession({ user, ...tokens }: AuthSession) {
    authStorage.setTokens(tokens);
    authStorage.setUser(user);
  },

  clear() {
    Object.values(STORAGE_KEYS).forEach(remove);
  },
};
