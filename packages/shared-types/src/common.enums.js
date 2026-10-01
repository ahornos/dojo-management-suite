"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemittanceItemStatus = exports.RemittanceStatus = exports.PaymentMethod = exports.CashCategory = exports.CashMovementType = exports.PromotionCategory = exports.PromotionType = exports.Role = void 0;
var Role;
(function (Role) {
    Role["SUPER_ADMIN"] = "SUPER_ADMIN";
    Role["ADMIN_STAFF"] = "ADMIN_STAFF";
    Role["SPORTS_TECHNICAL_DIRECTOR"] = "SPORTS_TECHNICAL_DIRECTOR";
    Role["INSTRUCTOR"] = "INSTRUCTOR";
    Role["STUDENT"] = "STUDENT";
    Role["PARENT"] = "PARENT";
})(Role || (exports.Role = Role = {}));
var PromotionType;
(function (PromotionType) {
    PromotionType["PERCENTAGE"] = "PERCENTAGE";
    PromotionType["FIXED_DISCOUNT"] = "FIXED_DISCOUNT";
    PromotionType["FREE_PERIOD"] = "FREE_PERIOD";
})(PromotionType || (exports.PromotionType = PromotionType = {}));
var PromotionCategory;
(function (PromotionCategory) {
    PromotionCategory["FAMILY"] = "FAMILY";
    PromotionCategory["SECURITY_FORCES"] = "SECURITY_FORCES";
    PromotionCategory["TEMPORARY"] = "TEMPORARY";
})(PromotionCategory || (exports.PromotionCategory = PromotionCategory = {}));
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
//# sourceMappingURL=common.enums.js.map