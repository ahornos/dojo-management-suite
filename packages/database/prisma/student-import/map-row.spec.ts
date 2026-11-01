/**
 * @file map-row.spec.ts
 * @description Unit tests for CSV mapping: incomplete rows, spaced IBANs, and status history.
 */

import { DATA_VALIDATION_FLAG } from './constants';
import { buildStatusHistory, mapCsvRow, parseFlexibleDate } from './map-row';

const today = new Date('2026-10-12T00:00:00.000Z');

describe('mapCsvRow', () => {
  it('compacts a spaced IBAN and does not flag a complete row', () => {
    const mapped = mapCsvRow(
      {
        firstName: 'Ana',
        lastName: 'Gomez',
        email: 'ana@dojo.test',
        dni: '12345678Z',
        phone: '600111222',
        birthDate: '1990-01-15',
        status: 'ACTIVE',
        iban: 'ES91 2100 0418 4502 0005 1332',
        accountHolderName: 'Ana Gomez',
      },
      1,
      today,
    );

    expect(mapped.needsDataValidation).toBe(false);
    expect(mapped.iban).toBe('ES9121000418450200051332');
    expect(mapped.missingFields).toEqual([]);
  });

  it('imports rows missing phone, DNI and date of birth and flags them', () => {
    const mapped = mapCsvRow(
      {
        firstName: 'Luis',
        lastName: 'Perez',
        email: 'luis@dojo.test',
        status: 'ACTIVE',
      },
      2,
      today,
    );

    expect(mapped.needsDataValidation).toBe(true);
    expect(mapped.missingFields).toEqual(expect.arrayContaining(['phone', 'dni', 'birthDate']));
    expect(mapped.phone).toBeNull();
    expect(mapped.dni).toBeNull();
    expect(mapped.birthDate).toBeNull();
    expect(mapped.email).toBe('luis@dojo.test');
  });

  it('leaves email empty when the cell is missing and flags it without synthesizing a fake address', () => {
    const mapped = mapCsvRow({ firstName: 'No', lastName: 'Mail', status: 'ACTIVE' }, 7, today);
    expect(mapped.emailWasGenerated).toBe(true);
    expect(mapped.email).toBe('');
    expect(mapped.missingFields).toContain('email');
    expect(mapped.email).not.toContain('.invalid');
  });

  it('parses Spanish calendar dates', () => {
    expect(parseFlexibleDate('15/01/1990')?.toISOString()).toBe('1990-01-15T00:00:00.000Z');
  });

  it('maps padre/madre columns, Excel phones, and flags a missing holder DNI without dropping the IBAN', () => {
    const mapped = mapCsvRow(
      {
        first_name: 'Jon',
        last_name: 'Ribera Fondevila',
        birth_date: '2019-01-12',
        gender: 'Masculino',
        status_raw: 'Pausa',
        mother_name: 'Ana Fondevila',
        mother_phone: '679650065.0',
        mother_email: 'fondearse@gmail.com',
        father_name: 'Joaquim Ribera',
        father_phone: '654320262',
        father_email: 'joaquim.ribera@gmail.com',
        account_holder_name: 'Joaquim Ribera Juanmarti',
        iban: 'ES91 2100 0418 4502 0005 1332',
        discipline: 'Brazilian Jiu-Jitsu',
        belt_bjj: 'Grey/White Belt',
        start_date: '2025-01-16 00:00:00',
      },
      1,
      today,
    );

    expect(mapped.status).toBe('PAUSED');
    expect(mapped.isMinor).toBe(true);
    expect(mapped.guardians).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          relationship: 'Madre',
          email: 'fondearse@gmail.com',
          phone: '679650065',
          firstName: 'Ana',
          lastName: 'Fondevila',
        }),
        expect.objectContaining({
          relationship: 'Padre',
          email: 'joaquim.ribera@gmail.com',
          phone: '654320262',
        }),
      ]),
    );
    expect(mapped.iban).toBe('ES9121000418450200051332');
    expect(mapped.accountHolderName).toBe('Joaquim Ribera Juanmarti');
    expect(mapped.accountHolderDni).toBe('00000000X');
    expect(mapped.accountHolderDniWasDefaulted).toBe(true);
    expect(mapped.flags.some((flag) => flag.field === 'accountHolderDni')).toBe(true);
    expect(mapped.disciplineName).toBe('Brazilian Jiu-Jitsu');
    expect(mapped.beltName).toBe('Grey/White Belt');
  });

  it('rejects a parent cell that reuses the minor student email, phone, or DNI', () => {
    const mapped = mapCsvRow(
      {
        firstName: 'Nil',
        lastName: 'Marti',
        email: 'nil.marti@dojo.test',
        phone: '600999000',
        dni: '12345678Z',
        birthDate: '2014-05-01',
        mother_name: 'Nil Marti',
        mother_email: 'nil.marti@dojo.test',
        mother_phone: '600999000',
        father_name: 'Pau Marti',
        father_email: 'pau.marti@dojo.test',
        father_phone: '611000111',
      },
      8,
      today,
    );

    expect(mapped.isMinor).toBe(true);
    expect(mapped.guardians).toHaveLength(1);
    expect(mapped.guardians[0]).toEqual(expect.objectContaining({ relationship: 'Padre', email: 'pau.marti@dojo.test' }));
    expect(mapped.selfReferencingParents).toEqual([
      expect.objectContaining({ relationship: 'Madre', matchedField: 'email' }),
    ]);
  });

  it('flags a minor with only self-referencing parents so staff can attach a real guardian later', () => {
    const mapped = mapCsvRow(
      {
        firstName: 'Leo',
        lastName: 'Solo',
        email: 'leo.solo@dojo.test',
        phone: '600111000',
        birthDate: '2015-01-01',
        father_name: 'Leo Solo',
        father_email: 'leo.solo@dojo.test',
      },
      9,
      today,
    );

    expect(mapped.guardians).toHaveLength(0);
    expect(mapped.selfReferencingParents).toHaveLength(1);
    expect(mapped.flags.some((flag) => flag.detail.includes('REQUIERE_DATOS_TUTOR'))).toBe(true);
  });
});

describe('buildStatusHistory', () => {
  it('records enrollment then a later pause with leave reason', () => {
    const mapped = mapCsvRow(
      {
        firstName: 'Marta',
        lastName: 'Ruiz',
        email: 'marta@dojo.test',
        dni: '1',
        phone: '6',
        birthDate: '1988-06-20',
        status: 'PAUSED',
        startDate: '2023-09-01',
        endDate: '2026-02-01',
        leaveReason: 'ECONOMIC',
      },
      3,
      today,
    );
    const history = buildStatusHistory(mapped);
    expect(history).toHaveLength(2);
    expect(history[0]).toEqual(
      expect.objectContaining({ previousStatus: null, newStatus: 'ACTIVE', reason: 'Initial enrollment' }),
    );
    expect(history[1]).toEqual(
      expect.objectContaining({ previousStatus: 'ACTIVE', newStatus: 'PAUSED', leaveReason: 'ECONOMIC' }),
    );
  });

  it('uses REQUIERE_VALIDACION_DATOS on the initial history row when fields are missing', () => {
    const mapped = mapCsvRow({ firstName: 'X', lastName: 'Y', email: 'x@dojo.test' }, 4, today);
    const history = buildStatusHistory(mapped);
    expect(history[0].reason).toBe(DATA_VALIDATION_FLAG);
    expect(history[0].customReasonDetails).toContain('phone');
  });
});
