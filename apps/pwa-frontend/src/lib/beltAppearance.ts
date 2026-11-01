/**
 * @file beltAppearance.ts
 * @description Shared belt colour tokens for the Disciplines catalog and the student-list rank badge.
 * Background classes are complete string literals so Tailwind's scanner emits `bg-belt-*`.
 */

/** Semantic Tailwind background class for a belt colour token. */
export type BeltColorToken = 'white' | 'blue' | 'purple' | 'brown' | 'black' | 'grey' | 'yellow' | 'green';

/** Inner label chip for mixed (white- or black-striped) kids ranks. */
export type BeltChip = 'none' | 'white' | 'black';

export interface BeltAppearance {
  /** Fill for the outer pill / catalog card (primary belt colour). */
  baseClass: string;
  /** Center bar used by the Disciplines catalog (kids mixed ranks). */
  stripeClass: string | null;
  /** Extra border (white belt outline / black-belt red bar on the catalog). */
  extraClass: string;
  /**
   * Direct-on-pill text for solid ranks.
   * Light solids (white, yellow) → black; remaining solids → white.
   */
  textClass: 'text-black' | 'text-white' | 'text-foreground';
  /** Student-list inner chip: white+black text, black+white text, or none (solid). */
  chip: BeltChip;
}

/** Bases treated as light: dark glyphs, no inner chip when solid. */
const LIGHT_BASES: ReadonlySet<BeltColorToken> = new Set(['white', 'yellow']);

/** Complete utilities — do not interpolate (`bg-belt-${token}` is purged by Tailwind). */
const BELT_BG_CLASS: Record<BeltColorToken, string> = {
  white: 'bg-belt-white',
  blue: 'bg-belt-blue',
  purple: 'bg-belt-purple',
  brown: 'bg-belt-brown',
  black: 'bg-belt-black',
  grey: 'bg-belt-grey',
  yellow: 'bg-belt-yellow',
  green: 'bg-belt-green',
};

/**
 * Tailwind `bg-belt-*` class for a colour token.
 *
 * @param {BeltColorToken} token - Belt colour.
 * @returns {string} Background class.
 */
export function beltBgClass(token: BeltColorToken): string {
  return BELT_BG_CLASS[token];
}

/**
 * Direct-on-pill contrast for a solid (or outer) belt colour.
 *
 * @param {BeltColorToken} base - Primary belt colour.
 * @returns {'text-black' | 'text-white'} Label colour.
 */
export function solidBeltTextClass(base: BeltColorToken): 'text-black' | 'text-white' {
  return LIGHT_BASES.has(base) ? 'text-black' : 'text-white';
}

/**
 * @param {string} beltName - Stored or display belt label.
 * @returns {string} Lowercase collapsed key for catalog lookup.
 */
function normalizeBeltKey(beltName: string): string {
  return beltName.trim().toLowerCase().replace(/\s+/g, ' ');
}

/**
 * Resolves catalog belt names (English, stored in Prisma) to visual tokens.
 *
 * Mixed kids ranks keep a catalog center-stripe (`stripeClass`) and a list inner chip (`chip`).
 * Orange is not in the BJJ catalog; the same chip rules apply if a token is added later.
 *
 * @param {string} beltName - `BeltRank.name`.
 * @returns {BeltAppearance} Colour classes, contrast, and chip variant.
 */
export function resolveBeltAppearance(beltName: string): BeltAppearance {
  const appearance = (
    base: BeltColorToken,
    stripe: BeltColorToken | null,
    chip: BeltChip,
    extra = '',
  ): BeltAppearance => ({
    baseClass: beltBgClass(base),
    stripeClass: stripe ? beltBgClass(stripe) : null,
    extraClass: extra,
    textClass: solidBeltTextClass(base),
    chip,
  });

  switch (normalizeBeltKey(beltName)) {
    case 'white':
    case 'white belt':
      return appearance('white', null, 'none', 'border border-border');
    case 'blue':
    case 'blue belt':
      return appearance('blue', null, 'none');
    case 'purple':
    case 'purple belt':
      return appearance('purple', null, 'none');
    case 'brown':
    case 'brown belt':
      return appearance('brown', null, 'none');
    case 'black':
    case 'black belt':
      return appearance('black', null, 'none', 'border-b-4 border-belt-red');
    case 'solid grey':
    case 'solid grey belt':
    case 'grey belt':
    case 'gray belt':
      return appearance('grey', null, 'none');
    case 'solid yellow':
    case 'solid yellow belt':
    case 'yellow belt':
      return appearance('yellow', null, 'none');
    case 'solid green':
    case 'solid green belt':
    case 'green belt':
      return appearance('green', null, 'none');
    case 'grey/white':
    case 'grey/white belt':
    case 'gray/white belt':
      return appearance('grey', 'white', 'white');
    case 'grey/black':
    case 'grey/black belt':
    case 'gray/black belt':
      return appearance('grey', 'black', 'black');
    case 'yellow/white':
    case 'yellow/white belt':
      return appearance('yellow', 'white', 'white');
    case 'yellow/black':
    case 'yellow/black belt':
      return appearance('yellow', 'black', 'black');
    case 'green/white':
    case 'green/white belt':
      return appearance('green', 'white', 'white');
    case 'green/black':
    case 'green/black belt':
      return appearance('green', 'black', 'black');
    default:
      return {
        baseClass: 'bg-muted',
        stripeClass: null,
        extraClass: '',
        textClass: 'text-foreground',
        chip: 'none',
      };
  }
}
