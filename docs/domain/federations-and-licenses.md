# Domain Rules: Federations & Affiliation Licenses

## Bounded Contexts
*   **financial-service** owns the federation catalog (identity, tagged contacts, seasons, license types, pricing matrices) and seasonal charges used for payout budgeting and future remittances.
*   **academic-service** owns affiliation license history, expiry alerts, and batch issuance filters (age, discipline, enrollment date, role, season, license type).
*   `federationId` and `licenseTypeId` on a license are logical identifiers. There is no physical Foreign Key from academic licenses to financial tables.

## Federation identity
*   A federation has `name`, `acronym`, ISO 3166-1 alpha-2 `country` (default `ES`), and a mandatory official `email`.
*   Deprecated profile fields (`territorialScope`, scalar `phone` / `address`, federation-level prices) are not used.
*   Extra contacts live on `FederationContact`: medium (`EMAIL` / `PHONE` / `ADDRESS`), value, and a staff tag. Several entries per medium are allowed. Official email stays on `Federation`.
*   Lifecycle: `isActive` is the operational toggle (activate / deactivate). `deletedAt` is a soft-delete timestamp. Standard lists hide rows with `deletedAt` set. SUPER_ADMIN may filter `status=DELETED`, soft-delete (hide, name reusable), or hard-delete (cascade wipe of contacts, seasons, prices, and charges).

## Seasons and pricing
*   Pricing is seasonal. `FederationSeason` holds `seasonName` (e.g. `2026` or `26/27`), ISO 4217 `currency` (default `EUR`), and `clubCost` (academy → federation club licensing fee for that season).
*   A season offers one or more **license types** (`FederationLicenseType`) — e.g. standard vs accident-insurance variants.
*   Each type has a **pricing matrix** (`FederationLicensePriceRow`):
    *   `INSTRUCTOR` — staff / instructor cost, reduction (default 0), and charge price.
    *   `ADULT` — adult student row.
    *   `CUSTOM` — editable label (e.g. "Infantil/Juvenil") plus inclusive `birthYearFrom` (born that year or later).
*   **Cost − reduction** is the net amount the academy owes the federation (floored at zero, never stored). **Charge price** is the face value billed to the member.
*   When several CUSTOM rows match a birth year, the highest `birthYearFrom` wins. Otherwise the ADULT row is used. Instructors and technical directors use the INSTRUCTOR row.
*   Money is stored and computed as `Decimal(10, 2)`. JavaScript floats are not used for persistence.

## Licenses
*   One license row per `(tenant, federation, holder, season)`. Renewals for a new season create a new history row.
*   Academic `season` still uses `YYYY-YYYY` for uniqueness and license numbers. It is matched to `FederationSeason.seasonName` when the labels coincide; otherwise the first active season is used.
*   Students are `LicenseHolderType.STUDENT` and keep `studentProfileId`. Instructors and sports technical directors are staff holders keyed by `holderUserId` only.
*   Age and birth year always come from `StudentProfile.birthDate`. Minors have no `User`.
*   Dashboard alerts list licenses with `isActive = true` and `validUntil` within the next 30 days.

## Batch issuance
*   Preview/filter runs in academic-service. Student filters use academic ranks and profile `createdAt`; staff filters resolve identities from auth-service by role.
*   Generating charges (financial) is a separate write from persisting license rows (academic). Staff UIs orchestrate both, the same way student create orchestrates a SEPA mandate.
