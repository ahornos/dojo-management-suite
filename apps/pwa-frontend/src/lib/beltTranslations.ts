/**
 * @file beltTranslations.ts
 * @description Utility helper to map database belt names to localized i18n keys.
 */

export function getLocalizedBeltName(dbName: string, t: (key: string) => string): string {
  const beltKeyMap: Record<string, string> = {
    'White Belt': 'belts.names.white',
    'Blue Belt': 'belts.names.blue',
    'Purple Belt': 'belts.names.purple',
    'Brown Belt': 'belts.names.brown',
    'Black Belt': 'belts.names.black',
    'Grey/White Belt': 'belts.names.grey_white',
    'Solid Grey Belt': 'belts.names.solid_grey',
    'Grey/Black Belt': 'belts.names.grey_black',
    'Yellow/White Belt': 'belts.names.yellow_white',
    'Solid Yellow Belt': 'belts.names.solid_yellow',
    'Yellow/Black Belt': 'belts.names.yellow_black',
    'Green/White Belt': 'belts.names.green_white',
    'Solid Green Belt': 'belts.names.solid_green',
    'Green/Black Belt': 'belts.names.green_black',
  };

  const translationKey = beltKeyMap[dbName];
  return translationKey ? t(translationKey) : dbName;
}