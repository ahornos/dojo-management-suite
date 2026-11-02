/**
 * @file csv-fixture.spec.ts
 * @description Numbered *.csv.mock templates use natural keys and a full BJJ belt tree.
 */

import * as path from 'path';
import { StudentStatus } from '../../client';
import { IMPORT_DATA_DIR } from '../import-data-path';
import { PIPELINE_FILE_STEMS } from './constants';
import { readCsv } from './csv';
import { collectPipelineGuardians } from './guardians';
import { cell, parseRole, parseStudentStatus, parseWeekday } from './parse';
import { isProductionCsvFileName, resolveMockTemplates, resolvePipelineFiles } from './resolve-files';

describe('import-data/*.csv.mock fixtures', () => {
  const files = resolveMockTemplates(IMPORT_DATA_DIR);

  it('exposes every pipeline stem as a tracked mock, not as production CSV', () => {
    expect(files.map((file) => file.stem)).toEqual([...PIPELINE_FILE_STEMS]);
    expect(files.every((file) => file.filePath.endsWith('.csv.mock'))).toBe(true);
    expect(files.every((file) => !isProductionCsvFileName(file.filePath))).toBe(true);
    expect(resolvePipelineFiles(IMPORT_DATA_DIR)).toEqual([]);
  });

  it('has no UUID foreign keys and keeps name-based references coherent', async () => {
    const byStem = Object.fromEntries(files.map((file) => [file.stem, file.filePath]));
    const users = await readCsv(byStem['02-users']);
    const federations = await readCsv(byStem['03-federations']);
    const disciplines = await readCsv(byStem['04-disciplines']);
    const schedules = await readCsv(byStem['05-schedules']);
    const students = await readCsv(byStem['06-students']);
    const licenses = await readCsv(byStem['07-licenses']);
    const attendances = await readCsv(byStem['08-attendances']);

    const staffNames = new Set(users.map((row) => cell(row, 'fullName')));
    const disciplineNames = new Set(disciplines.map((row) => cell(row, 'disciplineName')));
    const studentNames = new Set(students.map((row) => `${cell(row, 'firstName')} ${cell(row, 'lastName')}`));
    const federationKeys = new Set(
      federations.flatMap((row) => [cell(row, 'name'), cell(row, 'acronym')]),
    );

    expect(users).toHaveLength(5);
    expect(users.every((row) => !cell(row, 'id') && !cell(row, 'password'))).toBe(true);
    expect(parseRole(cell(users[1]!, 'role'))).toBe('ADMIN_STAFF');
    expect(path.basename(byStem['06-students'])).toBe('06-students.csv.mock');
    expect(parseStudentStatus(cell(students[1]!, 'status'))).toBe(StudentStatus.PAUSED);

    const bjjAdultBlack = disciplines.find(
      (row) =>
        cell(row, 'disciplineName') === 'Brazilian Jiu-Jitsu' &&
        cell(row, 'programName') === 'Adults Program' &&
        cell(row, 'beltName') === 'Black Belt',
    );
    expect(bjjAdultBlack).toMatchObject({
      order: '5',
      maxStripes: '6',
      minMonthsRequired: '36',
      minHoursRequired: '500',
    });
    expect(disciplines.filter((row) => cell(row, 'disciplineName') === 'Brazilian Jiu-Jitsu')).toHaveLength(15);

    for (const row of schedules) {
      expect(parseWeekday(cell(row, 'dayOfWeek'))).toBeGreaterThanOrEqual(1);
      expect(disciplineNames.has(cell(row, 'disciplineName'))).toBe(true);
      expect(staffNames.has(cell(row, 'instructorName'))).toBe(true);
      expect(cell(row, 'id')).toBe('');
    }

    for (const row of licenses) {
      expect(studentNames.has(`${cell(row, 'studentFirstName')} ${cell(row, 'studentLastName')}`)).toBe(true);
      expect(federationKeys.has(cell(row, 'federationName'))).toBe(true);
      expect(cell(row, 'id')).toBe('');
    }

    for (const row of attendances) {
      expect(studentNames.has(`${cell(row, 'studentFirstName')} ${cell(row, 'studentLastName')}`)).toBe(true);
      expect(disciplineNames.has(cell(row, 'disciplineName'))).toBe(true);
      expect(staffNames.has(cell(row, 'instructorName'))).toBe(true);
    }

    const nil = students.find((row) => cell(row, 'firstName') === 'Nil');
    expect(nil).toBeDefined();
    const guardians = collectPipelineGuardians(nil!);
    expect(guardians).toHaveLength(2);
    expect(guardians.map((item) => item.email).sort()).toEqual([
      'jordi.marti@dojo.test',
      'laura.marti@dojo.test',
    ]);
  });
});
