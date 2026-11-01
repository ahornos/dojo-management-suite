/**
 * @file common.enums.ts
 * @description Shared system-wide and domain enumerations decoupled from the ORM.
 */
export declare enum Role {
    SUPER_ADMIN = "SUPER_ADMIN",
    ADMIN_STAFF = "ADMIN_STAFF",
    SPORTS_TECHNICAL_DIRECTOR = "SPORTS_TECHNICAL_DIRECTOR",
    INSTRUCTOR = "INSTRUCTOR",
    STUDENT = "STUDENT",
    PARENT = "PARENT",
    TRIAL = "TRIAL"
}
export declare enum DiscountType {
    PERCENTAGE = "PERCENTAGE",
    FIXED_DISCOUNT = "FIXED_DISCOUNT",
    FREE_PERIOD = "FREE_PERIOD"
}
export declare enum DiscountCategory {
    FAMILY = "FAMILY",
    SECURITY_FORCES = "SECURITY_FORCES",
    TEMPORARY = "TEMPORARY"
}
export declare enum CashMovementType {
    INCOME = "INCOME",
    EXPENSE = "EXPENSE"
}
export declare enum CashCategory {
    MEMBERSHIP_PAYMENT = "MEMBERSHIP_PAYMENT",
    EXAM_FEE = "EXAM_FEE",
    MERCHANDISE_SALE = "MERCHANDISE_SALE",
    OTHER_INCOME = "OTHER_INCOME",
    OPERATIONAL_EXPENSE = "OPERATIONAL_EXPENSE"
}
export declare enum PaymentMethod {
    CASH = "CASH",
    CARD = "CARD",
    BANK_TRANSFER = "BANK_TRANSFER"
}
export declare enum RemittanceStatus {
    DRAFT = "DRAFT",
    GENERATED = "GENERATED",
    SUBMITTED = "SUBMITTED",
    SETTLED = "SETTLED",
    REJECTED = "REJECTED"
}
export declare enum RemittanceItemStatus {
    PENDING = "PENDING",
    SETTLED = "SETTLED",
    RETURNED = "RETURNED"
}
export declare enum Gender {
    MALE = "MALE",
    FEMALE = "FEMALE",
    NON_BINARY = "NON_BINARY",
    OTHER = "OTHER"
}
export declare enum LeaveReason {
    ECONOMIC = "ECONOMIC",
    TIME_CONFLICT = "TIME_CONFLICT",
    INJURY = "INJURY",
    MOVED = "MOVED",
    DISSATISFIED = "DISSATISFIED",
    OTHER = "OTHER"
}
export declare enum LeaveNoticeMethod {
    PHONE = "PHONE",
    WHATSAPP = "WHATSAPP",
    IN_PERSON = "IN_PERSON",
    RECEPTION = "RECEPTION",
    OTHER = "OTHER"
}
export declare enum LicenseHolderType {
    STUDENT = "STUDENT",
    INSTRUCTOR = "INSTRUCTOR",
    TECHNICAL_DIRECTOR = "TECHNICAL_DIRECTOR",
    CLUB = "CLUB"
}
export declare enum AffiliationLicenseStatus {
    PENDING = "PENDING",
    PAID = "PAID",
    EXEMPT = "EXEMPT",
    FAILED = "FAILED"
}
export declare enum FederationContactMedium {
    EMAIL = "EMAIL",
    PHONE = "PHONE",
    ADDRESS = "ADDRESS"
}
