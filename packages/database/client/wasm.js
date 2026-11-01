
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.22.0
 * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
 */
Prisma.prismaVersion = {
  client: "5.22.0",
  engine: "605197351a3c8bdd595af2d2a9bc3025bca48ea2"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  email: 'email',
  passwordHash: 'passwordHash',
  firstName: 'firstName',
  lastName: 'lastName',
  gender: 'gender',
  isActive: 'isActive',
  roles: 'roles',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.StudentProfileScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  firstName: 'firstName',
  lastName: 'lastName',
  dni: 'dni',
  birthDate: 'birthDate',
  phone: 'phone',
  address: 'address',
  city: 'city',
  state: 'state',
  postalCode: 'postalCode',
  country: 'country',
  gender: 'gender',
  bankMandateId: 'bankMandateId',
  status: 'status',
  emergencyContacts: 'emergencyContacts',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.StudentStatusHistoryScalarFieldEnum = {
  id: 'id',
  studentProfileId: 'studentProfileId',
  previousStatus: 'previousStatus',
  newStatus: 'newStatus',
  reason: 'reason',
  leaveReason: 'leaveReason',
  leaveNoticeMethod: 'leaveNoticeMethod',
  customReasonDetails: 'customReasonDetails',
  changedById: 'changedById',
  createdAt: 'createdAt'
};

exports.Prisma.GuardianScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  createdAt: 'createdAt'
};

exports.Prisma.StudentGuardianScalarFieldEnum = {
  studentProfileId: 'studentProfileId',
  guardianId: 'guardianId',
  relationship: 'relationship'
};

exports.Prisma.DisciplineScalarFieldEnum = {
  id: 'id',
  name: 'name',
  acronym: 'acronym',
  description: 'description'
};

exports.Prisma.DisciplineProgramScalarFieldEnum = {
  id: 'id',
  disciplineId: 'disciplineId',
  name: 'name',
  minAge: 'minAge',
  maxAge: 'maxAge'
};

exports.Prisma.BeltRankScalarFieldEnum = {
  id: 'id',
  disciplineProgramId: 'disciplineProgramId',
  name: 'name',
  order: 'order',
  maxStripes: 'maxStripes',
  minMonthsRequired: 'minMonthsRequired',
  minHoursRequired: 'minHoursRequired'
};

exports.Prisma.StudentRankScalarFieldEnum = {
  id: 'id',
  studentProfileId: 'studentProfileId',
  beltRankId: 'beltRankId',
  currentStripes: 'currentStripes',
  accumulatedHours: 'accumulatedHours',
  promotedAt: 'promotedAt',
  lastStripeAt: 'lastStripeAt'
};

exports.Prisma.AttendanceScalarFieldEnum = {
  id: 'id',
  studentProfileId: 'studentProfileId',
  date: 'date',
  countedForRank: 'countedForRank'
};

exports.Prisma.ProfileUpdateRequestScalarFieldEnum = {
  id: 'id',
  studentProfileId: 'studentProfileId',
  requestedChanges: 'requestedChanges',
  status: 'status',
  reviewedById: 'reviewedById',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.GraduationRequestScalarFieldEnum = {
  id: 'id',
  studentProfileId: 'studentProfileId',
  proposedBeltId: 'proposedBeltId',
  proposedStripes: 'proposedStripes',
  proposedById: 'proposedById',
  approvedById: 'approvedById',
  status: 'status',
  createdAt: 'createdAt'
};

exports.Prisma.FeeTierScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description',
  baseAmount: 'baseAmount',
  criteria: 'criteria',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.StudentFeeScalarFieldEnum = {
  id: 'id',
  studentProfileId: 'studentProfileId',
  feeTierId: 'feeTierId',
  customAmount: 'customAmount',
  ipcApplied: 'ipcApplied',
  effectiveFrom: 'effectiveFrom',
  effectiveTo: 'effectiveTo',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.StudentChargeScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  studentProfileId: 'studentProfileId',
  payerUserId: 'payerUserId',
  amount: 'amount',
  concept: 'concept',
  seasonName: 'seasonName',
  dueDate: 'dueDate',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.DiscountScalarFieldEnum = {
  id: 'id',
  code: 'code',
  name: 'name',
  description: 'description',
  type: 'type',
  category: 'category',
  value: 'value',
  startDate: 'startDate',
  endDate: 'endDate',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.StudentDiscountScalarFieldEnum = {
  id: 'id',
  studentProfileId: 'studentProfileId',
  discountId: 'discountId',
  assignedAt: 'assignedAt',
  expiresAt: 'expiresAt'
};

exports.Prisma.StudentSubscriptionScalarFieldEnum = {
  id: 'id',
  studentProfileId: 'studentProfileId',
  feeTierId: 'feeTierId',
  isActive: 'isActive'
};

exports.Prisma.CashRegisterSessionScalarFieldEnum = {
  id: 'id',
  openedById: 'openedById',
  closedById: 'closedById',
  openingDate: 'openingDate',
  closingDate: 'closingDate',
  initialBalance: 'initialBalance',
  expectedClosingBalance: 'expectedClosingBalance',
  actualClosingBalance: 'actualClosingBalance',
  discrepancy: 'discrepancy',
  status: 'status',
  notes: 'notes',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CashTransactionScalarFieldEnum = {
  id: 'id',
  sessionId: 'sessionId',
  studentProfileId: 'studentProfileId',
  type: 'type',
  category: 'category',
  paymentMethod: 'paymentMethod',
  amount: 'amount',
  description: 'description',
  recordedById: 'recordedById',
  createdAt: 'createdAt'
};

exports.Prisma.TenantFinancialConfigScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  legalName: 'legalName',
  taxId: 'taxId',
  address: 'address',
  city: 'city',
  postalCode: 'postalCode',
  country: 'country',
  creditorId: 'creditorId',
  iban: 'iban',
  bic: 'bic',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.BankMandateScalarFieldEnum = {
  id: 'id',
  payerUserId: 'payerUserId',
  iban: 'iban',
  bic: 'bic',
  mandateReference: 'mandateReference',
  signatureDate: 'signatureDate',
  accountHolderName: 'accountHolderName',
  accountHolderDni: 'accountHolderDni',
  tenantId: 'tenantId',
  isSigned: 'isSigned',
  signedAt: 'signedAt',
  signedByUserId: 'signedByUserId',
  signatureIp: 'signatureIp',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.RemittanceBatchScalarFieldEnum = {
  id: 'id',
  batchReference: 'batchReference',
  executionDate: 'executionDate',
  totalAmount: 'totalAmount',
  totalItems: 'totalItems',
  status: 'status',
  generatedById: 'generatedById',
  filePath: 'filePath',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.RemittanceItemScalarFieldEnum = {
  id: 'id',
  batchId: 'batchId',
  mandateId: 'mandateId',
  amount: 'amount',
  status: 'status',
  returnReason: 'returnReason',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.FederationScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  name: 'name',
  acronym: 'acronym',
  country: 'country',
  email: 'email',
  isActive: 'isActive',
  deletedAt: 'deletedAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.FederationContactScalarFieldEnum = {
  id: 'id',
  federationId: 'federationId',
  medium: 'medium',
  value: 'value',
  tag: 'tag',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.FederationSeasonScalarFieldEnum = {
  id: 'id',
  federationId: 'federationId',
  seasonName: 'seasonName',
  currency: 'currency',
  clubCost: 'clubCost',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.FederationLicenseTypeScalarFieldEnum = {
  id: 'id',
  seasonId: 'seasonId',
  name: 'name',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.FederationLicensePriceRowScalarFieldEnum = {
  id: 'id',
  licenseTypeId: 'licenseTypeId',
  kind: 'kind',
  label: 'label',
  birthYearFrom: 'birthYearFrom',
  cost: 'cost',
  reduction: 'reduction',
  chargePrice: 'chargePrice',
  sortOrder: 'sortOrder',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.FederationSeasonChargeScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  federationId: 'federationId',
  season: 'season',
  holderType: 'holderType',
  holderUserId: 'holderUserId',
  studentProfileId: 'studentProfileId',
  licenseId: 'licenseId',
  costAmount: 'costAmount',
  saleAmount: 'saleAmount',
  isPaid: 'isPaid',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.AffiliationLicenseScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  studentProfileId: 'studentProfileId',
  holderUserId: 'holderUserId',
  holderType: 'holderType',
  federationId: 'federationId',
  licenseTypeId: 'licenseTypeId',
  licenseNumber: 'licenseNumber',
  season: 'season',
  validUntil: 'validUntil',
  isActive: 'isActive',
  isPaid: 'isPaid',
  amountCharged: 'amountCharged',
  status: 'status',
  payerUserId: 'payerUserId',
  isExempt: 'isExempt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullableJsonNullValueInput = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull
};

exports.Prisma.JsonNullValueInput = {
  JsonNull: Prisma.JsonNull
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};
exports.Gender = exports.$Enums.Gender = {
  MALE: 'MALE',
  FEMALE: 'FEMALE',
  NON_BINARY: 'NON_BINARY',
  OTHER: 'OTHER'
};

exports.Role = exports.$Enums.Role = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN_STAFF: 'ADMIN_STAFF',
  SPORTS_TECHNICAL_DIRECTOR: 'SPORTS_TECHNICAL_DIRECTOR',
  INSTRUCTOR: 'INSTRUCTOR',
  STUDENT: 'STUDENT',
  PARENT: 'PARENT',
  TRIAL: 'TRIAL'
};

exports.StudentStatus = exports.$Enums.StudentStatus = {
  TRIAL: 'TRIAL',
  ACTIVE: 'ACTIVE',
  PAUSED: 'PAUSED',
  DROPPED: 'DROPPED'
};

exports.LeaveReason = exports.$Enums.LeaveReason = {
  ECONOMIC: 'ECONOMIC',
  TIME_CONFLICT: 'TIME_CONFLICT',
  INJURY: 'INJURY',
  MOVED: 'MOVED',
  DISSATISFIED: 'DISSATISFIED',
  OTHER: 'OTHER'
};

exports.LeaveNoticeMethod = exports.$Enums.LeaveNoticeMethod = {
  PHONE: 'PHONE',
  WHATSAPP: 'WHATSAPP',
  IN_PERSON: 'IN_PERSON',
  RECEPTION: 'RECEPTION',
  OTHER: 'OTHER'
};

exports.RequestStatus = exports.$Enums.RequestStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED'
};

exports.DiscountType = exports.$Enums.DiscountType = {
  PERCENTAGE: 'PERCENTAGE',
  FIXED_DISCOUNT: 'FIXED_DISCOUNT',
  FREE_PERIOD: 'FREE_PERIOD'
};

exports.DiscountCategory = exports.$Enums.DiscountCategory = {
  FAMILY: 'FAMILY',
  SECURITY_FORCES: 'SECURITY_FORCES',
  TEMPORARY: 'TEMPORARY'
};

exports.CashSessionStatus = exports.$Enums.CashSessionStatus = {
  OPEN: 'OPEN',
  CLOSED: 'CLOSED',
  RECONCILED: 'RECONCILED'
};

exports.CashMovementType = exports.$Enums.CashMovementType = {
  INCOME: 'INCOME',
  EXPENSE: 'EXPENSE'
};

exports.CashCategory = exports.$Enums.CashCategory = {
  MEMBERSHIP_PAYMENT: 'MEMBERSHIP_PAYMENT',
  EXAM_FEE: 'EXAM_FEE',
  MERCHANDISE_SALE: 'MERCHANDISE_SALE',
  OTHER_INCOME: 'OTHER_INCOME',
  OPERATIONAL_EXPENSE: 'OPERATIONAL_EXPENSE'
};

exports.PaymentMethod = exports.$Enums.PaymentMethod = {
  CASH: 'CASH',
  CARD: 'CARD',
  BANK_TRANSFER: 'BANK_TRANSFER'
};

exports.RemittanceStatus = exports.$Enums.RemittanceStatus = {
  DRAFT: 'DRAFT',
  GENERATED: 'GENERATED',
  SUBMITTED: 'SUBMITTED',
  SETTLED: 'SETTLED',
  REJECTED: 'REJECTED'
};

exports.RemittanceItemStatus = exports.$Enums.RemittanceItemStatus = {
  PENDING: 'PENDING',
  SETTLED: 'SETTLED',
  RETURNED: 'RETURNED'
};

exports.FederationContactMedium = exports.$Enums.FederationContactMedium = {
  EMAIL: 'EMAIL',
  PHONE: 'PHONE',
  ADDRESS: 'ADDRESS'
};

exports.LicensePriceRowKind = exports.$Enums.LicensePriceRowKind = {
  INSTRUCTOR: 'INSTRUCTOR',
  ADULT: 'ADULT',
  CUSTOM: 'CUSTOM'
};

exports.LicenseHolderType = exports.$Enums.LicenseHolderType = {
  STUDENT: 'STUDENT',
  INSTRUCTOR: 'INSTRUCTOR',
  TECHNICAL_DIRECTOR: 'TECHNICAL_DIRECTOR',
  CLUB: 'CLUB'
};

exports.AffiliationLicenseStatus = exports.$Enums.AffiliationLicenseStatus = {
  PENDING: 'PENDING',
  PAID: 'PAID',
  EXEMPT: 'EXEMPT',
  FAILED: 'FAILED'
};

exports.Prisma.ModelName = {
  User: 'User',
  StudentProfile: 'StudentProfile',
  StudentStatusHistory: 'StudentStatusHistory',
  Guardian: 'Guardian',
  StudentGuardian: 'StudentGuardian',
  Discipline: 'Discipline',
  DisciplineProgram: 'DisciplineProgram',
  BeltRank: 'BeltRank',
  StudentRank: 'StudentRank',
  Attendance: 'Attendance',
  ProfileUpdateRequest: 'ProfileUpdateRequest',
  GraduationRequest: 'GraduationRequest',
  FeeTier: 'FeeTier',
  StudentFee: 'StudentFee',
  StudentCharge: 'StudentCharge',
  Discount: 'Discount',
  StudentDiscount: 'StudentDiscount',
  StudentSubscription: 'StudentSubscription',
  CashRegisterSession: 'CashRegisterSession',
  CashTransaction: 'CashTransaction',
  TenantFinancialConfig: 'TenantFinancialConfig',
  BankMandate: 'BankMandate',
  RemittanceBatch: 'RemittanceBatch',
  RemittanceItem: 'RemittanceItem',
  Federation: 'Federation',
  FederationContact: 'FederationContact',
  FederationSeason: 'FederationSeason',
  FederationLicenseType: 'FederationLicenseType',
  FederationLicensePriceRow: 'FederationLicensePriceRow',
  FederationSeasonCharge: 'FederationSeasonCharge',
  AffiliationLicense: 'AffiliationLicense'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
