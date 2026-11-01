/**
 * @file licenses.service.ts
 * @description Affiliation license history, expiry alerts, filtered batch issuance, and
 * selected-student batch issuance (price → financial charges → academic persist).
 * Student age and identity come from StudentProfile. Minors (userId null) are first-class holders.
 * Federation catalog and charges live in financial-service (logical ids, HTTP only).
 */

import { BadRequestException, ConflictException, Injectable, Logger } from '@nestjs/common';
import { AffiliationLicenseStatus, Prisma, StudentStatus } from '@dms/database/client';
import { LicenseHolderType, Role, UserSummary } from '@dms/shared-types';
import { randomUUID } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { UsersDirectoryClient } from '../users-directory/users-directory.client';
import { FederationsClient, FederationCatalog, FederationChargeHolder, MemberChargeItem } from '../federations/federations.client';
import { IssueLicenseDto } from './dto/issue-license.dto';
import { PreviewLicensesDto } from './dto/preview-licenses.dto';
import { BatchIssueLicensesDto } from './dto/batch-issue-licenses.dto';
import {
  ageInYears,
  defaultValidUntil,
  isMinor,
  matchesAgeFilter,
  matchesBirthYearFilter,
  matchesEnrollmentFilter,
} from './license-filters';
import {
  pickLicenseType,
  pickPriceRow,
  priceRowAmounts,
  resolveSeasonCatalog,
  resolveSeasonFromCatalog,
} from './license-pricing';

const EXPIRING_WINDOW_MS = 30 * 24 * 60 * 60 * 1000;
const ZERO = new Prisma.Decimal(0);

/**
 * A candidate holder returned by preview.
 * `holderUserId` is null for minors who have no login User.
 */
export interface LicensePreviewHolder {
  holderUserId: string | null;
  studentProfileId: string | null;
  holderType: LicenseHolderType;
  firstName: string;
  lastName: string;
  email: string;
  age: number | null;
  birthYear: number | null;
  alreadyLicensed: boolean;
  payerUserId: string | null;
  suggestedLicenseTypeId: string | null;
  suggestedLicenseTypeName: string | null;
}

/**
 * One skip/failure recorded without aborting the rest of the batch.
 */
export interface LicenseBatchWarning {
  code: string;
  studentProfileId: string | null;
  holderUserId: string | null;
}

/**
 * Result of `POST /licenses/batch`.
 */
export interface LicenseBatchResult {
  created: number;
  skipped: number;
  charged: number;
  warnings: LicenseBatchWarning[];
  licenses: object[];
}

/**
 * One student skipped during selected-student batch issuance.
 */
export interface SelectedLicenseSkip {
  studentId: string;
  reason: string;
}

/**
 * Result of the explicit-id `POST /licenses/batch` engine.
 */
export interface SelectedLicenseBatchResult {
  totalProcessed: number;
  successCount: number;
  skippedCount: number;
  skippedDetails: SelectedLicenseSkip[];
}

type StudentProfileCandidate = Prisma.StudentProfileGetPayload<{
  include: { ranks: { include: { beltRank: { include: { program: true } } } }; guardians: { include: { guardian: true } } };
}>;

type StudentProfileWithGuardians = Prisma.StudentProfileGetPayload<{
  include: { guardians: { include: { guardian: true } } };
}>;

/**
 * Academic owner of affiliation licenses. Federation ids and student ids are logical (no Prisma join).
 */
@Injectable()
export class LicensesService {
  private readonly logger = new Logger(LicensesService.name);

  /**
   * @param {PrismaService} prisma - Academic tables only.
   * @param {UsersDirectoryClient} usersClient - Identity directory over HTTP.
   * @param {FederationsClient} federationsClient - Financial catalog and charges over HTTP.
   */
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersClient: UsersDirectoryClient,
    private readonly federationsClient: FederationsClient,
  ) {}

  /**
   * Lists licenses of this tenant, optionally narrowed to one federation or holder.
   *
   * @param {string} tenantId - Academy key from `x-school-id`.
   * @param {{ federationId?: string; holderUserId?: string; studentProfileId?: string }} filters - Optional filters.
   * @returns {Promise<object[]>} License rows with holder identity.
   */
  async findAll(
    tenantId: string,
    filters: { federationId?: string; holderUserId?: string; studentProfileId?: string },
  ) {
    const rows = await this.prisma.affiliationLicense.findMany({
      where: {
        tenantId,
        ...(filters.federationId ? { federationId: filters.federationId } : {}),
        ...(filters.holderUserId ? { holderUserId: filters.holderUserId } : {}),
        ...(filters.studentProfileId ? { studentProfileId: filters.studentProfileId } : {}),
      },
      orderBy: [{ validUntil: 'asc' }, { createdAt: 'desc' }],
    });
    return this.withIdentities(rows);
  }

  /**
   * Current federative status for one student. Federation names come from financial-service over HTTP.
   *
   * @param {string} tenantId - Academy key from `x-school-id`.
   * @param {string} studentProfileId - Academic student profile UUID.
   * @returns {Promise<{ studentProfileId: string; federated: boolean; affiliations: object[] }>} Status.
   * @throws {BadRequestException} When the profile id is missing.
   */
  async getAffiliationStatus(tenantId: string, studentProfileId: string) {
    const profileId = studentProfileId.split(',')[0]?.trim();
    if (!profileId) {
      throw new BadRequestException('STUDENT_PROFILE_REQUIRED');
    }

    const rows = await this.prisma.affiliationLicense.findMany({
      where: { tenantId, studentProfileId: profileId },
      orderBy: { validUntil: 'desc' },
    });

    const now = Date.now();
    const uniqueIds = [...new Set(rows.map((row) => row.federationId))];
    const catalogs = new Map<string, FederationCatalog>();
    await Promise.all(
      uniqueIds.map(async (federationId) => {
        try {
          catalogs.set(federationId, await this.federationsClient.getFederation(tenantId, federationId));
        } catch {
          // Catalog may be soft-deleted or unreachable; the license row still exists.
        }
      }),
    );

    const affiliations = rows
      .filter((row) => row.isActive && row.validUntil.getTime() >= now)
      .map((row) => {
        const catalog = catalogs.get(row.federationId);
        return {
          federationId: row.federationId,
          federationName: catalog?.name ?? null,
          federationAcronym: catalog?.acronym || null,
          season: row.season,
          validUntil: row.validUntil,
          status: row.status,
        };
      });

    return {
      studentProfileId: profileId,
      federated: affiliations.length > 0,
      affiliations,
    };
  }

  /**
   * Licenses that expire within `days` (default 30) and are still active.
   *
   * @param {string} tenantId - Academy key from `x-school-id`.
   * @param {number} [days=30] - Inclusive window from now.
   * @returns {Promise<object[]>} Expiring licenses with identities.
   */
  async findExpiring(tenantId: string, days = 30) {
    const until = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    const rows = await this.prisma.affiliationLicense.findMany({
      where: {
        tenantId,
        isActive: true,
        validUntil: { lte: until, gte: new Date() },
      },
      orderBy: { validUntil: 'asc' },
    });
    return this.withIdentities(rows);
  }

  /**
   * Previews holders matching the massive-issuance filters.
   *
   * @param {string} tenantId - Academy key from `x-school-id`.
   * @param {PreviewLicensesDto} dto - Federation, season, role, age, discipline, enrollment.
   * @returns {Promise<{ holders: LicensePreviewHolder[] }>} Matching holders.
   */
  async preview(tenantId: string, dto: PreviewLicensesDto): Promise<{ holders: LicensePreviewHolder[] }> {
    const catalog = await this.federationsClient.getFederation(tenantId, dto.federationId);
    const holders = await this.resolveCandidates(tenantId, dto, catalog);
    return { holders };
  }

  /**
   * Issues a single license (renewal for a new season is a new row).
   *
   * @param {string} tenantId - Academy key from `x-school-id`.
   * @param {IssueLicenseDto} dto - Holder and season.
   * @returns {Promise<object>} Created license.
   */
  async issue(tenantId: string, dto: IssueLicenseDto) {
    if (dto.holderType === LicenseHolderType.STUDENT && !dto.studentProfileId) {
      throw new BadRequestException('STUDENT_PROFILE_REQUIRED');
    }
    if (dto.holderType !== LicenseHolderType.STUDENT && !dto.holderUserId) {
      throw new BadRequestException('HOLDER_USER_REQUIRED');
    }

    try {
      const created = await this.prisma.affiliationLicense.create({
        data: this.buildLicenseData(tenantId, dto),
      });
      const [enriched] = await this.withIdentities([created]);
      return enriched;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('LICENSE_ALREADY_EXISTS_FOR_SEASON');
      }
      throw error;
    }
  }

  /**
   * Issues licenses for every unlicensed holder matching the preview filters.
   * Duplicates are skipped with a warning. Non-exempt rows register a financial charge.
   *
   * @param {string} tenantId - Academy key from `x-school-id`.
   * @param {BatchIssueLicensesDto} dto - Season, federation, filters, and exemption flags.
   * @returns {Promise<LicenseBatchResult>} Created vs skipped counts plus warnings.
   */
  async issueBatch(tenantId: string, dto: BatchIssueLicensesDto): Promise<LicenseBatchResult> {
    if (!/^\d{4}-\d{4}$/.test(dto.season)) {
      throw new BadRequestException('LICENSE_SEASON_INVALID');
    }

    const catalog = await this.federationsClient.getFederation(tenantId, dto.federationId);
    const season = resolveSeasonCatalog(catalog.seasons, dto.season);
    const types = season?.licenseTypes ?? [];
    const holders = await this.resolveCandidates(tenantId, dto, catalog);
    const exemptProfiles = new Set(dto.exemptStudentProfileIds ?? []);
    const validUntil = dto.validUntil ? new Date(dto.validUntil) : defaultValidUntil(dto.season);
    const overrideSale = dto.amountCharged !== undefined ? new Prisma.Decimal(dto.amountCharged) : undefined;

    const warnings: LicenseBatchWarning[] = [];
    const createdIds: string[] = [];
    const chargeHolders: FederationChargeHolder[] = [];

    for (const holder of holders) {
      if (holder.alreadyLicensed) {
        warnings.push({
          code: 'LICENSE_ALREADY_EXISTS_FOR_SEASON',
          studentProfileId: holder.studentProfileId,
          holderUserId: holder.holderUserId,
        });
        continue;
      }

      const licenseType = pickLicenseType(
        types,
        dto.licenseTypeId ?? holder.suggestedLicenseTypeId ?? undefined,
      );
      const row = licenseType
        ? pickPriceRow(licenseType.priceRows, holder.holderType, holder.birthYear)
        : undefined;
      const typed = row ? priceRowAmounts(row) : { costAmount: ZERO, saleAmount: ZERO };
      const exempt = this.isExemptHolder(holder, exemptProfiles, dto.chargeStaff === true);
      const saleAmount = exempt ? ZERO : (overrideSale ?? typed.saleAmount);
      const costAmount = exempt ? ZERO : typed.costAmount;
      const payerUserId = exempt ? null : holder.payerUserId;
      const status = this.initialStatus(exempt, dto.isPaid === true, payerUserId, holder.holderType);

      if (!exempt && holder.holderType === LicenseHolderType.STUDENT && !payerUserId) {
        warnings.push({
          code: 'PAYER_UNRESOLVED',
          studentProfileId: holder.studentProfileId,
          holderUserId: holder.holderUserId,
        });
      }

      try {
        const created = await this.prisma.affiliationLicense.create({
          data: {
            tenantId,
            studentProfileId: holder.studentProfileId,
            holderUserId: holder.holderUserId,
            holderType: holder.holderType,
            federationId: dto.federationId,
            licenseTypeId: licenseType?.id ?? dto.licenseTypeId ?? null,
            licenseNumber: this.generateLicenseNumber(dto.season),
            season: dto.season,
            validUntil,
            amountCharged: saleAmount,
            isPaid: status === AffiliationLicenseStatus.PAID || status === AffiliationLicenseStatus.EXEMPT,
            status,
            payerUserId,
            isExempt: exempt,
            isActive: true,
          },
        });
        createdIds.push(created.id);

        if (!exempt && status !== AffiliationLicenseStatus.FAILED) {
          chargeHolders.push({
            holderType: holder.holderType,
            holderUserId: payerUserId ?? holder.holderUserId ?? undefined,
            studentProfileId: holder.studentProfileId ?? undefined,
            licenseId: created.id,
            costAmount: costAmount.toFixed(2),
            saleAmount: saleAmount.toFixed(2),
          });
        }
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
          warnings.push({
            code: 'LICENSE_ALREADY_EXISTS_FOR_SEASON',
            studentProfileId: holder.studentProfileId,
            holderUserId: holder.holderUserId,
          });
          continue;
        }
        throw error;
      }
    }

    let charged = 0;
    if (chargeHolders.length > 0 || dto.includeClubFee) {
      charged = await this.registerChargesOrMarkFailed(
        tenantId,
        dto.federationId,
        dto.season,
        chargeHolders,
        dto.includeClubFee === true,
        createdIds,
      );
    }

    const createdRows =
      createdIds.length === 0
        ? []
        : await this.prisma.affiliationLicense.findMany({ where: { id: { in: createdIds } } });

    return {
      created: createdRows.length,
      skipped: warnings.filter((warning) => warning.code === 'LICENSE_ALREADY_EXISTS_FOR_SEASON').length,
      charged,
      warnings,
      licenses: await this.withIdentities(createdRows),
    };
  }

  /**
   * Issues licenses for an explicit list of student profiles.
   * Already-licensed students are skipped (not a fatal error). Financial charges are
   * created first; academic rows persist only after that call succeeds.
   *
   * @param {string} tenantId - Academy key from `x-school-id`.
   * @param {BatchIssueLicensesDto} dto - Federation, season, license type, and profile ids.
   * @returns {Promise<SelectedLicenseBatchResult>} Processed / success / skipped summary.
   * @throws {BadRequestException} When the season or license type cannot be resolved.
   */
  async issueSelectedStudents(tenantId: string, dto: BatchIssueLicensesDto): Promise<SelectedLicenseBatchResult> {
    const studentProfileIds = dto.studentProfileIds ?? [];
    if (studentProfileIds.length === 0) {
      throw new BadRequestException('STUDENT_PROFILE_IDS_REQUIRED');
    }
    if (!dto.licenseTypeId) {
      throw new BadRequestException('LICENSE_TYPE_REQUIRED');
    }

    const catalog = await this.federationsClient.getFederation(tenantId, dto.federationId);
    const season = resolveSeasonFromCatalog(catalog.seasons, {
      seasonId: dto.seasonId,
      seasonName: dto.seasonName ?? dto.season,
    });
    if (!season) {
      throw new BadRequestException('LICENSE_SEASON_NOT_FOUND');
    }

    const licenseType = pickLicenseType(season.licenseTypes, dto.licenseTypeId);
    if (!licenseType || licenseType.id !== dto.licenseTypeId) {
      throw new BadRequestException('LICENSE_TYPE_NOT_FOUND');
    }

    const seasonLabel = season.seasonName;
    const validUntil = dto.validUntil ? new Date(dto.validUntil) : defaultValidUntil(seasonLabel);
    const skippedDetails: SelectedLicenseSkip[] = [];
    const uniqueIds: string[] = [];
    const seen = new Set<string>();

    for (const studentId of studentProfileIds) {
      if (seen.has(studentId)) {
        skippedDetails.push({ studentId, reason: 'DUPLICATE_STUDENT_IN_BATCH' });
        continue;
      }
      seen.add(studentId);
      uniqueIds.push(studentId);
    }

    const profiles = await this.prisma.studentProfile.findMany({
      where: { id: { in: uniqueIds } },
      include: { guardians: { include: { guardian: true } } },
    });
    const profilesById = new Map(profiles.map((profile) => [profile.id, profile]));

    const existing = await this.prisma.affiliationLicense.findMany({
      where: {
        tenantId,
        federationId: dto.federationId,
        season: seasonLabel,
        studentProfileId: { in: uniqueIds },
      },
      select: { studentProfileId: true },
    });
    const licensedProfiles = new Set(
      existing.map((row) => row.studentProfileId).filter((id): id is string => Boolean(id)),
    );

    const issuable: Array<{
      profile: StudentProfileWithGuardians;
      payerUserId: string;
      saleAmount: Prisma.Decimal;
    }> = [];

    for (const studentId of uniqueIds) {
      const profile = profilesById.get(studentId);
      if (!profile) {
        skippedDetails.push({ studentId, reason: 'STUDENT_PROFILE_NOT_FOUND' });
        continue;
      }
      if (licensedProfiles.has(studentId)) {
        skippedDetails.push({ studentId, reason: 'LICENSE_ALREADY_EXISTS_FOR_SEASON' });
        continue;
      }

      const birthYear = profile.birthDate ? profile.birthDate.getUTCFullYear() : null;
      const row = pickPriceRow(licenseType.priceRows, LicenseHolderType.STUDENT, birthYear);
      if (!row) {
        skippedDetails.push({ studentId, reason: 'LICENSE_PRICE_UNRESOLVED' });
        continue;
      }

      const { saleAmount } = priceRowAmounts(row);
      const payerUserId = this.resolveSelectedStudentPayer(profile);
      if (!payerUserId) {
        skippedDetails.push({ studentId, reason: 'PAYER_UNRESOLVED' });
        continue;
      }

      issuable.push({ profile, payerUserId, saleAmount });
    }

    if (issuable.length === 0) {
      return {
        totalProcessed: studentProfileIds.length,
        successCount: 0,
        skippedCount: skippedDetails.length,
        skippedDetails,
      };
    }

    const dueDate = validUntil.toISOString();
    const fees: MemberChargeItem[] = issuable.map((item) => ({
      payerUserId: item.payerUserId,
      studentProfileId: item.profile.id,
      amount: item.saleAmount.toFixed(2),
      concept: `Affiliation license ${licenseType.name} ${seasonLabel}`,
      seasonName: seasonLabel,
      dueDate,
    }));

    await this.federationsClient.createMemberCharges(tenantId, fees);

    await this.prisma.$transaction(
      issuable.map((item) =>
        this.prisma.affiliationLicense.create({
          data: {
            tenantId,
            studentProfileId: item.profile.id,
            holderUserId: item.profile.userId,
            holderType: LicenseHolderType.STUDENT,
            federationId: dto.federationId,
            licenseTypeId: licenseType.id,
            licenseNumber: this.generateLicenseNumber(seasonLabel),
            season: seasonLabel,
            validUntil,
            amountCharged: item.saleAmount,
            isPaid: false,
            status: AffiliationLicenseStatus.PENDING,
            payerUserId: item.payerUserId,
            isExempt: false,
            isActive: true,
          },
        }),
      ),
    );

    return {
      totalProcessed: studentProfileIds.length,
      successCount: issuable.length,
      skippedCount: skippedDetails.length,
      skippedDetails,
    };
  }

  /**
   * Resolves student or staff candidates and flags those already licensed this season.
   *
   * @param {string} tenantId - Academy key from `x-school-id`.
   * @param {PreviewLicensesDto} dto - Filters.
   * @returns {Promise<LicensePreviewHolder[]>} Candidates.
   */
  private async resolveCandidates(
    tenantId: string,
    dto: PreviewLicensesDto,
    catalog: FederationCatalog,
  ): Promise<LicensePreviewHolder[]> {
    const minAge = dto.age ?? dto.minAge;
    const maxAge = dto.age ?? dto.maxAge;
    const enrollmentDateBefore = dto.enrollmentDateBefore ? new Date(dto.enrollmentDateBefore) : undefined;
    const today = new Date();

    const existing = await this.prisma.affiliationLicense.findMany({
      where: { tenantId, federationId: dto.federationId, season: dto.season, holderType: dto.holderType },
      select: { holderUserId: true, studentProfileId: true },
    });
    const licensedUsers = new Set(existing.map((row) => row.holderUserId).filter((id): id is string => Boolean(id)));
    const licensedProfiles = new Set(
      existing.map((row) => row.studentProfileId).filter((id): id is string => Boolean(id)),
    );

    if (dto.holderType === LicenseHolderType.STUDENT) {
      return this.resolveStudents(
        licensedUsers,
        licensedProfiles,
        dto,
        catalog,
        minAge,
        maxAge,
        enrollmentDateBefore,
        today,
      );
    }

    const role =
      dto.holderType === LicenseHolderType.INSTRUCTOR ? Role.INSTRUCTOR : Role.SPORTS_TECHNICAL_DIRECTOR;
    const users = await this.usersClient.findByRoles([role]);
    return users.map((user) =>
      this.toStaffPreviewHolder(
        user,
        dto.holderType,
        licensedUsers.has(user.id),
        catalog,
        dto.season,
        dto.licenseTypeId,
      ),
    );
  }

  /**
   * Loads students (default ACTIVE; optional TRIAL/PAUSED) including minors with `userId: null`.
   * Applies discipline/enrollment/age/birth-year filters from `StudentProfile.birthDate`.
   *
   * @param {Set<string>} licensedUsers - Holder user ids already licensed this season.
   * @param {Set<string>} licensedProfiles - Student profile ids already licensed this season.
   * @param {PreviewLicensesDto} dto - Filters.
   * @param {number | undefined} minAge - Inclusive min age.
   * @param {number | undefined} maxAge - Inclusive max age.
   * @param {Date | undefined} enrollmentDateBefore - Exclusive enrollment bound.
   * @param {Date} today - Reference date.
   * @returns {Promise<LicensePreviewHolder[]>} Student candidates.
   */
  private async resolveStudents(
    licensedUsers: Set<string>,
    licensedProfiles: Set<string>,
    dto: PreviewLicensesDto,
    catalog: FederationCatalog,
    minAge: number | undefined,
    maxAge: number | undefined,
    enrollmentDateBefore: Date | undefined,
    today: Date,
  ): Promise<LicensePreviewHolder[]> {
    const statuses =
      dto.statuses && dto.statuses.length > 0
        ? dto.statuses.map((status) => status as StudentStatus)
        : [StudentStatus.ACTIVE];

    const profiles = await this.prisma.studentProfile.findMany({
      where: {
        status: { in: statuses },
        ...(enrollmentDateBefore ? { createdAt: { lt: enrollmentDateBefore } } : {}),
        ...(dto.disciplineId
          ? { ranks: { some: { beltRank: { program: { disciplineId: dto.disciplineId } } } } }
          : {}),
      },
      include: {
        ranks: { include: { beltRank: { include: { program: true } } } },
        guardians: { include: { guardian: true } },
      },
    });

    const loginIds = profiles.map((profile) => profile.userId).filter((id): id is string => Boolean(id));
    const users = await this.usersClient.findManyByIds(loginIds);

    return profiles
      .filter((profile) => matchesEnrollmentFilter(profile.createdAt, enrollmentDateBefore))
      .filter((profile) => matchesAgeFilter(profile.birthDate, minAge, maxAge, today))
      .filter((profile) => matchesBirthYearFilter(profile.birthDate, dto.birthYearFrom, dto.birthYearTo))
      .map((profile) => {
        const user = profile.userId ? users.get(profile.userId) : undefined;
        const alreadyLicensed =
          licensedProfiles.has(profile.id) || (profile.userId ? licensedUsers.has(profile.userId) : false);
        const age = profile.birthDate ? ageInYearsSafe(profile.birthDate, today) : null;
        const birthYear = profile.birthDate ? profile.birthDate.getUTCFullYear() : null;
        const season = resolveSeasonCatalog(catalog.seasons, dto.season);
        const licenseType = pickLicenseType(season?.licenseTypes ?? [], dto.licenseTypeId);
        return {
          holderUserId: profile.userId,
          studentProfileId: profile.id,
          holderType: LicenseHolderType.STUDENT,
          firstName: profile.firstName || user?.firstName || '',
          lastName: profile.lastName || user?.lastName || '',
          email: user?.email ?? '',
          age,
          birthYear,
          alreadyLicensed,
          payerUserId: this.resolveStudentPayer(profile, today),
          suggestedLicenseTypeId: licenseType?.id ?? null,
          suggestedLicenseTypeName: licenseType?.name ?? null,
        };
      });
  }

  /**
   * Selected-student batch: adults pay themselves (`userId`); minors have no User
   * and use the first linked `StudentGuardian.guardian.userId`.
   *
   * @param {StudentProfileWithGuardians} profile - Profile plus guardians.
   * @returns {string | null} Payer user id, or null when unresolved.
   */
  private resolveSelectedStudentPayer(profile: StudentProfileWithGuardians): string | null {
    if (profile.userId) {
      return profile.userId;
    }
    return profile.guardians?.[0]?.guardian.userId ?? null;
  }

  /**
   * Adult students pay themselves; minors use the first linked guardian `userId` (mandate owner).
   *
   * @param {StudentProfileCandidate} profile - Profile plus guardians.
   * @param {Date} today - Reference date.
   * @returns {string | null} Payer user id, or null when unresolved.
   */
  private resolveStudentPayer(profile: StudentProfileCandidate, today: Date): string | null {
    if (!isMinor(profile.birthDate, profile.userId, today) && profile.userId) {
      return profile.userId;
    }
    return profile.guardians?.[0]?.guardian.userId ?? null;
  }

  /**
   * Instructors/directors are exempt unless `chargeStaff` is set. Designated student profiles are always exempt.
   *
   * @param {LicensePreviewHolder} holder - Candidate.
   * @param {Set<string>} exemptProfiles - Explicit student exemptions.
   * @param {boolean} chargeStaff - When true, staff are billed.
   * @returns {boolean} Whether the license is issued at zero sale.
   */
  private isExemptHolder(holder: LicensePreviewHolder, exemptProfiles: Set<string>, chargeStaff: boolean): boolean {
    if (holder.studentProfileId && exemptProfiles.has(holder.studentProfileId)) {
      return true;
    }
    if (holder.holderType === LicenseHolderType.INSTRUCTOR || holder.holderType === LicenseHolderType.TECHNICAL_DIRECTOR) {
      return !chargeStaff;
    }
    return false;
  }

  /**
   * @param {boolean} exempt - Zero-charge issuance.
   * @param {boolean} isPaid - Staff marked the sale as collected.
   * @param {string | null} payerUserId - Resolved payer.
   * @param {LicenseHolderType} holderType - Holder kind.
   * @returns {AffiliationLicenseStatus} Initial status.
   */
  private initialStatus(
    exempt: boolean,
    isPaid: boolean,
    payerUserId: string | null,
    holderType: LicenseHolderType,
  ): AffiliationLicenseStatus {
    if (exempt) {
      return AffiliationLicenseStatus.EXEMPT;
    }
    if (holderType === LicenseHolderType.STUDENT && !payerUserId) {
      return AffiliationLicenseStatus.FAILED;
    }
    if (isPaid) {
      return AffiliationLicenseStatus.PAID;
    }
    return AffiliationLicenseStatus.PENDING;
  }

  /**
   * Registers charges in financial-service. On failure, marks the issued licenses FAILED.
   *
   * @param {string} tenantId - Academy key.
   * @param {string} federationId - Federation UUID.
   * @param {string} season - Season label.
   * @param {FederationChargeHolder[]} holders - Non-exempt issued rows.
   * @param {boolean} includeClubFee - Persist club cost.
   * @param {string[]} createdIds - Academic license ids created in this batch.
   * @returns {Promise<number>} `created` count from financial-service, or 0 on failure.
   */
  private async registerChargesOrMarkFailed(
    tenantId: string,
    federationId: string,
    season: string,
    holders: FederationChargeHolder[],
    includeClubFee: boolean,
    createdIds: string[],
  ): Promise<number> {
    try {
      const result = await this.federationsClient.registerCharges(
        tenantId,
        federationId,
        season,
        holders,
        includeClubFee,
      );
      return result.created;
    } catch (error) {
      this.logger.error(
        `Federation charge registration failed: ${error instanceof Error ? error.message : String(error)}`,
      );
      if (createdIds.length > 0) {
        await this.prisma.affiliationLicense.updateMany({
          where: { id: { in: createdIds }, isExempt: false },
          data: { status: AffiliationLicenseStatus.FAILED },
        });
      }
      return 0;
    }
  }

  /**
   * @param {string} tenantId - Tenant key.
   * @param {IssueLicenseDto} dto - Issue payload.
   * @returns {Prisma.AffiliationLicenseUncheckedCreateInput} Persistence payload.
   */
  private buildLicenseData(tenantId: string, dto: IssueLicenseDto): Prisma.AffiliationLicenseUncheckedCreateInput {
    const exempt = dto.isExempt === true;
    const amountCharged = exempt ? ZERO : new Prisma.Decimal(dto.amountCharged ?? '0.00');
    const status = exempt
      ? AffiliationLicenseStatus.EXEMPT
      : dto.isPaid
        ? AffiliationLicenseStatus.PAID
        : AffiliationLicenseStatus.PENDING;
    return {
      tenantId,
      studentProfileId: dto.studentProfileId ?? null,
      holderUserId: dto.holderUserId ?? null,
      holderType: dto.holderType,
      federationId: dto.federationId,
      licenseTypeId: dto.licenseTypeId ?? null,
      licenseNumber: dto.licenseNumber?.trim() || this.generateLicenseNumber(dto.season),
      season: dto.season,
      validUntil: dto.validUntil ? new Date(dto.validUntil) : defaultValidUntil(dto.season),
      amountCharged,
      isPaid: status === AffiliationLicenseStatus.PAID || status === AffiliationLicenseStatus.EXEMPT,
      status,
      payerUserId: dto.payerUserId ?? dto.holderUserId ?? null,
      isExempt: exempt,
      isActive: true,
    };
  }

  /**
   * @param {string} season - Season label.
   * @returns {string} Unique license number.
   */
  private generateLicenseNumber(season: string): string {
    return `LIC-${season.replace('-', '')}-${randomUUID().slice(0, 8).toUpperCase()}`;
  }

  /**
   * @param {UserSummary} user - Staff identity.
   * @param {LicenseHolderType} holderType - Instructor or technical director.
   * @param {boolean} alreadyLicensed - Whether a row exists for this season.
   * @param {FederationCatalog} catalog - Financial catalog.
   * @param {string} seasonName - Requested season label.
   * @param {string} [preferredTypeId] - Explicit license type.
   * @returns {LicensePreviewHolder} Preview row.
   */
  private toStaffPreviewHolder(
    user: UserSummary,
    holderType: LicenseHolderType,
    alreadyLicensed: boolean,
    catalog: FederationCatalog,
    seasonName: string,
    preferredTypeId?: string,
  ): LicensePreviewHolder {
    const season = resolveSeasonCatalog(catalog.seasons, seasonName);
    const licenseType = pickLicenseType(season?.licenseTypes ?? [], preferredTypeId);
    return {
      holderUserId: user.id,
      studentProfileId: null,
      holderType,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      age: null,
      birthYear: null,
      alreadyLicensed,
      payerUserId: user.id,
      suggestedLicenseTypeId: licenseType?.id ?? null,
      suggestedLicenseTypeName: licenseType?.name ?? null,
    };
  }

  /**
   * Merges auth identities onto license rows. Minors have no User; `holder` stays null.
   *
   * @param {Array<{ holderUserId: string | null }>} rows - License records.
   * @returns {Promise<object[]>} Rows plus `holder`.
   */
  private async withIdentities<
    T extends { holderUserId: string | null; studentProfileId?: string | null },
  >(rows: T[]) {
    const users = await this.usersClient.findManyByIds(rows.map((row) => row.holderUserId));
    const profileIds = [
      ...new Set(rows.map((row) => row.studentProfileId).filter((id): id is string => Boolean(id))),
    ];
    const profiles =
      profileIds.length === 0
        ? []
        : await this.prisma.studentProfile.findMany({
            where: { id: { in: profileIds } },
            select: { id: true, firstName: true, lastName: true },
          });
    const profileById = new Map(profiles.map((profile) => [profile.id, profile]));

    return rows.map((row) => {
      const user = row.holderUserId ? users.get(row.holderUserId) ?? null : null;
      const student = row.studentProfileId ? profileById.get(row.studentProfileId) ?? null : null;
      const firstName = student?.firstName || user?.firstName || '';
      const lastName = student?.lastName || user?.lastName || '';
      return {
        ...row,
        amountCharged:
          'amountCharged' in row && row.amountCharged instanceof Prisma.Decimal
            ? row.amountCharged.toFixed(2)
            : undefined,
        student: student ? { id: student.id, firstName: student.firstName, lastName: student.lastName } : null,
        holder:
          firstName || lastName || user
            ? {
                id: user?.id ?? student?.id ?? row.holderUserId ?? row.studentProfileId ?? '',
                firstName,
                lastName,
                email: user?.email ?? '',
              }
            : null,
        expiringSoon:
          'validUntil' in row && row.validUntil instanceof Date
            ? row.validUntil.getTime() - Date.now() <= EXPIRING_WINDOW_MS && row.validUntil.getTime() >= Date.now()
            : false,
      };
    });
  }
}

/**
 * Age helper that never throws on invalid dates.
 *
 * @param {Date} birthDate - Birth date.
 * @param {Date} today - Reference date.
 * @returns {number | null} Age in years.
 */
function ageInYearsSafe(birthDate: Date, today: Date): number | null {
  if (Number.isNaN(birthDate.getTime())) {
    return null;
  }
  return ageInYears(birthDate, today);
}
