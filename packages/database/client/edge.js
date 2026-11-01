
Object.defineProperty(exports, "__esModule", { value: true });

const {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientRustPanicError,
  PrismaClientInitializationError,
  PrismaClientValidationError,
  NotFoundError,
  getPrismaClient,
  sqltag,
  empty,
  join,
  raw,
  skip,
  Decimal,
  Debug,
  objectEnumValues,
  makeStrictEnum,
  Extensions,
  warnOnce,
  defineDmmfProperty,
  Public,
  getRuntime
} = require('./runtime/edge.js')


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

Prisma.PrismaClientKnownRequestError = PrismaClientKnownRequestError;
Prisma.PrismaClientUnknownRequestError = PrismaClientUnknownRequestError
Prisma.PrismaClientRustPanicError = PrismaClientRustPanicError
Prisma.PrismaClientInitializationError = PrismaClientInitializationError
Prisma.PrismaClientValidationError = PrismaClientValidationError
Prisma.NotFoundError = NotFoundError
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = sqltag
Prisma.empty = empty
Prisma.join = join
Prisma.raw = raw
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = Extensions.getExtensionContext
Prisma.defineExtension = Extensions.defineExtension

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
 * Create the Client
 */
const config = {
  "generator": {
    "name": "client",
    "provider": {
      "fromEnvVar": null,
      "value": "prisma-client-js"
    },
    "output": {
      "value": "/home/ahornos/projects/personales/dojo-management-suite/packages/database/client",
      "fromEnvVar": null
    },
    "config": {
      "engineType": "library"
    },
    "binaryTargets": [
      {
        "fromEnvVar": null,
        "value": "debian-openssl-3.0.x",
        "native": true
      },
      {
        "fromEnvVar": null,
        "value": "linux-musl"
      },
      {
        "fromEnvVar": null,
        "value": "linux-musl-openssl-3.0.x"
      }
    ],
    "previewFeatures": [],
    "sourceFilePath": "/home/ahornos/projects/personales/dojo-management-suite/packages/database/prisma/schema.prisma",
    "isCustomOutput": true
  },
  "relativeEnvPaths": {
    "rootEnvPath": null
  },
  "relativePath": "../prisma",
  "clientVersion": "5.22.0",
  "engineVersion": "605197351a3c8bdd595af2d2a9bc3025bca48ea2",
  "datasourceNames": [
    "db"
  ],
  "activeProvider": "postgresql",
  "postinstall": false,
  "inlineDatasources": {
    "db": {
      "url": {
        "fromEnvVar": "DATABASE_URL",
        "value": null
      }
    }
  },
  "inlineSchema": "/// ---------------------------------------------------------\n/// Prisma Client Generator & Datasource\n/// ---------------------------------------------------------\ngenerator client {\n  provider      = \"prisma-client-js\"\n  output        = \"../client\"\n  binaryTargets = [\"native\", \"linux-musl\", \"linux-musl-openssl-3.0.x\"]\n}\n\ndatasource db {\n  provider = \"postgresql\"\n  url      = env(\"DATABASE_URL\")\n}\n\n/// ---------------------------------------------------------\n/// Enums\n/// ---------------------------------------------------------\nenum Role {\n  SUPER_ADMIN\n  ADMIN_STAFF\n  SPORTS_TECHNICAL_DIRECTOR\n  INSTRUCTOR\n  STUDENT\n  PARENT\n  TRIAL\n}\n\nenum RequestStatus {\n  PENDING\n  APPROVED\n  REJECTED\n}\n\n/// Lifecycle status of a student within the academy\nenum StudentStatus {\n  TRIAL\n  ACTIVE\n  PAUSED\n  DROPPED\n}\n\nenum DiscountType {\n  PERCENTAGE\n  FIXED_DISCOUNT\n  FREE_PERIOD\n}\n\nenum DiscountCategory {\n  FAMILY\n  SECURITY_FORCES\n  TEMPORARY\n}\n\nenum CashSessionStatus {\n  OPEN\n  CLOSED\n  RECONCILED\n}\n\nenum CashMovementType {\n  INCOME\n  EXPENSE\n}\n\nenum CashCategory {\n  MEMBERSHIP_PAYMENT\n  EXAM_FEE\n  MERCHANDISE_SALE\n  OTHER_INCOME\n  OPERATIONAL_EXPENSE\n}\n\nenum PaymentMethod {\n  CASH\n  CARD\n  BANK_TRANSFER\n}\n\nenum RemittanceStatus {\n  DRAFT\n  GENERATED\n  SUBMITTED\n  SETTLED\n  REJECTED\n}\n\nenum RemittanceItemStatus {\n  PENDING\n  SETTLED\n  RETURNED\n}\n\n/// Competition / statistics identity. Optional so legacy Excel rows can be imported without it.\nenum Gender {\n  MALE\n  FEMALE\n  NON_BINARY\n  OTHER\n}\n\n/// Structured cause when a student is PAUSED or DROPPED (Excel leave-reason columns).\nenum LeaveReason {\n  ECONOMIC\n  TIME_CONFLICT\n  INJURY\n  MOVED\n  DISSATISFIED\n  OTHER\n}\n\n/// Channel through which staff learned of a pause or drop.\nenum LeaveNoticeMethod {\n  PHONE\n  WHATSAPP\n  IN_PERSON\n  RECEPTION\n  OTHER\n}\n\n/// Who a federation affiliation license (or seasonal charge) belongs to.\nenum LicenseHolderType {\n  STUDENT\n  INSTRUCTOR\n  TECHNICAL_DIRECTOR\n  /// Club-level federation fee (one charge per academy per season, not a person).\n  CLUB\n}\n\n/// Collection state of an affiliation license (academic-service).\nenum AffiliationLicenseStatus {\n  PENDING\n  PAID\n  EXEMPT\n  FAILED\n}\n\n/// Contact medium for a tagged federation contact (financial-service).\nenum FederationContactMedium {\n  EMAIL\n  PHONE\n  ADDRESS\n}\n\n/// One row in a season license-type pricing matrix.\nenum LicensePriceRowKind {\n  INSTRUCTOR\n  ADULT\n  CUSTOM\n}\n\n/// ---------------------------------------------------------\n/// Core Identity & Users\n/// ---------------------------------------------------------\n/// Login identity owned by auth-service. Demographics (dni, birthDate, phone, address)\n/// live exclusively on StudentProfile — never on User.\nmodel User {\n  id           String   @id @default(uuid())\n  email        String   @unique\n  passwordHash String\n  firstName    String\n  lastName     String\n  /// Optional; used for competition categories and academy stats. Null on historical imports.\n  gender       Gender?\n  isActive     Boolean  @default(true)\n  roles        Role[]   @default([STUDENT])\n  createdAt    DateTime @default(now())\n  updatedAt    DateTime @updatedAt\n\n  @@map(\"users\")\n}\n\nmodel StudentProfile {\n  id     String  @id @default(uuid())\n  /// Login identity in auth-service. Null for minors (they have no User; parents link via StudentGuardian).\n  userId String? @unique\n\n  /// Academic identity of the person-as-student. Adults may also have a User; minors only have these fields.\n  firstName  String    @default(\"\")\n  lastName   String    @default(\"\")\n  dni        String?\n  birthDate  DateTime?\n  phone      String?\n  address    String?\n  city       String?\n  state      String?\n  postalCode String?\n  country    String?   @default(\"ES\")\n  gender     Gender?\n\n  /// Logical financial-service mandate that covers this student's fees (no physical FK).\n  bankMandateId String?\n\n  /// Student Lifecycle Management\n  status StudentStatus @default(ACTIVE)\n\n  /// Array of lightweight JSON objects: { name, phone, relationship, customRelationship }\n  emergencyContacts Json? @default(\"[]\")\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  statusHistory      StudentStatusHistory[]\n  guardians          StudentGuardian[]\n  ranks              StudentRank[]\n  attendances        Attendance[]\n  updateRequests     ProfileUpdateRequest[]\n  graduationRequests GraduationRequest[]\n\n  @@index([bankMandateId])\n  @@map(\"student_profiles\")\n}\n\n/// ---------------------------------------------------------\n/// Student Lifecycle Audit Log\n/// ---------------------------------------------------------\nmodel StudentStatusHistory {\n  id                  String             @id @default(uuid())\n  studentProfileId    String\n  previousStatus      StudentStatus?\n  newStatus           StudentStatus\n  /// Legacy free-text note. Prefer `leaveReason` / `customReasonDetails` for PAUSED and DROPPED.\n  reason              String?            @db.Text\n  leaveReason         LeaveReason?\n  leaveNoticeMethod   LeaveNoticeMethod?\n  /// Free-text complement when `leaveReason` is OTHER (or extra context for any reason).\n  customReasonDetails String?            @db.Text\n  /// Logical reference to the actor in auth-service (no physical FK).\n  changedById         String?\n  createdAt           DateTime           @default(now())\n\n  studentProfile StudentProfile @relation(fields: [studentProfileId], references: [id], onDelete: Cascade)\n\n  @@map(\"student_status_history\")\n}\n\nmodel Guardian {\n  id        String   @id @default(uuid())\n  /// Logical reference to the identity owned by auth-service (no physical FK; resolve over HTTP)\n  userId    String   @unique\n  createdAt DateTime @default(now())\n\n  students StudentGuardian[]\n\n  @@map(\"guardians\")\n}\n\nmodel StudentGuardian {\n  studentProfileId String\n  guardianId       String\n  relationship     String?\n\n  student  StudentProfile @relation(fields: [studentProfileId], references: [id], onDelete: Cascade)\n  guardian Guardian       @relation(fields: [guardianId], references: [id], onDelete: Cascade)\n\n  @@id([studentProfileId, guardianId])\n  @@map(\"student_guardians\")\n}\n\n/// ---------------------------------------------------------\n/// Academy Configuration (Disciplines & Ranks)\n/// ---------------------------------------------------------\nmodel Discipline {\n  id          String  @id @default(uuid())\n  name        String  @unique\n  /// Short staff-facing label shown in dense tables (e.g. BJJ). Null falls back to `name`.\n  acronym     String?\n  description String?\n\n  programs DisciplineProgram[]\n\n  @@map(\"disciplines\")\n}\n\nmodel DisciplineProgram {\n  id           String @id @default(uuid())\n  disciplineId String\n  name         String\n  minAge       Int    @default(0)\n  maxAge       Int    @default(99)\n\n  discipline Discipline @relation(fields: [disciplineId], references: [id], onDelete: Cascade)\n  beltRanks  BeltRank[]\n\n  @@map(\"discipline_programs\")\n}\n\nmodel BeltRank {\n  id                  String @id @default(uuid())\n  disciplineProgramId String\n  name                String\n  order               Int\n  maxStripes          Int    @default(4)\n  minMonthsRequired   Int    @default(0)\n  minHoursRequired    Int    @default(0)\n\n  program      DisciplineProgram @relation(fields: [disciplineProgramId], references: [id], onDelete: Cascade)\n  studentRanks StudentRank[]\n\n  @@map(\"belt_ranks\")\n}\n\n/// ---------------------------------------------------------\n/// Academic Records (Ranks & Attendances)\n/// ---------------------------------------------------------\nmodel StudentRank {\n  id               String   @id @default(uuid())\n  studentProfileId String\n  beltRankId       String\n  currentStripes   Int      @default(0)\n  accumulatedHours Int      @default(0)\n  promotedAt       DateTime @default(now())\n  lastStripeAt     DateTime @default(now())\n\n  student  StudentProfile @relation(fields: [studentProfileId], references: [id], onDelete: Cascade)\n  beltRank BeltRank       @relation(fields: [beltRankId], references: [id])\n\n  @@map(\"student_ranks\")\n}\n\nmodel Attendance {\n  id               String   @id @default(uuid())\n  studentProfileId String\n  date             DateTime @default(now())\n  countedForRank   Boolean  @default(true)\n\n  student StudentProfile @relation(fields: [studentProfileId], references: [id], onDelete: Cascade)\n\n  @@map(\"attendances\")\n}\n\n/// ---------------------------------------------------------\n/// Approval Workflows (IAM & Validation)\n/// ---------------------------------------------------------\nmodel ProfileUpdateRequest {\n  id               String        @id @default(uuid())\n  studentProfileId String\n  requestedChanges Json\n  status           RequestStatus @default(PENDING)\n  /// Logical reference to the reviewer in auth-service (no physical FK).\n  reviewedById     String?\n  createdAt        DateTime      @default(now())\n  updatedAt        DateTime      @updatedAt\n\n  studentProfile StudentProfile @relation(fields: [studentProfileId], references: [id], onDelete: Cascade)\n\n  @@map(\"profile_update_requests\")\n}\n\nmodel GraduationRequest {\n  id               String        @id @default(uuid())\n  studentProfileId String\n  proposedBeltId   String?\n  proposedStripes  Int?\n  /// Logical references to identities in auth-service (no physical FK).\n  proposedById     String\n  approvedById     String?\n  status           RequestStatus @default(PENDING)\n  createdAt        DateTime      @default(now())\n\n  studentProfile StudentProfile @relation(fields: [studentProfileId], references: [id], onDelete: Cascade)\n\n  @@map(\"graduation_requests\")\n}\n\n/// ---------------------------------------------------------\n/// Billing, Subscriptions & Financial Engine\n/// ---------------------------------------------------------\nmodel FeeTier {\n  id          String   @id @default(uuid())\n  name        String   @unique\n  description String?\n  baseAmount  Decimal  @db.Decimal(10, 2)\n  criteria    Json?\n  isActive    Boolean  @default(true)\n  createdAt   DateTime @default(now())\n  updatedAt   DateTime @updatedAt\n\n  studentFees   StudentFee[]\n  subscriptions StudentSubscription[]\n\n  @@map(\"fee_tiers\")\n}\n\nmodel StudentFee {\n  id               String    @id @default(uuid())\n  /// Logical academic-service StudentProfile id (no physical FK across bounded contexts).\n  studentProfileId String\n  feeTierId        String?\n  customAmount     Decimal?  @db.Decimal(10, 2)\n  ipcApplied       Boolean   @default(false)\n  effectiveFrom    DateTime  @default(now())\n  effectiveTo      DateTime?\n  createdAt        DateTime  @default(now())\n  updatedAt        DateTime  @updatedAt\n\n  feeTier FeeTier? @relation(fields: [feeTierId], references: [id])\n\n  @@index([studentProfileId])\n  @@map(\"student_fees\")\n}\n\nmodel Discount {\n  id          String           @id @default(uuid())\n  code        String           @unique\n  name        String\n  description String?\n  type        DiscountType\n  category    DiscountCategory\n  value       Decimal?         @db.Decimal(10, 2)\n  startDate   DateTime?\n  endDate     DateTime?\n  isActive    Boolean          @default(true)\n  createdAt   DateTime         @default(now())\n  updatedAt   DateTime         @updatedAt\n\n  studentDiscounts StudentDiscount[]\n\n  @@map(\"discounts\")\n}\n\nmodel StudentDiscount {\n  id               String    @id @default(uuid())\n  /// Logical academic-service StudentProfile id (no physical FK across bounded contexts).\n  studentProfileId String\n  discountId       String\n  assignedAt       DateTime  @default(now())\n  expiresAt        DateTime?\n\n  discount Discount @relation(fields: [discountId], references: [id], onDelete: Cascade)\n\n  @@unique([studentProfileId, discountId])\n  @@index([studentProfileId])\n  @@map(\"student_discounts\")\n}\n\nmodel StudentSubscription {\n  id               String  @id @default(uuid())\n  /// Logical academic-service StudentProfile id (no physical FK across bounded contexts).\n  studentProfileId String\n  feeTierId        String\n  isActive         Boolean @default(true)\n\n  feeTier FeeTier @relation(fields: [feeTierId], references: [id])\n\n  @@index([studentProfileId])\n  @@map(\"student_subscriptions\")\n}\n\n/// ---------------------------------------------------------\n/// Daily Cash Register Submodule\n/// ---------------------------------------------------------\nmodel CashRegisterSession {\n  id                     String            @id @default(uuid())\n  openedById             String\n  closedById             String?\n  openingDate            DateTime          @default(now())\n  closingDate            DateTime?\n  initialBalance         Decimal           @db.Decimal(10, 2)\n  expectedClosingBalance Decimal?          @db.Decimal(10, 2)\n  actualClosingBalance   Decimal?          @db.Decimal(10, 2)\n  discrepancy            Decimal?          @db.Decimal(10, 2)\n  status                 CashSessionStatus @default(OPEN)\n  notes                  String?\n  createdAt              DateTime          @default(now())\n  updatedAt              DateTime          @updatedAt\n\n  transactions CashTransaction[]\n\n  @@map(\"cash_register_sessions\")\n}\n\nmodel CashTransaction {\n  id               String           @id @default(uuid())\n  sessionId        String\n  studentProfileId String?\n  type             CashMovementType\n  category         CashCategory\n  paymentMethod    PaymentMethod\n  amount           Decimal          @db.Decimal(10, 2)\n  description      String\n  recordedById     String\n  createdAt        DateTime         @default(now())\n\n  session CashRegisterSession @relation(fields: [sessionId], references: [id], onDelete: Cascade)\n\n  @@index([sessionId])\n  @@index([studentProfileId])\n  @@map(\"cash_transactions\")\n}\n\n/// ---------------------------------------------------------\n/// Tenant Financial Configuration (SEPA creditor / invoicing)\n/// Owned exclusively by financial-service. `tenantId` is the logical academy\n/// key from `x-school-id` (no physical Tenant table / cross-service FK).\n/// Empty-string defaults let GET create a blank row until staff complete it.\n/// ---------------------------------------------------------\nmodel TenantFinancialConfig {\n  id         String   @id @default(uuid())\n  tenantId   String   @unique\n  legalName  String   @default(\"\")\n  taxId      String   @default(\"\")\n  address    String   @default(\"\")\n  city       String   @default(\"\")\n  postalCode String   @default(\"\")\n  country    String   @default(\"ES\")\n  /// SEPA Creditor Identifier (e.g. ES12ZZZ1234567) used in pain.008.\n  creditorId String   @default(\"\")\n  iban       String   @default(\"\")\n  bic        String?\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@map(\"tenant_financial_configs\")\n}\n\n/// ---------------------------------------------------------\n/// Bank Remittance Submodule (SEPA / Caixabank Integration)\n/// ---------------------------------------------------------\nmodel BankMandate {\n  id                String    @id @default(uuid())\n  /// Logical auth-service user id of the payer who owns the IBAN (parent or adult student). Not a User FK.\n  payerUserId       String\n  iban              String\n  bic               String?\n  mandateReference  String    @unique\n  signatureDate     DateTime\n  /// Legal name of the bank-account holder (SEPA debtor).\n  accountHolderName String\n  /// National ID (DNI/NIF/NIE) of the account holder. Required by Spanish banks (e.g. CaixaBank) on SEPA Direct Debit.\n  accountHolderDni  String\n  /// Academy key from `x-school-id`. Logical tenant isolation (no Tenant table FK).\n  tenantId          String    @default(\"\")\n  /// Clickwrap acceptance. `signatureDate` is the SEPA mandate date; `signedAt` is the audit timestamp.\n  isSigned          Boolean   @default(false)\n  signedAt          DateTime?\n  /// Logical auth-service user id of the person who ticked accept (no User @relation).\n  signedByUserId    String?\n  signatureIp       String?\n  isActive          Boolean   @default(true)\n  createdAt         DateTime  @default(now())\n  updatedAt         DateTime  @updatedAt\n\n  remittanceItems RemittanceItem[]\n\n  @@index([tenantId, payerUserId])\n  @@map(\"bank_mandates\")\n}\n\nmodel RemittanceBatch {\n  id             String           @id @default(uuid())\n  batchReference String           @unique\n  executionDate  DateTime\n  totalAmount    Decimal          @db.Decimal(10, 2)\n  totalItems     Int\n  status         RemittanceStatus @default(DRAFT)\n  generatedById  String\n  filePath       String?\n  createdAt      DateTime         @default(now())\n  updatedAt      DateTime         @updatedAt\n\n  items RemittanceItem[]\n\n  @@map(\"remittance_batches\")\n}\n\nmodel RemittanceItem {\n  id           String               @id @default(uuid())\n  batchId      String\n  mandateId    String\n  amount       Decimal              @db.Decimal(10, 2)\n  status       RemittanceItemStatus @default(PENDING)\n  returnReason String?\n  createdAt    DateTime             @default(now())\n  updatedAt    DateTime             @updatedAt\n\n  batch   RemittanceBatch @relation(fields: [batchId], references: [id], onDelete: Cascade)\n  mandate BankMandate     @relation(fields: [mandateId], references: [id])\n\n  @@map(\"remittance_items\")\n}\n\n/// ---------------------------------------------------------\n/// Federations (financial-service) & Affiliation Licenses (academic-service)\n/// `federationId` on licenses/charges is a logical id — no cross-service FK.\n/// `holderUserId` is a logical auth-service identity (no User @relation).\n/// ---------------------------------------------------------\nmodel Federation {\n  id        String    @id @default(uuid())\n  /// Academy key from `x-school-id`. Catalogs are tenant-scoped (no global sharing).\n  tenantId  String\n  name      String\n  acronym   String    @default(\"\")\n  /// ISO 3166-1 alpha-2 (e.g. \"ES\").\n  country   String    @default(\"ES\")\n  /// Official federation contact email (mandatory).\n  email     String\n  isActive  Boolean   @default(true)\n  /// Soft-delete timestamp. Live uniqueness of `(tenantId, name)` is a partial SQL index (`deletedAt IS NULL`).\n  deletedAt DateTime?\n  createdAt DateTime  @default(now())\n  updatedAt DateTime  @updatedAt\n\n  charges  FederationSeasonCharge[]\n  contacts FederationContact[]\n  seasons  FederationSeason[]\n\n  @@index([tenantId])\n  @@index([tenantId, deletedAt])\n  @@index([tenantId, name])\n  @@map(\"federations\")\n}\n\n/// Tagged multi-value contact for a federation (several phones/emails/addresses).\nmodel FederationContact {\n  id           String                  @id @default(uuid())\n  federationId String\n  medium       FederationContactMedium\n  value        String\n  /// Staff label, e.g. \"Sede nacional\", \"Presidencia\", \"Secretaria\".\n  tag          String                  @default(\"\")\n  createdAt    DateTime                @default(now())\n  updatedAt    DateTime                @updatedAt\n\n  federation Federation @relation(fields: [federationId], references: [id], onDelete: Cascade)\n\n  @@index([federationId, medium])\n  @@map(\"federation_contacts\")\n}\n\n/// One pricing season for a federation (identity stays on `Federation`).\nmodel FederationSeason {\n  id           String   @id @default(uuid())\n  federationId String\n  /// Display label, e.g. \"2026\" or \"26/27\".\n  seasonName   String\n  /// ISO 4217, e.g. \"EUR\".\n  currency     String   @default(\"EUR\")\n  clubCost     Decimal  @default(0) @db.Decimal(10, 2)\n  isActive     Boolean  @default(true)\n  createdAt    DateTime @default(now())\n  updatedAt    DateTime @updatedAt\n\n  federation   Federation              @relation(fields: [federationId], references: [id], onDelete: Cascade)\n  licenseTypes FederationLicenseType[]\n\n  @@unique([federationId, seasonName])\n  @@index([federationId])\n  @@map(\"federation_seasons\")\n}\n\n/// One license product offered in a federation season (insurance variant, etc.).\nmodel FederationLicenseType {\n  id        String   @id @default(uuid())\n  seasonId  String\n  name      String\n  isActive  Boolean  @default(true)\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  season    FederationSeason            @relation(fields: [seasonId], references: [id], onDelete: Cascade)\n  priceRows FederationLicensePriceRow[]\n\n  @@unique([seasonId, name])\n  @@index([seasonId])\n  @@map(\"federation_license_types\")\n}\n\n/// One pricing-matrix row (instructor, adult, or custom birth-year band).\nmodel FederationLicensePriceRow {\n  id            String              @id @default(uuid())\n  licenseTypeId String\n  kind          LicensePriceRowKind\n  /// Editable label for CUSTOM rows (e.g. \"Infantil/Juvenil\").\n  label         String              @default(\"\")\n  /// Inclusive birth year: members born in this year or later use this row.\n  birthYearFrom Int?\n  cost          Decimal             @default(0) @db.Decimal(10, 2)\n  reduction     Decimal             @default(0) @db.Decimal(10, 2)\n  /// Face value charged to the member (`precio cobro`).\n  chargePrice   Decimal             @default(0) @db.Decimal(10, 2)\n  sortOrder     Int                 @default(0)\n  createdAt     DateTime            @default(now())\n  updatedAt     DateTime            @updatedAt\n\n  licenseType FederationLicenseType @relation(fields: [licenseTypeId], references: [id], onDelete: Cascade)\n\n  @@index([licenseTypeId, kind])\n  @@map(\"federation_license_price_rows\")\n}\n\n/// Seasonal charge row owned by financial-service (budget + future remittance source).\nmodel FederationSeasonCharge {\n  id               String            @id @default(uuid())\n  tenantId         String\n  federationId     String\n  season           String\n  holderType       LicenseHolderType\n  /// Logical auth-service user id. Null only for `CLUB` rows.\n  holderUserId     String?\n  /// Logical academic student profile id. Null for staff and club rows.\n  studentProfileId String?\n  /// Logical academic license id (issued in academic-service).\n  licenseId        String?\n  /// What the academy owes the federation for this holder.\n  costAmount       Decimal           @db.Decimal(10, 2)\n  /// What the academy charges the member (0 for club).\n  saleAmount       Decimal           @db.Decimal(10, 2)\n  isPaid           Boolean           @default(false)\n  createdAt        DateTime          @default(now())\n  updatedAt        DateTime          @updatedAt\n\n  federation Federation @relation(fields: [federationId], references: [id], onDelete: Cascade)\n\n  @@unique([tenantId, federationId, season, holderType, holderUserId])\n  @@index([tenantId, federationId, season])\n  @@map(\"federation_season_charges\")\n}\n\n/// Affiliation license history owned by academic-service.\nmodel AffiliationLicense {\n  id               String                   @id @default(uuid())\n  tenantId         String\n  /// Logical academic StudentProfile id. Required for STUDENT holders, including minors (no User).\n  studentProfileId String?\n  /// Logical auth-service identity. Null for minors who have no User.\n  holderUserId     String?\n  holderType       LicenseHolderType\n  /// Logical financial-service federation id (no Federation @relation).\n  federationId     String\n  /// Logical financial-service `FederationLicenseType` id (no cross-context @relation).\n  licenseTypeId    String?\n  licenseNumber    String\n  /// Season label, e.g. \"2026-2027\".\n  season           String\n  validUntil       DateTime\n  isActive         Boolean                  @default(true)\n  isPaid           Boolean                  @default(false)\n  amountCharged    Decimal                  @default(0) @db.Decimal(10, 2)\n  status           AffiliationLicenseStatus @default(PENDING)\n  /// Logical auth-service identity that funds this license (adult student or parent payer).\n  payerUserId      String?\n  /// Staff, instructors, or designated profiles issued at zero sale amount.\n  isExempt         Boolean                  @default(false)\n  createdAt        DateTime                 @default(now())\n  updatedAt        DateTime                 @updatedAt\n\n  /// Staff uniqueness (nullable holderUserId allows multiple minor rows).\n  @@unique([tenantId, federationId, holderUserId, season])\n  /// Student uniqueness, including minors without a User.\n  @@unique([tenantId, federationId, studentProfileId, season])\n  @@index([tenantId, validUntil, isActive])\n  @@index([tenantId, federationId, season])\n  @@index([studentProfileId])\n  @@index([payerUserId])\n  @@index([licenseTypeId])\n  @@map(\"student_licenses\")\n}\n\n/// ---------------------------------------------------------\n/// Equipment & Inventory (Future Service)\n/// ---------------------------------------------------------\n/// Merchandising, stock, Gi loans, and POS sales belong to a dedicated inventory\n/// bounded context — not academic-service and not extra JSON on `StudentProfile`.\n/// When that microservice is introduced, persist gear/loan/sale records there and\n/// resolve `studentProfileId` / `userId` over internal HTTP (no cross-service FKs).\n/// Do not add inventory tables to this schema until that service owns them.\n",
  "inlineSchemaHash": "8648a9ca8ac9d659e165b150b1dec06b496799751ea3466bcb95ca50945fc998",
  "copyEngine": true
}
config.dirname = '/'

config.runtimeDataModel = JSON.parse("{\"models\":{\"User\":{\"dbName\":\"users\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"email\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"passwordHash\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"firstName\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"lastName\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"gender\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Gender\",\"isGenerated\":false,\"isUpdatedAt\":false,\"documentation\":\"Optional; used for competition categories and academy stats. Null on historical imports.\"},{\"name\":\"isActive\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":true,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"roles\",\"kind\":\"enum\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Role\",\"default\":[\"STUDENT\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false,\"documentation\":\"---------------------------------------------------------\\\\nCore Identity & Users\\\\n---------------------------------------------------------\\\\nLogin identity owned by auth-service. Demographics (dni, birthDate, phone, address)\\\\nlive exclusively on StudentProfile — never on User.\"},\"StudentProfile\":{\"dbName\":\"student_profiles\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"userId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false,\"documentation\":\"Login identity in auth-service. Null for minors (they have no User; parents link via StudentGuardian).\"},{\"name\":\"firstName\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":\"\",\"isGenerated\":false,\"isUpdatedAt\":false,\"documentation\":\"Academic identity of the person-as-student. Adults may also have a User; minors only have these fields.\"},{\"name\":\"lastName\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":\"\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"dni\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"birthDate\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"phone\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"address\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"city\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"state\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"postalCode\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"country\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":\"ES\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"gender\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Gender\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"bankMandateId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false,\"documentation\":\"Logical financial-service mandate that covers this student's fees (no physical FK).\"},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"StudentStatus\",\"default\":\"ACTIVE\",\"isGenerated\":false,\"isUpdatedAt\":false,\"documentation\":\"Student Lifecycle Management\"},{\"name\":\"emergencyContacts\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Json\",\"default\":\"[]\",\"isGenerated\":false,\"isUpdatedAt\":false,\"documentation\":\"Array of lightweight JSON objects: { name, phone, relationship, customRelationship }\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"statusHistory\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"StudentStatusHistory\",\"relationName\":\"StudentProfileToStudentStatusHistory\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"guardians\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"StudentGuardian\",\"relationName\":\"StudentGuardianToStudentProfile\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"ranks\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"StudentRank\",\"relationName\":\"StudentProfileToStudentRank\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"attendances\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Attendance\",\"relationName\":\"AttendanceToStudentProfile\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updateRequests\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"ProfileUpdateRequest\",\"relationName\":\"ProfileUpdateRequestToStudentProfile\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"graduationRequests\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"GraduationRequest\",\"relationName\":\"GraduationRequestToStudentProfile\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"StudentStatusHistory\":{\"dbName\":\"student_status_history\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"studentProfileId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"previousStatus\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"StudentStatus\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"newStatus\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"StudentStatus\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"reason\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false,\"documentation\":\"Legacy free-text note. Prefer `leaveReason` / `customReasonDetails` for PAUSED and DROPPED.\"},{\"name\":\"leaveReason\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"LeaveReason\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"leaveNoticeMethod\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"LeaveNoticeMethod\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"customReasonDetails\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false,\"documentation\":\"Free-text complement when `leaveReason` is OTHER (or extra context for any reason).\"},{\"name\":\"changedById\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false,\"documentation\":\"Logical reference to the actor in auth-service (no physical FK).\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"studentProfile\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"StudentProfile\",\"relationName\":\"StudentProfileToStudentStatusHistory\",\"relationFromFields\":[\"studentProfileId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false,\"documentation\":\"---------------------------------------------------------\\\\nStudent Lifecycle Audit Log\\\\n---------------------------------------------------------\"},\"Guardian\":{\"dbName\":\"guardians\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"userId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false,\"documentation\":\"Logical reference to the identity owned by auth-service (no physical FK; resolve over HTTP)\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"students\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"StudentGuardian\",\"relationName\":\"GuardianToStudentGuardian\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"StudentGuardian\":{\"dbName\":\"student_guardians\",\"fields\":[{\"name\":\"studentProfileId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"guardianId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"relationship\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"student\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"StudentProfile\",\"relationName\":\"StudentGuardianToStudentProfile\",\"relationFromFields\":[\"studentProfileId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"guardian\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Guardian\",\"relationName\":\"GuardianToStudentGuardian\",\"relationFromFields\":[\"guardianId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":{\"name\":null,\"fields\":[\"studentProfileId\",\"guardianId\"]},\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Discipline\":{\"dbName\":\"disciplines\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"acronym\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false,\"documentation\":\"Short staff-facing label shown in dense tables (e.g. BJJ). Null falls back to `name`.\"},{\"name\":\"description\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"programs\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DisciplineProgram\",\"relationName\":\"DisciplineToDisciplineProgram\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false,\"documentation\":\"---------------------------------------------------------\\\\nAcademy Configuration (Disciplines & Ranks)\\\\n---------------------------------------------------------\"},\"DisciplineProgram\":{\"dbName\":\"discipline_programs\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"disciplineId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"minAge\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"maxAge\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":99,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"discipline\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Discipline\",\"relationName\":\"DisciplineToDisciplineProgram\",\"relationFromFields\":[\"disciplineId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"beltRanks\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"BeltRank\",\"relationName\":\"BeltRankToDisciplineProgram\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"BeltRank\":{\"dbName\":\"belt_ranks\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"disciplineProgramId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"order\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"maxStripes\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":4,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"minMonthsRequired\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"minHoursRequired\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"program\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DisciplineProgram\",\"relationName\":\"BeltRankToDisciplineProgram\",\"relationFromFields\":[\"disciplineProgramId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"studentRanks\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"StudentRank\",\"relationName\":\"BeltRankToStudentRank\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"StudentRank\":{\"dbName\":\"student_ranks\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"studentProfileId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"beltRankId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"currentStripes\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"accumulatedHours\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"promotedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"lastStripeAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"student\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"StudentProfile\",\"relationName\":\"StudentProfileToStudentRank\",\"relationFromFields\":[\"studentProfileId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"beltRank\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"BeltRank\",\"relationName\":\"BeltRankToStudentRank\",\"relationFromFields\":[\"beltRankId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false,\"documentation\":\"---------------------------------------------------------\\\\nAcademic Records (Ranks & Attendances)\\\\n---------------------------------------------------------\"},\"Attendance\":{\"dbName\":\"attendances\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"studentProfileId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"date\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"countedForRank\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":true,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"student\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"StudentProfile\",\"relationName\":\"AttendanceToStudentProfile\",\"relationFromFields\":[\"studentProfileId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"ProfileUpdateRequest\":{\"dbName\":\"profile_update_requests\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"studentProfileId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"requestedChanges\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"RequestStatus\",\"default\":\"PENDING\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"reviewedById\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false,\"documentation\":\"Logical reference to the reviewer in auth-service (no physical FK).\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"studentProfile\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"StudentProfile\",\"relationName\":\"ProfileUpdateRequestToStudentProfile\",\"relationFromFields\":[\"studentProfileId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false,\"documentation\":\"---------------------------------------------------------\\\\nApproval Workflows (IAM & Validation)\\\\n---------------------------------------------------------\"},\"GraduationRequest\":{\"dbName\":\"graduation_requests\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"studentProfileId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"proposedBeltId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"proposedStripes\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"proposedById\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false,\"documentation\":\"Logical references to identities in auth-service (no physical FK).\"},{\"name\":\"approvedById\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"RequestStatus\",\"default\":\"PENDING\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"studentProfile\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"StudentProfile\",\"relationName\":\"GraduationRequestToStudentProfile\",\"relationFromFields\":[\"studentProfileId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"FeeTier\":{\"dbName\":\"fee_tiers\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"description\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"baseAmount\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"criteria\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isActive\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":true,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"studentFees\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"StudentFee\",\"relationName\":\"FeeTierToStudentFee\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"subscriptions\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"StudentSubscription\",\"relationName\":\"FeeTierToStudentSubscription\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false,\"documentation\":\"---------------------------------------------------------\\\\nBilling, Subscriptions & Financial Engine\\\\n---------------------------------------------------------\"},\"StudentFee\":{\"dbName\":\"student_fees\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"studentProfileId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false,\"documentation\":\"Logical academic-service StudentProfile id (no physical FK across bounded contexts).\"},{\"name\":\"feeTierId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"customAmount\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"ipcApplied\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"effectiveFrom\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"effectiveTo\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"feeTier\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"FeeTier\",\"relationName\":\"FeeTierToStudentFee\",\"relationFromFields\":[\"feeTierId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Discount\":{\"dbName\":\"discounts\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"code\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"description\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"type\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DiscountType\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"category\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DiscountCategory\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"value\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"startDate\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"endDate\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isActive\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":true,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"studentDiscounts\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"StudentDiscount\",\"relationName\":\"DiscountToStudentDiscount\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"StudentDiscount\":{\"dbName\":\"student_discounts\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"studentProfileId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false,\"documentation\":\"Logical academic-service StudentProfile id (no physical FK across bounded contexts).\"},{\"name\":\"discountId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"assignedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"expiresAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"discount\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Discount\",\"relationName\":\"DiscountToStudentDiscount\",\"relationFromFields\":[\"discountId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[[\"studentProfileId\",\"discountId\"]],\"uniqueIndexes\":[{\"name\":null,\"fields\":[\"studentProfileId\",\"discountId\"]}],\"isGenerated\":false},\"StudentSubscription\":{\"dbName\":\"student_subscriptions\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"studentProfileId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false,\"documentation\":\"Logical academic-service StudentProfile id (no physical FK across bounded contexts).\"},{\"name\":\"feeTierId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isActive\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":true,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"feeTier\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"FeeTier\",\"relationName\":\"FeeTierToStudentSubscription\",\"relationFromFields\":[\"feeTierId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"CashRegisterSession\":{\"dbName\":\"cash_register_sessions\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"openedById\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"closedById\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"openingDate\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"closingDate\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"initialBalance\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"expectedClosingBalance\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"actualClosingBalance\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"discrepancy\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"CashSessionStatus\",\"default\":\"OPEN\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"notes\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"transactions\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"CashTransaction\",\"relationName\":\"CashRegisterSessionToCashTransaction\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false,\"documentation\":\"---------------------------------------------------------\\\\nDaily Cash Register Submodule\\\\n---------------------------------------------------------\"},\"CashTransaction\":{\"dbName\":\"cash_transactions\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"sessionId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"studentProfileId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"type\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"CashMovementType\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"category\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"CashCategory\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"paymentMethod\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"PaymentMethod\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"amount\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"description\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"recordedById\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"session\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"CashRegisterSession\",\"relationName\":\"CashRegisterSessionToCashTransaction\",\"relationFromFields\":[\"sessionId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"TenantFinancialConfig\":{\"dbName\":\"tenant_financial_configs\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tenantId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"legalName\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":\"\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"taxId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":\"\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"address\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":\"\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"city\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":\"\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"postalCode\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":\"\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"country\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":\"ES\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"creditorId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":\"\",\"isGenerated\":false,\"isUpdatedAt\":false,\"documentation\":\"SEPA Creditor Identifier (e.g. ES12ZZZ1234567) used in pain.008.\"},{\"name\":\"iban\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":\"\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"bic\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false,\"documentation\":\"---------------------------------------------------------\\\\nTenant Financial Configuration (SEPA creditor / invoicing)\\\\nOwned exclusively by financial-service. `tenantId` is the logical academy\\\\nkey from `x-school-id` (no physical Tenant table / cross-service FK).\\\\nEmpty-string defaults let GET create a blank row until staff complete it.\\\\n---------------------------------------------------------\"},\"BankMandate\":{\"dbName\":\"bank_mandates\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"payerUserId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false,\"documentation\":\"Logical auth-service user id of the payer who owns the IBAN (parent or adult student). Not a User FK.\"},{\"name\":\"iban\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"bic\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"mandateReference\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"signatureDate\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"accountHolderName\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false,\"documentation\":\"Legal name of the bank-account holder (SEPA debtor).\"},{\"name\":\"accountHolderDni\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false,\"documentation\":\"National ID (DNI/NIF/NIE) of the account holder. Required by Spanish banks (e.g. CaixaBank) on SEPA Direct Debit.\"},{\"name\":\"tenantId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":\"\",\"isGenerated\":false,\"isUpdatedAt\":false,\"documentation\":\"Academy key from `x-school-id`. Logical tenant isolation (no Tenant table FK).\"},{\"name\":\"isSigned\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false,\"documentation\":\"Clickwrap acceptance. `signatureDate` is the SEPA mandate date; `signedAt` is the audit timestamp.\"},{\"name\":\"signedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"signedByUserId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false,\"documentation\":\"Logical auth-service user id of the person who ticked accept (no User @relation).\"},{\"name\":\"signatureIp\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isActive\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":true,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"remittanceItems\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"RemittanceItem\",\"relationName\":\"BankMandateToRemittanceItem\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false,\"documentation\":\"---------------------------------------------------------\\\\nBank Remittance Submodule (SEPA / Caixabank Integration)\\\\n---------------------------------------------------------\"},\"RemittanceBatch\":{\"dbName\":\"remittance_batches\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"batchReference\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"executionDate\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"totalAmount\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"totalItems\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"RemittanceStatus\",\"default\":\"DRAFT\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"generatedById\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"filePath\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"items\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"RemittanceItem\",\"relationName\":\"RemittanceBatchToRemittanceItem\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"RemittanceItem\":{\"dbName\":\"remittance_items\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"batchId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"mandateId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"amount\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"RemittanceItemStatus\",\"default\":\"PENDING\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"returnReason\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"batch\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"RemittanceBatch\",\"relationName\":\"RemittanceBatchToRemittanceItem\",\"relationFromFields\":[\"batchId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"mandate\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"BankMandate\",\"relationName\":\"BankMandateToRemittanceItem\",\"relationFromFields\":[\"mandateId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Federation\":{\"dbName\":\"federations\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tenantId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false,\"documentation\":\"Academy key from `x-school-id`. Catalogs are tenant-scoped (no global sharing).\"},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"acronym\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":\"\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"country\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":\"ES\",\"isGenerated\":false,\"isUpdatedAt\":false,\"documentation\":\"ISO 3166-1 alpha-2 (e.g. \\\"ES\\\").\"},{\"name\":\"email\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false,\"documentation\":\"Official federation contact email (mandatory).\"},{\"name\":\"isActive\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":true,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"deletedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false,\"documentation\":\"Soft-delete timestamp. Live uniqueness of `(tenantId, name)` is a partial SQL index (`deletedAt IS NULL`).\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"charges\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"FederationSeasonCharge\",\"relationName\":\"FederationToFederationSeasonCharge\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"contacts\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"FederationContact\",\"relationName\":\"FederationToFederationContact\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"seasons\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"FederationSeason\",\"relationName\":\"FederationToFederationSeason\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false,\"documentation\":\"---------------------------------------------------------\\\\nFederations (financial-service) & Affiliation Licenses (academic-service)\\\\n`federationId` on licenses/charges is a logical id — no cross-service FK.\\\\n`holderUserId` is a logical auth-service identity (no User @relation).\\\\n---------------------------------------------------------\"},\"FederationContact\":{\"dbName\":\"federation_contacts\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"federationId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"medium\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"FederationContactMedium\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"value\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tag\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":\"\",\"isGenerated\":false,\"isUpdatedAt\":false,\"documentation\":\"Staff label, e.g. \\\"Sede nacional\\\", \\\"Presidencia\\\", \\\"Secretaria\\\".\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"federation\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Federation\",\"relationName\":\"FederationToFederationContact\",\"relationFromFields\":[\"federationId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false,\"documentation\":\"Tagged multi-value contact for a federation (several phones/emails/addresses).\"},\"FederationSeason\":{\"dbName\":\"federation_seasons\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"federationId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"seasonName\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false,\"documentation\":\"Display label, e.g. \\\"2026\\\" or \\\"26/27\\\".\"},{\"name\":\"currency\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":\"EUR\",\"isGenerated\":false,\"isUpdatedAt\":false,\"documentation\":\"ISO 4217, e.g. \\\"EUR\\\".\"},{\"name\":\"clubCost\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Decimal\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isActive\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":true,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"federation\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Federation\",\"relationName\":\"FederationToFederationSeason\",\"relationFromFields\":[\"federationId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"licenseTypes\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"FederationLicenseType\",\"relationName\":\"FederationLicenseTypeToFederationSeason\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[[\"federationId\",\"seasonName\"]],\"uniqueIndexes\":[{\"name\":null,\"fields\":[\"federationId\",\"seasonName\"]}],\"isGenerated\":false,\"documentation\":\"One pricing season for a federation (identity stays on `Federation`).\"},\"FederationLicenseType\":{\"dbName\":\"federation_license_types\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"seasonId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isActive\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":true,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"season\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"FederationSeason\",\"relationName\":\"FederationLicenseTypeToFederationSeason\",\"relationFromFields\":[\"seasonId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"priceRows\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"FederationLicensePriceRow\",\"relationName\":\"FederationLicensePriceRowToFederationLicenseType\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[[\"seasonId\",\"name\"]],\"uniqueIndexes\":[{\"name\":null,\"fields\":[\"seasonId\",\"name\"]}],\"isGenerated\":false,\"documentation\":\"One license product offered in a federation season (insurance variant, etc.).\"},\"FederationLicensePriceRow\":{\"dbName\":\"federation_license_price_rows\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"licenseTypeId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"kind\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"LicensePriceRowKind\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"label\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":\"\",\"isGenerated\":false,\"isUpdatedAt\":false,\"documentation\":\"Editable label for CUSTOM rows (e.g. \\\"Infantil/Juvenil\\\").\"},{\"name\":\"birthYearFrom\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false,\"documentation\":\"Inclusive birth year: members born in this year or later use this row.\"},{\"name\":\"cost\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Decimal\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"reduction\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Decimal\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"chargePrice\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Decimal\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false,\"documentation\":\"Face value charged to the member (`precio cobro`).\"},{\"name\":\"sortOrder\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"licenseType\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"FederationLicenseType\",\"relationName\":\"FederationLicensePriceRowToFederationLicenseType\",\"relationFromFields\":[\"licenseTypeId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false,\"documentation\":\"One pricing-matrix row (instructor, adult, or custom birth-year band).\"},\"FederationSeasonCharge\":{\"dbName\":\"federation_season_charges\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tenantId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"federationId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"season\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"holderType\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"LicenseHolderType\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"holderUserId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false,\"documentation\":\"Logical auth-service user id. Null only for `CLUB` rows.\"},{\"name\":\"studentProfileId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false,\"documentation\":\"Logical academic student profile id. Null for staff and club rows.\"},{\"name\":\"licenseId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false,\"documentation\":\"Logical academic license id (issued in academic-service).\"},{\"name\":\"costAmount\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false,\"documentation\":\"What the academy owes the federation for this holder.\"},{\"name\":\"saleAmount\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false,\"documentation\":\"What the academy charges the member (0 for club).\"},{\"name\":\"isPaid\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"federation\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Federation\",\"relationName\":\"FederationToFederationSeasonCharge\",\"relationFromFields\":[\"federationId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[[\"tenantId\",\"federationId\",\"season\",\"holderType\",\"holderUserId\"]],\"uniqueIndexes\":[{\"name\":null,\"fields\":[\"tenantId\",\"federationId\",\"season\",\"holderType\",\"holderUserId\"]}],\"isGenerated\":false,\"documentation\":\"Seasonal charge row owned by financial-service (budget + future remittance source).\"},\"AffiliationLicense\":{\"dbName\":\"student_licenses\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tenantId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"studentProfileId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false,\"documentation\":\"Logical academic StudentProfile id. Required for STUDENT holders, including minors (no User).\"},{\"name\":\"holderUserId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false,\"documentation\":\"Logical auth-service identity. Null for minors who have no User.\"},{\"name\":\"holderType\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"LicenseHolderType\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"federationId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false,\"documentation\":\"Logical financial-service federation id (no Federation @relation).\"},{\"name\":\"licenseTypeId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false,\"documentation\":\"Logical financial-service `FederationLicenseType` id (no cross-context @relation).\"},{\"name\":\"licenseNumber\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"season\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false,\"documentation\":\"Season label, e.g. \\\"2026-2027\\\".\"},{\"name\":\"validUntil\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isActive\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":true,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isPaid\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"amountCharged\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Decimal\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"AffiliationLicenseStatus\",\"default\":\"PENDING\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"payerUserId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false,\"documentation\":\"Logical auth-service identity that funds this license (adult student or parent payer).\"},{\"name\":\"isExempt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false,\"documentation\":\"Staff, instructors, or designated profiles issued at zero sale amount.\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueFields\":[[\"tenantId\",\"federationId\",\"holderUserId\",\"season\"],[\"tenantId\",\"federationId\",\"studentProfileId\",\"season\"]],\"uniqueIndexes\":[{\"name\":null,\"fields\":[\"tenantId\",\"federationId\",\"holderUserId\",\"season\"]},{\"name\":null,\"fields\":[\"tenantId\",\"federationId\",\"studentProfileId\",\"season\"]}],\"isGenerated\":false,\"documentation\":\"Affiliation license history owned by academic-service.\"}},\"enums\":{\"Role\":{\"values\":[{\"name\":\"SUPER_ADMIN\",\"dbName\":null},{\"name\":\"ADMIN_STAFF\",\"dbName\":null},{\"name\":\"SPORTS_TECHNICAL_DIRECTOR\",\"dbName\":null},{\"name\":\"INSTRUCTOR\",\"dbName\":null},{\"name\":\"STUDENT\",\"dbName\":null},{\"name\":\"PARENT\",\"dbName\":null},{\"name\":\"TRIAL\",\"dbName\":null}],\"dbName\":null,\"documentation\":\"---------------------------------------------------------\\\\nEnums\\\\n---------------------------------------------------------\"},\"RequestStatus\":{\"values\":[{\"name\":\"PENDING\",\"dbName\":null},{\"name\":\"APPROVED\",\"dbName\":null},{\"name\":\"REJECTED\",\"dbName\":null}],\"dbName\":null},\"StudentStatus\":{\"values\":[{\"name\":\"TRIAL\",\"dbName\":null},{\"name\":\"ACTIVE\",\"dbName\":null},{\"name\":\"PAUSED\",\"dbName\":null},{\"name\":\"DROPPED\",\"dbName\":null}],\"dbName\":null,\"documentation\":\"Lifecycle status of a student within the academy\"},\"DiscountType\":{\"values\":[{\"name\":\"PERCENTAGE\",\"dbName\":null},{\"name\":\"FIXED_DISCOUNT\",\"dbName\":null},{\"name\":\"FREE_PERIOD\",\"dbName\":null}],\"dbName\":null},\"DiscountCategory\":{\"values\":[{\"name\":\"FAMILY\",\"dbName\":null},{\"name\":\"SECURITY_FORCES\",\"dbName\":null},{\"name\":\"TEMPORARY\",\"dbName\":null}],\"dbName\":null},\"CashSessionStatus\":{\"values\":[{\"name\":\"OPEN\",\"dbName\":null},{\"name\":\"CLOSED\",\"dbName\":null},{\"name\":\"RECONCILED\",\"dbName\":null}],\"dbName\":null},\"CashMovementType\":{\"values\":[{\"name\":\"INCOME\",\"dbName\":null},{\"name\":\"EXPENSE\",\"dbName\":null}],\"dbName\":null},\"CashCategory\":{\"values\":[{\"name\":\"MEMBERSHIP_PAYMENT\",\"dbName\":null},{\"name\":\"EXAM_FEE\",\"dbName\":null},{\"name\":\"MERCHANDISE_SALE\",\"dbName\":null},{\"name\":\"OTHER_INCOME\",\"dbName\":null},{\"name\":\"OPERATIONAL_EXPENSE\",\"dbName\":null}],\"dbName\":null},\"PaymentMethod\":{\"values\":[{\"name\":\"CASH\",\"dbName\":null},{\"name\":\"CARD\",\"dbName\":null},{\"name\":\"BANK_TRANSFER\",\"dbName\":null}],\"dbName\":null},\"RemittanceStatus\":{\"values\":[{\"name\":\"DRAFT\",\"dbName\":null},{\"name\":\"GENERATED\",\"dbName\":null},{\"name\":\"SUBMITTED\",\"dbName\":null},{\"name\":\"SETTLED\",\"dbName\":null},{\"name\":\"REJECTED\",\"dbName\":null}],\"dbName\":null},\"RemittanceItemStatus\":{\"values\":[{\"name\":\"PENDING\",\"dbName\":null},{\"name\":\"SETTLED\",\"dbName\":null},{\"name\":\"RETURNED\",\"dbName\":null}],\"dbName\":null},\"Gender\":{\"values\":[{\"name\":\"MALE\",\"dbName\":null},{\"name\":\"FEMALE\",\"dbName\":null},{\"name\":\"NON_BINARY\",\"dbName\":null},{\"name\":\"OTHER\",\"dbName\":null}],\"dbName\":null,\"documentation\":\"Competition / statistics identity. Optional so legacy Excel rows can be imported without it.\"},\"LeaveReason\":{\"values\":[{\"name\":\"ECONOMIC\",\"dbName\":null},{\"name\":\"TIME_CONFLICT\",\"dbName\":null},{\"name\":\"INJURY\",\"dbName\":null},{\"name\":\"MOVED\",\"dbName\":null},{\"name\":\"DISSATISFIED\",\"dbName\":null},{\"name\":\"OTHER\",\"dbName\":null}],\"dbName\":null,\"documentation\":\"Structured cause when a student is PAUSED or DROPPED (Excel leave-reason columns).\"},\"LeaveNoticeMethod\":{\"values\":[{\"name\":\"PHONE\",\"dbName\":null},{\"name\":\"WHATSAPP\",\"dbName\":null},{\"name\":\"IN_PERSON\",\"dbName\":null},{\"name\":\"RECEPTION\",\"dbName\":null},{\"name\":\"OTHER\",\"dbName\":null}],\"dbName\":null,\"documentation\":\"Channel through which staff learned of a pause or drop.\"},\"LicenseHolderType\":{\"values\":[{\"name\":\"STUDENT\",\"dbName\":null},{\"name\":\"INSTRUCTOR\",\"dbName\":null},{\"name\":\"TECHNICAL_DIRECTOR\",\"dbName\":null},{\"name\":\"CLUB\",\"dbName\":null,\"documentation\":\"Club-level federation fee (one charge per academy per season, not a person).\"}],\"dbName\":null,\"documentation\":\"Who a federation affiliation license (or seasonal charge) belongs to.\"},\"AffiliationLicenseStatus\":{\"values\":[{\"name\":\"PENDING\",\"dbName\":null},{\"name\":\"PAID\",\"dbName\":null},{\"name\":\"EXEMPT\",\"dbName\":null},{\"name\":\"FAILED\",\"dbName\":null}],\"dbName\":null,\"documentation\":\"Collection state of an affiliation license (academic-service).\"},\"FederationContactMedium\":{\"values\":[{\"name\":\"EMAIL\",\"dbName\":null},{\"name\":\"PHONE\",\"dbName\":null},{\"name\":\"ADDRESS\",\"dbName\":null}],\"dbName\":null,\"documentation\":\"Contact medium for a tagged federation contact (financial-service).\"},\"LicensePriceRowKind\":{\"values\":[{\"name\":\"INSTRUCTOR\",\"dbName\":null},{\"name\":\"ADULT\",\"dbName\":null},{\"name\":\"CUSTOM\",\"dbName\":null}],\"dbName\":null,\"documentation\":\"One row in a season license-type pricing matrix.\"}},\"types\":{}}")
defineDmmfProperty(exports.Prisma, config.runtimeDataModel)
config.engineWasm = undefined

config.injectableEdgeEnv = () => ({
  parsed: {
    DATABASE_URL: typeof globalThis !== 'undefined' && globalThis['DATABASE_URL'] || typeof process !== 'undefined' && process.env && process.env.DATABASE_URL || undefined
  }
})

if (typeof globalThis !== 'undefined' && globalThis['DEBUG'] || typeof process !== 'undefined' && process.env && process.env.DEBUG || undefined) {
  Debug.enable(typeof globalThis !== 'undefined' && globalThis['DEBUG'] || typeof process !== 'undefined' && process.env && process.env.DEBUG || undefined)
}

const PrismaClient = getPrismaClient(config)
exports.PrismaClient = PrismaClient
Object.assign(exports, Prisma)

