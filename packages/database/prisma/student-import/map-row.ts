/**
 * @file map-row.ts
 * @description Pure CSV-row mapping for student import. Missing phone/DNI/DOB never abort a row.
 */

import { DATA_VALIDATION_FLAG, PENDING_HOLDER_DNI, TUTOR_VALIDATION_FLAG } from './constants';
import { isValidIban, toIban } from './iban';

export type MappedGender = 'MALE' | 'FEMALE' | 'NON_BINARY' | 'OTHER';
export type MappedStatus = 'TRIAL' | 'ACTIVE' | 'PAUSED' | 'DROPPED';
export type MappedLeaveReason =
  | 'ECONOMIC'
  | 'TIME_CONFLICT'
  | 'INJURY'
  | 'MOVED'
  | 'DISSATISFIED'
  | 'OTHER';
/** Persisted `StudentGuardian.relationship` values (Spanish domain keys used by the PWA). */
export type GuardianRelationship = 'Padre' | 'Madre' | 'Tutor Legal';

/**
 * Field-level review note printed in the import audit.
 */
export interface MappedFlag {
  field: string;
  detail: string;
}

/**
 * Parent identity extracted from padre/madre (or legacy tutor) columns.
 */
export interface MappedGuardian {
  firstName: string;
  lastName: string;
  email: string;
  emailWasGenerated: boolean;
  phone: string | null;
  dni: string | null;
  relationship: GuardianRelationship;
}

/**
 * Parent CSV cell that reused the minor's own email, phone, or DNI.
 */
export interface SelfReferencingParent {
  relationship: GuardianRelationship;
  matchedField: 'email' | 'phone' | 'dni';
  parentEmail: string | null;
  parentPhone: string | null;
  parentDni: string | null;
}

/**
 * Normalized student row ready for persistence.
 */
export interface MappedStudentRow {
  index: number;
  firstName: string;
  lastName: string;
  email: string;
  emailWasGenerated: boolean;
  dni: string | null;
  phone: string | null;
  birthDate: Date | null;
  gender: MappedGender | null;
  address: string | null;
  city: string | null;
  state: string | null;
  postalCode: string | null;
  country: string;
  status: MappedStatus;
  startDate: Date | null;
  endDate: Date | null;
  leaveReason: MappedLeaveReason | null;
  customReasonDetails: string | null;
  password: string | null;
  iban: string | null;
  accountHolderName: string | null;
  accountHolderDni: string | null;
  accountHolderDniWasDefaulted: boolean;
  guardians: MappedGuardian[];
  selfReferencingParents: SelfReferencingParent[];
  disciplineName: string | null;
  beltName: string | null;
  missingFields: string[];
  flags: MappedFlag[];
  needsDataValidation: boolean;
  isMinor: boolean;
}

/**
 * Reads a cell by alias list (case-insensitive, BOM-safe).
 *
 * @param {Record<string, string>} row - csv-parser object.
 * @param {string[]} aliases - Header names to try.
 * @returns {string} Trimmed value, or empty.
 */
export function cell(row: Record<string, string>, ...aliases: string[]): string {
  const normalized = new Map<string, string>();
  for (const [key, value] of Object.entries(row)) {
    normalized.set(normalizeHeader(key), typeof value === 'string' ? value.trim() : '');
  }
  for (const alias of aliases) {
    const found = normalized.get(normalizeHeader(alias));
    if (found) return found;
  }
  return '';
}

/**
 * @param {string} header - Raw CSV header.
 * @returns {string} Lowercase alphanumeric key.
 */
export function normalizeHeader(header: string): string {
  return header.replace(/^\uFEFF/, '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '');
}

/**
 * Parses ISO, datetime, or Spanish calendar dates. Invalid values become `null`.
 *
 * @param {string} raw - Date cell.
 * @returns {Date | null} UTC midnight, or null.
 */
export function parseFlexibleDate(raw: string): Date | null {
  const value = raw.trim();
  if (!value) return null;

  if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
    const isoDay = value.slice(0, 10);
    const date = new Date(`${isoDay}T00:00:00.000Z`);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  const slash = value.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
  if (slash) {
    const day = Number.parseInt(slash[1], 10);
    const month = Number.parseInt(slash[2], 10);
    const year = Number.parseInt(slash[3], 10);
    const date = new Date(Date.UTC(year, month - 1, day));
    if (date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day) {
      return date;
    }
  }

  const fallback = new Date(value);
  return Number.isNaN(fallback.getTime()) ? null : fallback;
}

/**
 * Maps a CSV row into a persistence DTO. Incomplete identity fields are null and flagged.
 *
 * @param {Record<string, string>} row - Raw csv-parser row.
 * @param {number} index - 1-based row number for placeholder emails.
 * @param {Date} [today] - Reference date for minority.
 * @returns {MappedStudentRow} Normalized row.
 */
export function mapCsvRow(row: Record<string, string>, index: number, today: Date = new Date()): MappedStudentRow {
  const firstName = cell(row, 'firstName', 'first_name', 'Name', 'nombre') || 'Unknown';
  const lastName = cell(row, 'lastName', 'last_name', 'Surname/s', 'apellidos', 'apellido') || 'Unknown';
  const email = cell(row, 'email', 'Email', 'correo').toLowerCase();
  const emailWasGenerated = email.length === 0;

  const flags: MappedFlag[] = [];
  const missingFields: string[] = [];
  const flag = (field: string, detail: string): void => {
    missingFields.push(field);
    flags.push({ field, detail });
  };

  const dni = normalizeDni(cell(row, 'dni', 'ID / Passport', 'idpassport', 'nif', 'nie'));
  const phone = normalizePhone(cell(row, 'phone', 'Phone', 'telefono', 'teléfono'));
  const birthDate = parseFlexibleDate(cell(row, 'birthDate', 'birth_date', 'fechaNacimiento', 'fecha de nacimiento'));
  if (emailWasGenerated) flag('email', 'email missing; no User identity will be created');
  if (!phone) flag('phone', 'phone missing');
  if (!dni) flag('dni', 'DNI missing');
  if (!birthDate) flag('birthDate', 'birth date missing');

  const rawIban = cell(row, 'iban', 'IBAN', 'cuenta');
  const iban = rawIban ? toIban(rawIban) : null;
  const validIban = iban && isValidIban(iban) ? iban : null;
  if (rawIban && !validIban) {
    flag('iban', 'IBAN present but checksum-invalid; mandate skipped');
  }

  let accountHolderName = emptyToNull(
    cell(row, 'accountHolderName', 'account_holder_name', 'Titular IBAN', 'titular', 'account holder'),
  );
  if (validIban && !accountHolderName) {
    accountHolderName = `${firstName} ${lastName}`.trim();
    flag('accountHolderName', `Titular IBAN missing; defaulted to "${accountHolderName}"`);
  }

  const csvHolderDni = normalizeDni(
    cell(row, 'accountHolderDni', 'account_holder_dni', 'titularDni', 'dni titular'),
  );
  let accountHolderDni = csvHolderDni ?? dni;
  let accountHolderDniWasDefaulted = false;
  if (validIban && accountHolderName && !accountHolderDni) {
    accountHolderDni = PENDING_HOLDER_DNI;
    accountHolderDniWasDefaulted = true;
    flag('accountHolderDni', `account holder DNI missing; defaulted to ${PENDING_HOLDER_DNI}`);
  }

  const collected = collectGuardians(row, index);
  const { valid: guardians, selfReferencing: selfReferencingParents } = splitValidGuardians(
    { email, emailWasGenerated, phone, dni },
    collected,
  );
  for (const overlap of selfReferencingParents) {
    flag(
      'selfParent',
      `${overlap.relationship} column reuses the student's ${overlap.matchedField}; parent user not created`,
    );
  }
  const isMinor = birthDate ? ageInYears(birthDate, today) < 18 : false;
  if (isMinor && guardians.length === 0) {
    flag('parent', `${TUTOR_VALIDATION_FLAG}: minor has no valid distinct parent contact`);
  }

  const disciplineName = emptyToNull(cell(row, 'discipline', 'disciplina'));
  const beltName =
    emptyToNull(cell(row, 'belt_bjj', 'beltBjj', 'belt', 'cinturon', 'cinturón')) ??
    emptyToNull(cell(row, 'belt_jjt', 'beltJjt'));

  return {
    index,
    firstName,
    lastName,
    email,
    emailWasGenerated,
    dni,
    phone,
    birthDate,
    gender: parseGender(cell(row, 'gender', 'sexo', 'genero', 'género')),
    address: emptyToNull(cell(row, 'address', 'Address', 'direccion', 'dirección')),
    city: emptyToNull(cell(row, 'city', 'City', 'ciudad')),
    state: emptyToNull(cell(row, 'state', 'State / Province', 'provincia')),
    postalCode: emptyToNull(cell(row, 'postalCode', 'Postal Code', 'cp', 'codigoPostal')),
    country: cell(row, 'country', 'Country', 'pais', 'país') || 'ES',
    status: parseStatus(cell(row, 'status', 'status_raw', 'estado')),
    startDate: parseFlexibleDate(cell(row, 'startDate', 'start_date', 'fechaAlta', 'fecha inicio')),
    endDate: parseFlexibleDate(cell(row, 'endDate', 'end_date', 'fechaBaja', 'fecha fin')),
    leaveReason: parseLeaveReason(cell(row, 'leaveReason', 'leave_reason', 'motivoBaja', 'motivo')),
    customReasonDetails: emptyToNull(cell(row, 'customReasonDetails', 'notas', 'notes')),
    password: emptyToNull(cell(row, 'password', 'Init password', 'contraseña')),
    iban: validIban,
    accountHolderName: validIban ? accountHolderName : null,
    accountHolderDni: validIban ? accountHolderDni : null,
    accountHolderDniWasDefaulted,
    guardians,
    selfReferencingParents,
    disciplineName,
    beltName,
    missingFields,
    flags,
    needsDataValidation: flags.length > 0,
    isMinor,
  };
}

/**
 * Builds status-history entries so analytics see enrollment and later pause/drop.
 *
 * @param {MappedStudentRow} row - Mapped CSV row.
 * @returns {Array<{ previousStatus: MappedStatus | null; newStatus: MappedStatus; reason: string; leaveReason: MappedLeaveReason | null; customReasonDetails: string | null; createdAt: Date }>} History rows.
 */
export function buildStatusHistory(row: MappedStudentRow): Array<{
  previousStatus: MappedStatus | null;
  newStatus: MappedStatus;
  reason: string;
  leaveReason: MappedLeaveReason | null;
  customReasonDetails: string | null;
  createdAt: Date;
}> {
  const enrollmentAt = row.startDate ?? new Date();
  const validationNote = row.needsDataValidation
    ? `${DATA_VALIDATION_FLAG}: ${row.flags.map((item) => item.detail).join('; ')}`
    : null;
  const initialReason = row.needsDataValidation ? DATA_VALIDATION_FLAG : 'Initial enrollment';
  const initialStatus: MappedStatus = row.status === 'TRIAL' ? 'TRIAL' : 'ACTIVE';

  const entries: Array<{
    previousStatus: MappedStatus | null;
    newStatus: MappedStatus;
    reason: string;
    leaveReason: MappedLeaveReason | null;
    customReasonDetails: string | null;
    createdAt: Date;
  }> = [
    {
      previousStatus: null,
      newStatus: initialStatus,
      reason: initialReason,
      leaveReason: null,
      customReasonDetails: validationNote,
      createdAt: enrollmentAt,
    },
  ];

  if (row.status === 'PAUSED' || row.status === 'DROPPED') {
    entries.push({
      previousStatus: initialStatus,
      newStatus: row.status,
      reason: row.customReasonDetails || row.status,
      leaveReason: row.leaveReason,
      customReasonDetails: row.customReasonDetails,
      createdAt: row.endDate ?? new Date(),
    });
  }

  return entries;
}

/**
 * Drops parent cells that reuse the minor's own email, phone, or DNI (self-parenting).
 *
 * @param {Pick<MappedStudentRow, 'email' | 'emailWasGenerated' | 'phone' | 'dni'>} student - Student identity.
 * @param {MappedGuardian[]} guardians - Parsed parent rows.
 * @returns {{ valid: MappedGuardian[]; selfReferencing: SelfReferencingParent[] }} Kept vs rejected parents.
 */
export function splitValidGuardians(
  student: Pick<MappedStudentRow, 'email' | 'emailWasGenerated' | 'phone' | 'dni'>,
  guardians: MappedGuardian[],
): { valid: MappedGuardian[]; selfReferencing: SelfReferencingParent[] } {
  const valid: MappedGuardian[] = [];
  const selfReferencing: SelfReferencingParent[] = [];
  for (const guardian of guardians) {
    const matchedField = overlapField(student, guardian);
    if (!matchedField) {
      valid.push(guardian);
      continue;
    }
    selfReferencing.push({
      relationship: guardian.relationship,
      matchedField,
      parentEmail: guardian.email,
      parentPhone: guardian.phone,
      parentDni: guardian.dni,
    });
  }
  return { valid, selfReferencing };
}

/**
 * @param {Pick<MappedStudentRow, 'email' | 'emailWasGenerated' | 'phone' | 'dni'>} student - Student identity.
 * @param {MappedGuardian} guardian - Candidate parent.
 * @returns {'email' | 'phone' | 'dni' | null} Matching field, or null when distinct.
 */
function overlapField(
  student: Pick<MappedStudentRow, 'email' | 'emailWasGenerated' | 'phone' | 'dni'>,
  guardian: MappedGuardian,
): 'email' | 'phone' | 'dni' | null {
  if (guardian.email && student.email && guardian.email === student.email) {
    return 'email';
  }
  if (guardian.phone && student.phone && guardian.phone === student.phone) {
    return 'phone';
  }
  if (guardian.dni && student.dni && guardian.dni === student.dni) {
    return 'dni';
  }
  return null;
}

/**
 * Collects padre, madre, and legacy tutor contacts that have an email or phone.
 *
 * @param {Record<string, string>} row - Raw CSV row.
 * @param {number} index - Row number for generated parent emails.
 * @returns {MappedGuardian[]} Deduplicated guardians.
 */
function collectGuardians(row: Record<string, string>, index: number): MappedGuardian[] {
  const collected: MappedGuardian[] = [];
  const father = mapGuardian(
    row,
    index,
    'Padre',
    ['father_name', 'Nombre Padre', 'nombrePadre', 'fatherName'],
    ['father_phone', 'TELEFONO PADRE', 'telefonoPadre', 'fatherPhone'],
    ['father_email', 'Email Padre', 'emailPadre', 'fatherEmail'],
    ['father_dni', 'dniPadre', 'fatherDni'],
  );
  const mother = mapGuardian(
    row,
    index,
    'Madre',
    ['mother_name', 'Nombre Madre', 'nombreMadre', 'motherName'],
    ['mother_phone', 'TELEFONO MADRE', 'telefonoMadre', 'motherPhone'],
    ['mother_email', 'Email Madre', 'emailMadre', 'motherEmail'],
    ['mother_dni', 'dniMadre', 'motherDni'],
  );
  if (father) collected.push(father);
  if (mother) collected.push(mother);

  const legacyEmail = cell(row, 'parentEmail', 'emailTutor', 'email padre').toLowerCase();
  if (legacyEmail && !collected.some((item) => item.email === legacyEmail)) {
    const names = splitPersonName(
      `${cell(row, 'parentFirstName', 'nombreTutor', 'nombre padre')} ${cell(row, 'parentLastName', 'apellidosTutor', 'apellidos padre')}`.trim(),
    );
    collected.push({
      firstName: names.firstName,
      lastName: names.lastName,
      email: legacyEmail,
      emailWasGenerated: false,
      phone: normalizePhone(cell(row, 'parentPhone', 'telefonoTutor')),
      dni: normalizeDni(cell(row, 'parentDni', 'dniTutor')),
      relationship: 'Tutor Legal',
    });
  }

  return collected;
}

/**
 * @param {Record<string, string>} row - CSV row.
 * @param {number} index - Row number.
 * @param {GuardianRelationship} relationship - Padre, Madre, or Tutor Legal.
 * @param {string[]} nameAliases - Full-name headers.
 * @param {string[]} phoneAliases - Phone headers.
 * @param {string[]} emailAliases - Email headers.
 * @param {string[]} dniAliases - DNI headers.
 * @returns {MappedGuardian | null} Guardian when email or phone is present.
 */
function mapGuardian(
  row: Record<string, string>,
  index: number,
  relationship: GuardianRelationship,
  nameAliases: string[],
  phoneAliases: string[],
  emailAliases: string[],
  dniAliases: string[],
): MappedGuardian | null {
  const phone = normalizePhone(cell(row, ...phoneAliases));
  let email = cell(row, ...emailAliases).toLowerCase();
  const fullName = cell(row, ...nameAliases);
  if (!email && !phone && !fullName) return null;
  if (!email && !phone) return null;

  const names = splitPersonName(fullName);
  const emailWasGenerated = email.length === 0;

  return {
    firstName: names.firstName,
    lastName: names.lastName,
    email,
    emailWasGenerated,
    phone,
    dni: normalizeDni(cell(row, ...dniAliases)),
    relationship,
  };
}

/**
 * @param {string} fullName - "Ana Fondevila" or a single token.
 * @returns {{ firstName: string; lastName: string }} Split name.
 */
export function splitPersonName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { firstName: 'Unknown', lastName: 'Unknown' };
  if (parts.length === 1) return { firstName: parts[0], lastName: 'Unknown' };
  return { firstName: parts[0], lastName: parts.slice(1).join(' ') };
}

/**
 * Strips Excel `.0` suffixes and non-digits from a phone cell.
 *
 * @param {string} raw - Phone cell.
 * @returns {string | null} Digit string, or null.
 */
export function normalizePhone(raw: string): string | null {
  let value = raw.trim();
  if (!value) return null;
  if (/^\d+\.0+$/.test(value)) {
    value = value.replace(/\.0+$/, '');
  }
  const digits = value.replace(/\D/g, '');
  return digits.length > 0 ? digits : null;
}

/**
 * Removes separators from a Spanish DNI/NIE.
 *
 * @param {string} raw - DNI cell.
 * @returns {string | null} Compact id, or null.
 */
export function normalizeDni(raw: string): string | null {
  const compact = raw.trim().replace(/[\s.-]/g, '').toUpperCase();
  return compact.length > 0 ? compact : null;
}

/**
 * @param {string} value - Raw cell.
 * @returns {string | null} Null when blank.
 */
function emptyToNull(value: string): string | null {
  const trimmed = value.trim();
  return trimmed === '' ? null : trimmed;
}

/**
 * @param {string} value - Name fragment.
 * @returns {string} Email-safe slug.
 */
export function slug(value: string): string {
  const ascii = value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '');
  return ascii || 'student';
}

/**
 * @param {Date} birthDate - Date of birth.
 * @param {Date} today - Reference.
 * @returns {number} Completed years.
 */
export function ageInYears(birthDate: Date, today: Date): number {
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDelta = today.getMonth() - birthDate.getMonth();
  if (monthDelta < 0 || (monthDelta === 0 && today.getDate() < birthDate.getDate())) {
    age -= 1;
  }
  return age;
}

/**
 * @param {string} raw - Gender cell.
 * @returns {MappedGender | null} Enum member, or null.
 */
function parseGender(raw: string): MappedGender | null {
  const value = raw.trim().toUpperCase();
  if (!value) return null;
  if (['MALE', 'M', 'H', 'HOMBRE', 'MASCULINO'].includes(value)) return 'MALE';
  if (['FEMALE', 'F', 'MUJER', 'FEMENINO'].includes(value)) return 'FEMALE';
  if (['NON_BINARY', 'NB', 'NO BINARIO', 'NOBINARIO'].includes(value)) return 'NON_BINARY';
  if (['OTHER', 'OTRO', 'O'].includes(value)) return 'OTHER';
  return null;
}

/**
 * @param {string} raw - Status cell (`Alta` / `Pausa` / `Baja` or enum names).
 * @returns {MappedStatus} Lifecycle status (defaults to ACTIVE).
 */
function parseStatus(raw: string): MappedStatus {
  const value = raw.trim().toUpperCase().replace(/\s+/g, '_');
  if (['TRIAL', 'PRUEBA'].includes(value)) return 'TRIAL';
  if (['PAUSED', 'PAUSA', 'BAJA_TEMPORAL'].includes(value)) return 'PAUSED';
  if (['DROPPED', 'BAJA', 'CANCELED', 'CANCELLED', 'CANCELADO'].includes(value)) return 'DROPPED';
  if (['ALTA', 'ACTIVE'].includes(value)) return 'ACTIVE';
  return 'ACTIVE';
}

/**
 * @param {string} raw - Leave-reason cell.
 * @returns {MappedLeaveReason | null} Enum member when recognized.
 */
function parseLeaveReason(raw: string): MappedLeaveReason | null {
  const value = raw.trim().toUpperCase().replace(/\s+/g, '_');
  if (!value || value === '-') return null;
  if (['ECONOMIC', 'ECONOMICO', 'ECONÓMICO', 'PROBLEMAS_ECONÓMICOS', 'PROBLEMAS_ECONOMICOS'].includes(value)) {
    return 'ECONOMIC';
  }
  if (['TIME_CONFLICT', 'HORARIO', 'CAMBIO_HORARIO'].includes(value)) return 'TIME_CONFLICT';
  if (['INJURY', 'LESION', 'LESIÓN', 'MOTIVOS_MÉDICOS', 'MOTIVOS_MEDICOS', 'LESIÓN_CON_RECUPERACIÓN', 'LESION_CON_RECUPERACION'].includes(value)) {
    return 'INJURY';
  }
  if (['MOVED', 'TRASLADO', 'CAMBIO_DE_DOMICILIO'].includes(value)) return 'MOVED';
  if (
    [
      'DISSATISFIED',
      'INSATISFECHO',
      'DESCONTENTO_CON_EL_CENTRO',
      'DESINTERES_POR_LA_ACTIVIDAD',
      'PROBLEMAS_CON_PROFESORADO',
    ].includes(value)
  ) {
    return 'DISSATISFIED';
  }
  if (['OTHER', 'OTRO'].includes(value)) return 'OTHER';
  return 'OTHER';
}
