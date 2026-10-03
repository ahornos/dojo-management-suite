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