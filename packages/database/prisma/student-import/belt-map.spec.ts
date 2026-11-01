/**
 * @file belt-map.spec.ts
 * @description Discipline aliases and belt fallback to the entry-level rank.
 */

import { matchDiscipline, resolveBelt, type CatalogDiscipline } from './belt-map';

const catalog: CatalogDiscipline[] = [
  {
    id: 'bjj',
    name: 'Brazilian Jiu-Jitsu',
    acronym: 'BJJ',
    programs: [
      {
        id: 'adults',
        name: 'Adults Program',
        minAge: 16,
        maxAge: 99,
        beltRanks: [
          { id: 'white-a', name: 'White Belt', order: 1 },
          { id: 'blue', name: 'Blue Belt', order: 2 },
        ],
      },
      {
        id: 'kids',
        name: 'Kids Program',
        minAge: 4,
        maxAge: 15,
        beltRanks: [
          { id: 'white-k', name: 'White Belt', order: 1 },
          { id: 'gw', name: 'Grey/White Belt', order: 2 },
          { id: 'grey', name: 'Solid Grey Belt', order: 3 },
        ],
      },
    ],
  },
];

describe('matchDiscipline', () => {
  it('matches the seeded Brazilian Jiu-Jitsu name and BJJ aliases', () => {
    expect(matchDiscipline('Brazilian Jiu-Jitsu', catalog)?.id).toBe('bjj');
    expect(matchDiscipline('BJJ, NO-GI, Jiu-Jitsu Trad.', catalog)?.id).toBe('bjj');
  });

  it('matches a catalog acronym even when the CSV token is not a name alias', () => {
    const withDpf: CatalogDiscipline[] = [
      ...catalog,
      { id: 'dpf', name: 'Def. Pers. Fem.', acronym: 'DPF', programs: [] },
    ];
    expect(matchDiscipline('DPF', withDpf)?.id).toBe('dpf');
  });

  it('returns null for disciplines that are not in the catalog', () => {
    expect(matchDiscipline('Yoga', catalog)).toBeNull();
    expect(matchDiscipline('Def. Pers. Fem.', catalog)).toBeNull();
  });
});

describe('resolveBelt', () => {
  it('maps Grey/White Belt onto the kids program', () => {
    const resolved = resolveBelt({
      disciplineName: 'Brazilian Jiu-Jitsu',
      beltName: 'Grey/White Belt',
      age: 7,
      catalog,
    });
    expect(resolved.belt?.name).toBe('Grey/White Belt');
    expect(resolved.program?.id).toBe('kids');
    expect(resolved.defaultedBelt).toBe(false);
  });

  it('maps Grey Belt onto Solid Grey Belt', () => {
    const resolved = resolveBelt({
      disciplineName: 'Brazilian Jiu-Jitsu',
      beltName: 'Grey Belt',
      age: 8,
      catalog,
    });
    expect(resolved.belt?.name).toBe('Solid Grey Belt');
    expect(resolved.defaultedBelt).toBe(false);
  });

  it('defaults an unknown belt to White Belt and marks it unmatched', () => {
    const resolved = resolveBelt({
      disciplineName: 'Brazilian Jiu-Jitsu',
      beltName: 'Rainbow Belt',
      age: 20,
      catalog,
    });
    expect(resolved.belt?.name).toBe('White Belt');
    expect(resolved.defaultedBelt).toBe(true);
    expect(resolved.unmatchedBelt).toBe(true);
  });
});
