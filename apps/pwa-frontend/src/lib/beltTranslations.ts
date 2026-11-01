/**
 * @file beltTranslations.ts
 * @description Utility helper to map database belt names to localized i18n keys.
 */

const BELT_NAME_KEYS: Record<string, string> = {
  'White Belt': 'white',
  'Blue Belt': 'blue',
  'Purple Belt': 'purple',
  'Brown Belt': 'brown',
  'Black Belt': 'black',
  'Grey/White Belt': 'grey_white',
  'Solid Grey Belt': 'solid_grey',
  'Grey/Black Belt': 'grey_black',
  'Yellow/White Belt': 'yellow_white',
  'Solid Yellow Belt': 'solid_yellow',
  'Yellow/Black Belt': 'yellow_black',
  'Green/White Belt': 'green_white',
  'Solid Green Belt': 'solid_green',
  'Green/Black Belt': 'green_black',
};

/**
 * Full localized belt name including “Belt” / “Cinturón”.
 *
 * @param {string} dbName - Stored English belt name.
 * @param {(key: string) => string} t - i18n `t`.
 * @returns {string} Localized rank label.
 */
export function getLocalizedBeltName(dbName: string, t: (key: string) => string): string {
  const slug = BELT_NAME_KEYS[dbName];
  return slug ? t(`belts.names.${slug}`) : dbName;
}

/**
 * Colour name without the word “Belt” / “Cinturón”, for dense rank badges.
 *
 * @param {string} dbName - Stored English belt name.
 * @param {(key: string) => string} t - i18n `t`.
 * @returns {string} Short colour label.
 */
export function getLocalizedBeltShortName(dbName: string, t: (key: string) => string): string {
  const slug = BELT_NAME_KEYS[dbName];
  return slug ? t(`belts.short.${slug}`) : dbName.replace(/\s*Belt$/i, '').trim();
}