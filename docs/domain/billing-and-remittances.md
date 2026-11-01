# Domain Rules: Billing & SEPA Remittances

## Recurring Billing (SEPA)
*   **Payer owns the mandate:** A `BankMandate` belongs to `payerUserId` (the `User` who signed it and owns the IBAN) — never to the student. Coverage is a logical pointer: `StudentProfile.bankMandateId`.
*   **Siblings share one mandate:** One parent `User` has one active `BankMandate` that can cover multiple `StudentProfile` fees.
*   **Batch Days:** Configurable per academy. Default batch generation occurs on the 1st and 10th of the month.
*   **Receipt Granularity:** Receipts are **NOT** grouped. If a `PARENT` pays for 3 children, the system generates 3 separate SEPA receipts (one per `StudentProfile`), even when they share the same `bankMandateId` / IBAN.

## Mid-Month Prorating
*   When a student enrolls mid-month, the system automatically calculates the prorated fee: `(Monthly Fee / 30) * Remaining Days in Month`.
*   This calculated amount is presented to the `ADMIN_STAFF` during onboarding as a suggested Cash/Card payment. The staff can manually override this value before confirming.

## Discounts
*   **Types:** Can be temporary (date-bounded) or permanent (e.g., Law Enforcement, Family Plan).
*   **Accumulation:** Discounts are flagged as cumulative or non-cumulative. If multiple non-cumulative discounts apply, the system automatically selects the one most favorable to the student.

## Delinquency & Debt Management
*   **Failed SEPA/Chargebacks:** Does NOT automatically block app access or classes. Delinquency management is a manual staff operation.
*   **Automated Dunning:** The system sends configurable, recurring alerts (e.g., every 2, 5, or 7 days) to the `STUDENT` (or `PARENT`) reminding them of the pending debt.
*   **Staff Dashboard:** Unpaid receipts are prominently displayed on a unified dashboard for `ADMIN_STAFF` and `SUPER_ADMIN` to facilitate manual collection.