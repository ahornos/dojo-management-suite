/**
 * @file errors.ts
 * @description Maps machine-readable backend error codes onto `errors.*` translation keys.
 */

/**
 * Extracts a stable error code from an Axios/Nest error payload.
 * Validation arrays (`class-validator`) collapse to `VALIDATION_FAILED`.
 *
 * @param {unknown} error - Rejected Axios error or thrown value.
 * @returns {string | undefined} SCREAMING_SNAKE code, or `undefined` when none is present.
 */
export function resolveErrorCode(error: unknown): string | undefined {
  const payload = (error as { response?: { data?: { message?: unknown } } })?.response?.data?.message
    ?? (error as { message?: unknown })?.message;

  if (Array.isArray(payload)) return 'VALIDATION_FAILED';
  if (typeof payload === 'string' && /^[A-Z][A-Z0-9_]+$/.test(payload)) return payload;
  return undefined;
}

/**
 * Translates a backend error. Unknown codes fall back to the provided key.
 *
 * @param {(key: string) => string} t - `i18next` `t` function.
 * @param {unknown} error - Rejected Axios error or thrown value.
 * @param {string} fallbackKey - Locale key used when the payload is not a known code.
 * @returns {string} Localized message.
 */
export function translateApiError(t: (key: string) => string, error: unknown, fallbackKey: string): string {
  const code = resolveErrorCode(error);
  if (!code) return t(fallbackKey);

  const key = `errors.${code}`;
  const translated = t(key);
  return translated === key ? t(fallbackKey) : translated;
}
