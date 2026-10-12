"use strict";
/**
 * @file common.enums.ts
 * @description Shared system-wide and domain enumerations decoupled from the ORM.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemittanceItemStatus = exports.RemittanceStatus = exports.PaymentMethod = exports.CashCategory = exports.CashMovementType = exports.DiscountCategory = exports.DiscountType = exports.Role = void 0;
var Role;
(function (Role) {
    Role["SUPER_ADMIN"] = "SUPER_ADMIN";
    Role["ADMIN_STAFF"] = "ADMIN_STAFF";
    Role["SPORTS_TECHNICAL_DIRECTOR"] = "SPORTS_TECHNICAL_DIRECTOR";
    Role["INSTRUCTOR"] = "INSTRUCTOR";
    Role["STUDENT"] = "STUDENT";
    Role["PARENT"] = "PARENT";
})(Role || (exports.Role = Role = {}));
var DiscountType;
(function (DiscountType) {
    DiscountType["PERCENTAGE"] = "PERCENTAGE";
    DiscountType["FIXED_DISCOUNT"] = "FIXED_DISCOUNT";
    DiscountType["FREE_PERIOD"] = "FREE_PERIOD";
})(DiscountType || (exports.DiscountType = DiscountType = {}));
var DiscountCategory;
(function (DiscountCategory) {
    DiscountCategory["FAMILY"] = "FAMILY";
    DiscountCategory["SECURITY_FORCES"] = "SECURITY_FORCES";
    DiscountCategory["TEMPORARY"] = "TEMPORARY";
})(DiscountCategory || (exports.DiscountCategory = DiscountCategory = {}));
var CashMovementType;
(function (CashMovementType) {
    CashMovementType["INCOME"] = "INCOME";
    CashMovementType["EXPENSE"] = "EXPENSE";
})(CashMovementType || (exports.CashMovementType = CashMovementType = {}));
var CashCategory;
(function (CashCategory) {
    CashCategory["MEMBERSHIP_PAYMENT"] = "MEMBERSHIP_PAYMENT";
    CashCategory["EXAM_FEE"] = "EXAM_FEE";
    CashCategory["MERCHANDISE_SALE"] = "MERCHANDISE_SALE";
    CashCategory["OTHER_INCOME"] = "OTHER_INCOME";
    CashCategory["OPERATIONAL_EXPENSE"] = "OPERATIONAL_EXPENSE";
})(CashCategory || (exports.CashCategory = CashCategory = {}));
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["CASH"] = "CASH";
    PaymentMethod["CARD"] = "CARD";
    PaymentMethod["BANK_TRANSFER"] = "BANK_TRANSFER";
})(PaymentMethod || (exports.PaymentMethod = PaymentMethod = {}));
var RemittanceStatus;
(function (RemittanceStatus) {
    RemittanceStatus["DRAFT"] = "DRAFT";
    RemittanceStatus["GENERATED"] = "GENERATED";
    RemittanceStatus["SUBMITTED"] = "SUBMITTED";
    RemittanceStatus["SETTLED"] = "SETTLED";
    RemittanceStatus["REJECTED"] = "REJECTED";
})(RemittanceStatus || (exports.RemittanceStatus = RemittanceStatus = {}));
var RemittanceItemStatus;
(function (RemittanceItemStatus) {
    RemittanceItemStatus["PENDING"] = "PENDING";
    RemittanceItemStatus["SETTLED"] = "SETTLED";
    RemittanceItemStatus["RETURNED"] = "RETURNED";
})(RemittanceItemStatus || (exports.RemittanceItemStatus = RemittanceItemStatus = {}));
