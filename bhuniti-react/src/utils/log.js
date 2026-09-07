/*
 * Single place for diagnostic output.
 *
 * The pages used to call console.log directly inside catch blocks -- including
 * one that printed the demo OTP -- so a production build shipped a noisy,
 * partly sensitive console. Everything routes through here instead, and nothing
 * is printed outside a dev server.
 */

const isDev =
  typeof import.meta !== "undefined" && import.meta.env
    ? Boolean(import.meta.env.DEV)
    : false;

/**
 * Note that a call fell back to offline/demo data.
 * @param {string} context short description of what was being fetched
 * @param {unknown} error the caught error
 */
export function logFallback(context, error) {
  if (!isDev) return;
  const message = error && error.message ? error.message : String(error ?? "");
  // eslint-disable-next-line no-console
  console.info(`[bhuniti] ${context} — using offline data (${message})`);
}

/**
 * Turn a caught error into something safe to show a citizen or officer.
 * @param {unknown} error the caught error
 * @param {string} fallbackMessage already-translated default text
 */
export function toDisplayMessage(error, fallbackMessage) {
  if (error && typeof error.message === "string" && error.message.trim()) {
    return error.message;
  }
  return fallbackMessage;
}
