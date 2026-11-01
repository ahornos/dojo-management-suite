# Domain Rules: Academic Lifecycle & Disciplines

## Student State Machine
A student's global status dictates their billing and access rights. 
*   **Global Status Flow:** `TRIAL` -> `ACTIVE` <-> `PAUSED` -> `CANCELED`.
*   **Discipline-Specific Status:** A student can be `ACTIVE` globally but maintain independent statuses per discipline (e.g., `ACTIVE` in BJJ, `PAUSED` in Muay Thai) for accurate historical tracking.
*   **Audit Trail:** Every status transition must record the timestamp and the `userId` of the actor performing the change in `StudentStatusHistory`.

### Status Transition Triggers
*   **TRIAL to ACTIVE:** Triggers the onboarding flow. Requires full profile data, emergency contacts (or PARENT linked if minor), and banking data. Automatically schedules the next month's recurring SEPA billing. The current prorated month is handled manually (cash/card).
*   **ACTIVE to PAUSED:** Triggers a halt on next month's billing.

## Identity & Minors
*   **Adult Students (18+):** Have a `User` login linked via optional `StudentProfile.userId`. Must provide DNI/Passport. Emergency contacts are informational only.
*   **Minor Students:** Exist only as a `StudentProfile` (`userId` is `null`). They have **no** `User` record and no login. DNI is optional. MUST be linked to at least one `PARENT` `User` via `StudentGuardian`. The parent holds login, proxy access, and the SEPA mandate (`payerUserId`).
*   Demographics (`firstName`, `lastName`, `birthDate`, `gender`, contact fields) live on `StudentProfile` so a minor can exist without an auth identity.

## Belt Graduations & Eligibility
*   Each discipline defines its own promotion logic (belts, degrees, minimum hours, time-in-grade).
*   **Alerts:** When a student meets the criteria, the system flags them as "Eligible" to Instructors/Directors.
*   **Postponement:** An Instructor can manually postpone an eligible student's review (e.g., 1 month, 3 months) due to technical readiness. The alert is snoozed for the selected duration.
*   **Approval:** Only a `SPORTS_TECHNICAL_DIRECTOR` (or an empowered Instructor) can finalize a graduation.