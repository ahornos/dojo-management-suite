# Domain Rules: Multi-Tenant Architecture

## Data Isolation
The platform is designed as a white-label SaaS. Every academy (Tenant) operates in strict isolation.

*   **Custom Configurations:** Belt programs, pricing tiers, discount structures, and SEPA batch dates are defined exclusively at the tenant level. There is no global sharing of business catalogs.
*   **User Identity Isolation:** User accounts are scoped to the tenant. If a `STUDENT` or `INSTRUCTOR` attends two different academies powered by this software, they MUST register two entirely separate accounts. The system does not support cross-tenant identity linking or global logins.

## Tenant Resolution
*   The API Gateway resolves the tenant via the subdomain or a custom header (`x-school-id`). 
*   All backend queries MUST scope their Prisma operations to the resolved `tenantId` to prevent cross-academy data leaks.