/**
 * @file empty-to-undefined.ts
 * @description class-transformer helper for HTML-form payloads.
 */

/**
 * Turns the empty strings that HTML forms send for untouched inputs into `undefined`,
 * so format validators (`@IsDateString`, `@MinLength`, ...) only run against real values.
 *
 * @param {{ value: unknown }} params - class-transformer params.
 * @returns {unknown} `undefined` for `''`, otherwise the original value.
 */
export const emptyToUndefined = ({ value }: { value: unknown }): unknown => (value === '' ? undefined : value);
