import { AUTH_EVENTS, STORAGE_KEYS } from "../constants/storage.constant";
import { authStorage } from "../utils/storage.helper";
import type { AppDispatch } from "./index";
import { sessionExpired, sessionSynced } from "./slices/auth.slice";

const AUTH_STORAGE_KEYS: readonly string[] = Object.values(STORAGE_KEYS);

// Bridges window events (fired outside React/Redux) into the store; lives for the app's lifetime
export const bindAuthListeners = (dispatch: AppDispatch) => {
  window.addEventListener(AUTH_EVENTS.SESSION_EXPIRED, () => dispatch(sessionExpired()));

  // Keeps multiple tabs in sync on login/logout
  window.addEventListener("storage", (event: StorageEvent) => {
    if (event.key === null || AUTH_STORAGE_KEYS.includes(event.key)) {
      dispatch(sessionSynced(authStorage.getSessionUser()));
    }
  });
};
