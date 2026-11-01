/**
 * @file common.enums.ts
 * @description Shared system-wide and domain enumerations decoupled from the ORM.
 */

export enum Role {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN_STAFF = 'ADMIN_STAFF',
  SPORTS_TECHNICAL_DIRECTOR = 'SPORTS_TECHNICAL_DIRECTOR',
  INSTRUCTOR = 'INSTRUCTOR',
  STUDENT = 'STUDENT',
  PARENT = 'PARENT',
  TRIAL = 'TRIAL',
}

export enum DiscountType {
  PERCENTAGE = 'PERCENTAGE',
  FIXED_DISCOUNT = 'FIXED_DISCOUNT',
  FREE_PERIOD = 'FREE_PERIOD',
}

export enum DiscountCategory {
  FAMILY = 'FAMILY',
  SECURITY_FORCES = 'SECURITY_FORCES',
  TEMPORARY = 'TEMPORARY',
}

export enum CashMovementType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

export enum CashCategory {
  MEMBERSHIP_PAYMENT = 'MEMBERSHIP_PAYMENT',
  EXAM_FEE = 'EXAM_FEE',
  MERCHANDISE_SALE = 'MERCHANDISE_SALE',
  OTHER_INCOME = 'OTHER_INCOME',
  OPERATIONAL_EXPENSE = 'OPERATIONAL_EXPENSE',
}

export enum PaymentMethod {
  CASH = 'CASH',
  CARD = 'CARD',
  BANK_TRANSFER = 'BANK_TRANSFER',
}

export enum RemittanceStatus {
  DRAFT = 'DRAFT',
  GENERATED = 'GENERATED',
  SUBMITTED = 'SUBMITTED',
  SETTLED = 'SETTLED',
  REJECTED = 'REJECTED',
}

export enum RemittanceItemStatus {
  PENDING = 'PENDING',
  SETTLED = 'SETTLED',
  RETURNED = 'RETURNED',
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  NON_BINARY = 'NON_BINARY',
  OTHER = 'OTHER',
}

export enum LeaveReason {
  ECONOMIC = 'ECONOMIC',
  TIME_CONFLICT = 'TIME_CONFLICT',
  INJURY = 'INJURY',
  MOVED = 'MOVED',
  DISSATISFIED = 'DISSATISFIED',
  OTHER = 'OTHER',
}

export enum LeaveNoticeMethod {
  PHONE = 'PHONE',
  WHATSAPP = 'WHATSAPP',
  IN_PERSON = 'IN_PERSON',
  RECEPTION = 'RECEPTION',
  OTHER = 'OTHER',
}

export enum LicenseHolderType {
  STUDENT = 'STUDENT',
  INSTRUCTOR = 'INSTRUCTOR',
  TECHNICAL_DIRECTOR = 'TECHNICAL_DIRECTOR',
  CLUB = 'CLUB',
}

export enum AffiliationLicenseStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  EXEMPT = 'EXEMPT',
  FAILED = 'FAILED',
}

export enum FederationContactMedium {
  EMAIL = 'EMAIL',
  PHONE = 'PHONE',
  ADDRESS = 'ADDRESS',
}