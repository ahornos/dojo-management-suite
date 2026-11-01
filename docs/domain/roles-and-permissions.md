# Domain Rules: Roles & Permissions

## Role Definitions & Boundaries
The system operates under a strict Role-Based Access Control (RBAC) architecture with the following roles:

*   **SUPER_ADMIN:** God-mode. The only role capable of:
    *   Granting `SUPER_ADMIN` privileges.
    *   Hard-deleting Users, Disciplines, and Students.
*   **ADMIN_STAFF:** Day-to-day academy management. Can grant any role (except `SUPER_ADMIN`). Has full access to the financial and billing modules. Can "soft-delete" entities.
*   **SPORTS_TECHNICAL_DIRECTOR:** Oversees martial arts programs. Can create/propose discipline syllabus (belts/ranks), approve graduations, update attendances, and view all student technical/contact data. **NO access to financial data.**
*   **INSTRUCTOR:** Day-to-day class management. Can update attendances, view student technical data, and propose graduations. **NO access to financial data.**
*   **STUDENT:** End-user login for adult students. Can view their own profile, attendance stats, graduation history, and modify basic contact/login info. Minors do not receive this role or a `User` record.
*   **PARENT:** Login identity for a guardian. Linked to minor `StudentProfile` rows via `StudentGuardian`. Inherits student-profile permissions for those children and owns the family `BankMandate` (`payerUserId`).
*   **TRIAL:** A prospect. Has no system access. Used strictly for conversion metrics.

## Special Workflows

### Soft-Delete Protocol
*   When an `ADMIN_STAFF` marks a user/student for deletion (soft-delete):
    1. The user's application access is instantly revoked.
    2. Any active SEPA mandates or recurring billings are immediately paused.
*   If a `SUPER_ADMIN` rejects the deletion, access and billing are automatically restored to their previous state.
*   If approved, the `SUPER_ADMIN` triggers a hard delete (or anonymization, compliant with GDPR).

### Coming of Age (18th Birthday)
*   The system monitors the `birthDate` of minor Students.
*   Upon turning 18, the transition is **not** automatic. 
*   The system triggers a notification to the `STUDENT`, the linked `PARENT`, and the `ADMIN_STAFF` dashboard to manually resolve the financial and access independence of the new adult.