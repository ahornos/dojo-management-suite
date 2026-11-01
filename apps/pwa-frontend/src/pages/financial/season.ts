/**
 * @file season.ts
 * @description Academic/federation season helpers (`YYYY-YYYY`, September–August).
 */

/**
 * Season in force on `now`: from 1 September `YYYY` through 31 August `YYYY+1`.
 *
 * @param {Date} [now] - Reference date (injectable for tests).
 * @returns {string} Season label such as `2026-2027`.
 */
export function currentSeason(now: Date = new Date()): string {
  const year = now.getFullYear();
  const month = now.getMonth();
  return month >= 8 ? `${year}-${year + 1}` : `${year - 1}-${year}`;
}

/**
 * True when the label is `YYYY-YYYY`.
 *
 * @param {string} season - Candidate label.
 * @returns {boolean} Whether the format is valid.
 */
export function isSeasonLabel(season: string): boolean {
  return /^\d{4}-\d{4}$/.test(season.trim());
}
