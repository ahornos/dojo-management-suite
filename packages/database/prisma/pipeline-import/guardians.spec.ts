/**
 * @file guardians.spec.ts
 * @description Mother + father columns become two distinct PARENT identities.
 */

import { collectPipelineGuardians } from './guardians';

describe('collectPipelineGuardians', () => {
  it('returns both mother and father when emails differ', () => {
    const guardians = collectPipelineGuardians({
      motherName: 'Laura Marti',
      motherEmail: 'laura.marti@dojo.test',
      motherPhone: '611000111',
      motherDni: '99887766C',
      fatherName: 'Jordi Marti',
      fatherEmail: 'jordi.marti@dojo.test',
      fatherPhone: '611000222',
      fatherDni: '99887766D',
    });

    expect(guardians).toHaveLength(2);
    expect(guardians.map((item) => item.relationship).sort()).toEqual(['Madre', 'Padre']);
    expect(guardians.map((item) => item.email).sort()).toEqual([
      'jordi.marti@dojo.test',
      'laura.marti@dojo.test',
    ]);
  });

  it('deduplicates a repeated legalGuardian email', () => {
    const guardians = collectPipelineGuardians({
      motherName: 'Laura Marti',
      motherEmail: 'laura.marti@dojo.test',
      legalGuardianName: 'Laura Marti',
      legalGuardianEmail: 'laura.marti@dojo.test',
    });
    expect(guardians).toHaveLength(1);
  });

  it('skips a guardian without an email (User unique key)', () => {
    expect(
      collectPipelineGuardians({
        fatherName: 'Jordi Marti',
        fatherPhone: '611000222',
      }),
    ).toEqual([]);
  });
});
