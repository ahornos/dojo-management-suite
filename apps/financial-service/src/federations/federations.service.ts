/**
 * @file federations.service.ts
 * @description Tenant-scoped federation identity, tagged contacts, seasonal pricing matrices, and payout budgets.
 */

import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { LicenseHolderType, Prisma } from '@dms/database/client';
import { Role } from '@dms/shared-types';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFederationDto } from './dto/create-federation.dto';
import { UpdateFederationDto } from './dto/update-federation.dto';
import { BatchFederationChargesDto } from './dto/batch-federation-charges.dto';
import { PreviewFederationBudgetDto } from './dto/preview-federation-budget.dto';
import { FederationContactDto } from './dto/federation-contact.dto';
import { FederationSeasonDto } from './dto/federation-season.dto';
import { FederationListQueryDto, FederationListStatus } from './dto/federation-list-query.dto';
import { FederationDeleteMode } from './dto/delete-federation-query.dto';
import { calculateFederationBudget } from './federation-budget';
import {
  CATALOG_INCLUDE,
  contactCreateData,
  ensurePriceRows,
  FederationCatalogRow,
  FederationContactResponse,
  FederationSeasonResponse,
  firstActiveLicenseType,
  netTotal,
  pickPriceRow,
  priceRowCreateData,
  resolveSeason,
  seasonNestedCreate,
  toContactResponse,
  toSeasonResponse,
} from './federation-catalog';
import { decimalToString, toDecimal } from './money';

/**
 * JSON-safe federation catalog row (decimals as strings).
 */
export interface FederationResponse {
  id: string;
  tenantId: string;
  name: string;
  acronym: string;
  country: string;
  email: string;
  isActive: boolean;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  contacts: FederationContactResponse[];
  seasons: FederationSeasonResponse[];
}

/** Options for catalog lookups that may include soft-deleted rows. */
export interface FederationLookupOptions {
  includeDeleted?: boolean;
}

/**
 * Financial owner of federation catalogs and seasonal charge/budget calculations.
 */
@Injectable()
export class FederationsService {
  /**
   * @param {PrismaService} prisma - Database access limited to the financial domain.
   */
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Creates a federation catalog entry for this tenant.
   *
   * @param {string} tenantId - Academy key from `x-school-id`.
   * @param {CreateFederationDto} dto - Identity, contacts, and seasons.
   * @returns {Promise<FederationResponse>} Persisted catalog row.
   * @throws {ConflictException} If the tenant already has this federation name.
   */
  async create(tenantId: string, dto: CreateFederationDto): Promise<FederationResponse> {
    this.assertSeasons(dto.seasons);
    try {
      const created = await this.prisma.$transaction(async (tx) => {
        const contacts = dto.contacts ?? [];
        const row = await tx.federation.create({
          data: {
            tenantId,
            name: dto.name,
            acronym: dto.acronym?.trim() ?? '',
            country: dto.country || 'ES',
            email: dto.email,
            contacts: contacts.length ? { create: contacts.map(contactCreateData) } : undefined,
            seasons: dto.seasons?.length ? { create: dto.seasons.map(seasonNestedCreate) } : undefined,
          },
          include: CATALOG_INCLUDE,
        });
        return this.loadCatalog(tx, tenantId, row.id);
      });
      return this.toResponse(created);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('FEDERATION_NAME_ALREADY_EXISTS');
      }
      throw error;
    }
  }

  /**
   * Lists federations of this tenant. Soft-deleted rows are hidden unless `status=DELETED`.
   *
   * @param {string} tenantId - Academy key from `x-school-id`.
   * @param {FederationListQueryDto} [query] - Search and lifecycle filter.
   * @param {Role[]} [roles] - Caller roles (DELETED filter requires SUPER_ADMIN).
   * @returns {Promise<FederationResponse[]>} Catalog rows.
   * @throws {ForbiddenException} When a non-super-admin requests deleted rows.
   */
  async findAll(
    tenantId: string,
    query: FederationListQueryDto = {},
    roles: Role[] = [],
  ): Promise<FederationResponse[]> {
    const where = this.listWhere(tenantId, query, roles);
    const rows = await this.prisma.federation.findMany({
      where,
      include: CATALOG_INCLUDE,
      orderBy: { name: 'asc' },
    });
    return rows.map((row) => this.toResponse(row));
  }

  /**
   * Loads one federation of this tenant with contacts and seasons.
   *
   * @param {string} tenantId - Academy key from `x-school-id`.
   * @param {string} id - Federation UUID.
   * @param {FederationLookupOptions} [options] - Whether to include soft-deleted rows.
   * @returns {Promise<FederationCatalogRow>} Persisted row.
   * @throws {NotFoundException} If missing, owned by another tenant, or hidden as deleted.
   */
  async findOneOrThrow(
    tenantId: string,
    id: string,
    options: FederationLookupOptions = {},
  ): Promise<FederationCatalogRow> {
    return this.loadCatalog(this.prisma, tenantId, id, options);
  }

  /**
   * Returns one federation as a JSON-safe catalog row.
   *
   * @param {string} tenantId - Academy key from `x-school-id`.
   * @param {string} id - Federation UUID.
   * @param {FederationLookupOptions} [options] - Whether to include soft-deleted rows.
   * @returns {Promise<FederationResponse>} Catalog row.
   */
  async findOne(
    tenantId: string,
    id: string,
    options: FederationLookupOptions = {},
  ): Promise<FederationResponse> {
    return this.toResponse(await this.findOneOrThrow(tenantId, id, options));
  }

  /**
   * Seasonal pricing matrices grouped by season (quick-reference payload).
   *
   * @param {string} tenantId - Academy key from `x-school-id`.
   * @param {string} id - Federation UUID.
   * @param {FederationLookupOptions} [options] - Whether to include soft-deleted rows.
   * @returns {Promise<{ federationId: string; seasons: FederationSeasonResponse[] }>} Price list.
   */
  async getPriceList(
    tenantId: string,
    id: string,
    options: FederationLookupOptions = {},
  ): Promise<{ federationId: string; seasons: FederationSeasonResponse[] }> {
    const row = await this.findOneOrThrow(tenantId, id, options);
    return { federationId: row.id, seasons: row.seasons.map(toSeasonResponse) };
  }

  /**
   * Updates identity, contacts, and/or seasonal pricing matrices.
   *
   * @param {string} tenantId - Academy key from `x-school-id`.
   * @param {string} id - Federation UUID.
   * @param {UpdateFederationDto} dto - Partial fields.
   * @returns {Promise<FederationResponse>} Updated row.
   */
  async update(tenantId: string, id: string, dto: UpdateFederationDto): Promise<FederationResponse> {
    this.assertNotDeleted(await this.findOneOrThrow(tenantId, id));
    this.assertSeasons(dto.seasons);
    try {
      const updated = await this.prisma.$transaction(async (tx) => {
        await tx.federation.update({ where: { id }, data: this.scalarUpdateData(dto) });
        if (dto.contacts) {
          await this.replaceContacts(tx, id, dto.contacts);
        }
        if (dto.seasons) {
          await this.replaceSeasons(tx, id, dto.seasons);
        }
        return this.loadCatalog(tx, tenantId, id);
      });
      return this.toResponse(updated);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('FEDERATION_NAME_ALREADY_EXISTS');
      }
      throw error;
    }
  }

  /**
   * Marks a live federation inactive. Does not soft-delete the row.
   *
   * @param {string} tenantId - Academy key from `x-school-id`.
   * @param {string} id - Federation UUID.
   * @returns {Promise<FederationResponse>} Updated row.
   * @throws {BadRequestException} When the federation is already soft-deleted.
   */
  async deactivate(tenantId: string, id: string): Promise<FederationResponse> {
    const current = await this.findOneOrThrow(tenantId, id);
    this.assertNotDeleted(current);
    const updated = await this.prisma.federation.update({
      where: { id },
      data: { isActive: false },
      include: CATALOG_INCLUDE,
    });
    return this.toResponse(updated);
  }

  /**
   * Marks a live federation active again.
   *
   * @param {string} tenantId - Academy key from `x-school-id`.
   * @param {string} id - Federation UUID.
   * @returns {Promise<FederationResponse>} Updated row.
   * @throws {BadRequestException} When the federation is soft-deleted.
   */
  async activate(tenantId: string, id: string): Promise<FederationResponse> {
    const current = await this.findOneOrThrow(tenantId, id);
    this.assertNotDeleted(current);
    const updated = await this.prisma.federation.update({
      where: { id },
      data: { isActive: true },
      include: CATALOG_INCLUDE,
    });
    return this.toResponse(updated);
  }

  /**
   * SUPER_ADMIN delete: hide the row (`soft`) or cascade-wipe it (`hard`).
   *
   * @param {string} tenantId - Academy key from `x-school-id`.
   * @param {string} id - Federation UUID.
   * @param {FederationDeleteMode} [mode='soft'] - Soft vs hard.
   * @param {Role[]} roles - Caller roles.
   * @returns {Promise<FederationResponse | { deleted: true; id: string }>} Soft-deleted row or wipe ack.
   * @throws {ForbiddenException} When the caller is not SUPER_ADMIN.
   */
  async remove(
    tenantId: string,
    id: string,
    mode: FederationDeleteMode = 'soft',
    roles: Role[] = [],
  ): Promise<FederationResponse | { deleted: true; id: string }> {
    if (!roles.includes(Role.SUPER_ADMIN)) {
      throw new ForbiddenException('FEDERATION_DELETE_FORBIDDEN');
    }
    return mode === 'hard' ? this.hardDelete(tenantId, id) : this.softDelete(tenantId, id);
  }

  /**
   * Sets `deletedAt` and deactivates the catalog row. Name can be reused afterwards.
   *
   * @param {string} tenantId - Academy key from `x-school-id`.
   * @param {string} id - Federation UUID.
   * @returns {Promise<FederationResponse>} Hidden row.
   */
  async softDelete(tenantId: string, id: string): Promise<FederationResponse> {
    const current = await this.findOneOrThrow(tenantId, id, { includeDeleted: true });
    if (current.deletedAt) {
      return this.toResponse(current);
    }
    const updated = await this.prisma.federation.update({
      where: { id },
      data: { deletedAt: new Date(), isActive: false },
      include: CATALOG_INCLUDE,
    });
    return this.toResponse(updated);
  }

  /**
   * Permanently removes the federation and cascaded contacts, seasons, types, rows, and charges.
   *
   * @param {string} tenantId - Academy key from `x-school-id`.
   * @param {string} id - Federation UUID.
   * @returns {Promise<{ deleted: true; id: string }>} Wipe acknowledgement.
   */
  async hardDelete(tenantId: string, id: string): Promise<{ deleted: true; id: string }> {
    await this.findOneOrThrow(tenantId, id, { includeDeleted: true });
    await this.prisma.federation.delete({ where: { id } });
    return { deleted: true, id };
  }

  /**
   * Replaces every tagged contact.
   *
   * @param {string} tenantId - Academy key from `x-school-id`.
   * @param {string} federationId - Federation UUID.
   * @param {FederationContactDto[]} contacts - Full contact list.
   * @returns {Promise<FederationResponse>} Updated catalog.
   */
  async replaceContactList(
    tenantId: string,
    federationId: string,
    contacts: FederationContactDto[],
  ): Promise<FederationResponse> {
    this.assertNotDeleted(await this.findOneOrThrow(tenantId, federationId));
    const updated = await this.prisma.$transaction(async (tx) => {
      await this.replaceContacts(tx, federationId, contacts);
      return this.loadCatalog(tx, tenantId, federationId);
    });
    return this.toResponse(updated);
  }

  /**
   * Updates one tagged contact.
   *
   * @param {string} tenantId - Academy key from `x-school-id`.
   * @param {string} federationId - Federation UUID.
   * @param {string} contactId - Contact UUID.
   * @param {FederationContactDto} dto - New values.
   * @returns {Promise<FederationResponse>} Updated catalog.
   */
  async updateContact(
    tenantId: string,
    federationId: string,
    contactId: string,
    dto: FederationContactDto,
  ): Promise<FederationResponse> {
    const federation = await this.findOneOrThrow(tenantId, federationId);
    const existing = federation.contacts.find((row) => row.id === contactId);
    if (!existing) {
      throw new NotFoundException('FEDERATION_CONTACT_NOT_FOUND');
    }
    const next = federation.contacts.map((row) =>
      row.id === contactId ? { ...dto, id: contactId } : this.contactToDto(row),
    );
    return this.replaceContactList(tenantId, federationId, next);
  }

  /**
   * Removes one tagged contact.
   *
   * @param {string} tenantId - Academy key from `x-school-id`.
   * @param {string} federationId - Federation UUID.
   * @param {string} contactId - Contact UUID.
   * @returns {Promise<FederationResponse>} Updated catalog.
   */
  async removeContact(tenantId: string, federationId: string, contactId: string): Promise<FederationResponse> {
    const federation = await this.findOneOrThrow(tenantId, federationId);
    if (!federation.contacts.some((row) => row.id === contactId)) {
      throw new NotFoundException('FEDERATION_CONTACT_NOT_FOUND');
    }
    const next = federation.contacts.filter((row) => row.id !== contactId).map((row) => this.contactToDto(row));
    return this.replaceContactList(tenantId, federationId, next);
  }

  /**
   * Persists seasonal charges for the given holders using the matching season matrix.
   *
   * @param {string} tenantId - Academy key from `x-school-id`.
   * @param {string} federationId - Federation UUID.
   * @param {BatchFederationChargesDto} dto - Season, holders, and optional club fee.
   * @returns {Promise<{ created: number; skipped: number }>} Insert vs already-charged counts.
   */
  async createCharges(
    tenantId: string,
    federationId: string,
    dto: BatchFederationChargesDto,
  ): Promise<{ created: number; skipped: number }> {
    const federation = await this.findOneOrThrow(tenantId, federationId);
    this.assertNotDeleted(federation);
    const season = resolveSeason(federation, dto.season);
    const licenseType = firstActiveLicenseType(season);

    const rows: Prisma.FederationSeasonChargeCreateManyInput[] = dto.holders.map((holder) => {
      const catalog = this.pricesFor(licenseType, holder.holderType);
      return {
        tenantId,
        federationId,
        season: dto.season,
        holderType: holder.holderType,
        holderUserId: holder.holderUserId,
        studentProfileId: holder.studentProfileId ?? null,
        licenseId: holder.licenseId ?? null,
        costAmount: holder.costAmount ? toDecimal(holder.costAmount) : catalog.costAmount,
        saleAmount: holder.saleAmount ? toDecimal(holder.saleAmount) : catalog.saleAmount,
      };
    });

    if (dto.includeClubFee) {
      rows.push({
        tenantId,
        federationId,
        season: dto.season,
        holderType: LicenseHolderType.CLUB,
        holderUserId: null,
        studentProfileId: null,
        licenseId: null,
        costAmount: season?.clubCost ?? ZERO,
        saleAmount: ZERO,
      });
    }

    if (rows.length === 0) {
      return { created: 0, skipped: 0 };
    }

    const result = await this.prisma.federationSeasonCharge.createMany({
      data: rows,
      skipDuplicates: true,
    });

    return { created: result.count, skipped: rows.length - result.count };
  }

  /**
   * Projects a payout from catalog prices and holder counts (no database charge rows required).
   *
   * @param {string} tenantId - Academy key from `x-school-id`.
   * @param {string} federationId - Federation UUID.
   * @param {PreviewFederationBudgetDto} dto - Season and counts.
   * @returns {Promise<object>} Decimal totals serialized as strings.
   */
  async previewBudget(tenantId: string, federationId: string, dto: PreviewFederationBudgetDto) {
    const federation = await this.findOneOrThrow(tenantId, federationId);
    this.assertNotDeleted(federation);
    return this.serializeBudget(federationId, dto.season, this.budgetFromSeason(federation, dto.season, dto));
  }

  /**
   * Builds the seasonal budget from persisted charge rows (actual issued holders).
   *
   * @param {string} tenantId - Academy key from `x-school-id`.
   * @param {string} federationId - Federation UUID.
   * @param {string} season - Season label.
   * @returns {Promise<object>} Decimal totals serialized as strings.
   */
  async getBudget(tenantId: string, federationId: string, season: string) {
    if (!season?.trim()) {
      throw new BadRequestException('INVALID_SEASON');
    }
    const federation = await this.findOneOrThrow(tenantId, federationId);
    this.assertNotDeleted(federation);
    const charges = await this.prisma.federationSeasonCharge.findMany({
      where: { tenantId, federationId, season },
    });

    return this.serializeBudget(
      federationId,
      season,
      this.budgetFromSeason(federation, season, {
        studentCount: charges.filter((row) => row.holderType === LicenseHolderType.STUDENT).length,
        instructorCount: charges.filter((row) => row.holderType === LicenseHolderType.INSTRUCTOR).length,
        technicalDirectorCount: charges.filter((row) => row.holderType === LicenseHolderType.TECHNICAL_DIRECTOR).length,
        includeClubFee: charges.some((row) => row.holderType === LicenseHolderType.CLUB),
      }),
    );
  }

  /**
   * @param {FederationCatalogRow} federation - Catalog.
   * @param {string} seasonName - Requested season.
   * @param {{ studentCount?: number; instructorCount?: number; technicalDirectorCount?: number; includeClubFee?: boolean }} counts - Holder counts.
   * @returns {ReturnType<typeof calculateFederationBudget>} Decimal breakdown.
   */
  private budgetFromSeason(
    federation: FederationCatalogRow,
    seasonName: string,
    counts: {
      studentCount?: number;
      instructorCount?: number;
      technicalDirectorCount?: number;
      includeClubFee?: boolean;
    },
  ) {
    const season = resolveSeason(federation, seasonName);
    const type = firstActiveLicenseType(season);
    const adult = type ? pickPriceRow(type.priceRows, LicenseHolderType.STUDENT) : undefined;
    const instructor = type ? pickPriceRow(type.priceRows, LicenseHolderType.INSTRUCTOR) : undefined;
    return calculateFederationBudget({
      clubFee: season?.clubCost ?? ZERO,
      studentPrice: adult ? netTotal(adult.cost, adult.reduction) : ZERO,
      instructorPrice: instructor ? netTotal(instructor.cost, instructor.reduction) : ZERO,
      technicalDirectorPrice: instructor ? netTotal(instructor.cost, instructor.reduction) : ZERO,
      studentSalePrice: adult?.chargePrice ?? ZERO,
      instructorSalePrice: instructor?.chargePrice ?? ZERO,
      studentCount: counts.studentCount ?? 0,
      instructorCount: counts.instructorCount ?? 0,
      technicalDirectorCount: counts.technicalDirectorCount ?? 0,
      includeClubFee: counts.includeClubFee ?? true,
    });
  }

  /**
   * Maps a holder type to catalog cost and sale prices.
   *
   * @param {ReturnType<typeof firstActiveLicenseType>} licenseType - Season type.
   * @param {LicenseHolderType} holderType - Person type.
   * @returns {{ costAmount: Prisma.Decimal; saleAmount: Prisma.Decimal }} Amounts.
   */
  private pricesFor(
    licenseType: ReturnType<typeof firstActiveLicenseType>,
    holderType: LicenseHolderType,
  ): { costAmount: Prisma.Decimal; saleAmount: Prisma.Decimal } {
    const row = licenseType ? pickPriceRow(licenseType.priceRows, holderType) : undefined;
    if (!row) {
      return { costAmount: ZERO, saleAmount: ZERO };
    }
    return { costAmount: netTotal(row.cost, row.reduction), saleAmount: row.chargePrice };
  }

  /**
   * @param {Prisma.TransactionClient | PrismaService} db - Prisma client or transaction.
   * @param {string} tenantId - Academy key.
   * @param {string} id - Federation UUID.
   * @param {FederationLookupOptions} [options] - Whether to include soft-deleted rows.
   * @returns {Promise<FederationCatalogRow>} Catalog with relations.
   */
  private async loadCatalog(
    db: Prisma.TransactionClient | PrismaService,
    tenantId: string,
    id: string,
    options: FederationLookupOptions = {},
  ): Promise<FederationCatalogRow> {
    const row = await db.federation.findFirst({
      where: {
        id,
        tenantId,
        ...(options.includeDeleted ? {} : { deletedAt: null }),
      },
      include: CATALOG_INCLUDE,
    });
    if (!row) {
      throw new NotFoundException('FEDERATION_NOT_FOUND');
    }
    return row;
  }

  /**
   * @param {string} tenantId - Academy key.
   * @param {FederationListQueryDto} query - Filters.
   * @param {Role[]} roles - Caller roles.
   * @returns {Prisma.FederationWhereInput} Prisma where clause.
   */
  private listWhere(tenantId: string, query: FederationListQueryDto, roles: Role[]): Prisma.FederationWhereInput {
    const status = query.status as FederationListStatus | undefined;
    const where: Prisma.FederationWhereInput = { tenantId };

    if (status === 'DELETED') {
      if (!roles.includes(Role.SUPER_ADMIN)) {
        throw new ForbiddenException('FEDERATION_DELETED_FILTER_FORBIDDEN');
      }
      where.deletedAt = { not: null };
    } else {
      where.deletedAt = null;
      if (status === 'ACTIVE') where.isActive = true;
      if (status === 'INACTIVE') where.isActive = false;
    }

    const q = query.q?.trim();
    if (q) {
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { acronym: { contains: q, mode: 'insensitive' } },
        { email: { contains: q, mode: 'insensitive' } },
        { country: { contains: q, mode: 'insensitive' } },
      ];
    }

    return where;
  }

  /**
   * @param {Pick<FederationCatalogRow, 'deletedAt'>} row - Catalog row.
   * @returns {void}
   * @throws {BadRequestException} When the federation is soft-deleted.
   */
  private assertNotDeleted(row: Pick<FederationCatalogRow, 'deletedAt'>): void {
    if (row.deletedAt) {
      throw new BadRequestException('FEDERATION_DELETED');
    }
  }

  /**
   * @param {UpdateFederationDto} dto - Partial payload.
   * @returns {Prisma.FederationUpdateInput} Scalar patch.
   */
  private scalarUpdateData(dto: UpdateFederationDto): Prisma.FederationUpdateInput {
    const data: Prisma.FederationUpdateInput = {};
    if (dto.name !== undefined) data.name = dto.name;
    if (dto.acronym !== undefined) data.acronym = dto.acronym;
    if (dto.country !== undefined) data.country = dto.country;
    if (dto.email !== undefined) data.email = dto.email;
    return data;
  }

  /**
   * @param {Prisma.TransactionClient} tx - Transaction.
   * @param {string} federationId - Federation UUID.
   * @param {FederationContactDto[]} contacts - Full replacement list.
   * @returns {Promise<void>}
   */
  private async replaceContacts(
    tx: Prisma.TransactionClient,
    federationId: string,
    contacts: FederationContactDto[],
  ): Promise<void> {
    await tx.federationContact.deleteMany({ where: { federationId } });
    if (contacts.length > 0) {
      await tx.federationContact.createMany({
        data: contacts.map((contact) => ({ federationId, ...contactCreateData(contact) })),
      });
    }
  }

  /**
   * Upserts incoming seasons and deactivates omitted ones.
   *
   * @param {Prisma.TransactionClient} tx - Transaction.
   * @param {string} federationId - Federation UUID.
   * @param {FederationSeasonDto[]} seasons - Incoming seasons.
   * @returns {Promise<void>}
   */
  private async replaceSeasons(
    tx: Prisma.TransactionClient,
    federationId: string,
    seasons: FederationSeasonDto[],
  ): Promise<void> {
    const existing = await tx.federationSeason.findMany({
      where: { federationId },
      include: { licenseTypes: { include: { priceRows: true } } },
    });
    const keptIds = new Set<string>();

    for (const dto of seasons.filter((row) => row.seasonName.trim() !== '')) {
      const match =
        (dto.id ? existing.find((row) => row.id === dto.id) : undefined) ??
        existing.find((row) => row.seasonName === dto.seasonName);

      if (match) {
        keptIds.add(match.id);
        await tx.federationSeason.update({
          where: { id: match.id },
          data: {
            seasonName: dto.seasonName,
            currency: dto.currency?.trim() || 'EUR',
            clubCost: toDecimal(dto.clubCost ?? '0.00'),
            isActive: dto.isActive ?? true,
          },
        });
        await this.replaceLicenseTypes(tx, match.id, dto.licenseTypes ?? []);
      } else {
        const created = await tx.federationSeason.create({
          data: { federationId, ...seasonNestedCreate(dto) },
        });
        keptIds.add(created.id);
      }
    }

    await tx.federationSeason.updateMany({
      where: { federationId, id: { notIn: [...keptIds] } },
      data: { isActive: false },
    });
  }

  /**
   * @param {Prisma.TransactionClient} tx - Transaction.
   * @param {string} seasonId - Season UUID.
   * @param {FederationSeasonDto['licenseTypes']} types - Incoming types.
   * @returns {Promise<void>}
   */
  private async replaceLicenseTypes(
    tx: Prisma.TransactionClient,
    seasonId: string,
    types: NonNullable<FederationSeasonDto['licenseTypes']>,
  ): Promise<void> {
    const existing = await tx.federationLicenseType.findMany({ where: { seasonId } });
    const keptIds = new Set<string>();

    for (const dto of types.filter((row) => row.name.trim() !== '')) {
      const match =
        (dto.id ? existing.find((row) => row.id === dto.id) : undefined) ??
        existing.find((row) => row.name === dto.name);
      const rows = ensurePriceRows(dto.priceRows).map((row, index) => priceRowCreateData(row, index));

      if (match) {
        keptIds.add(match.id);
        await tx.federationLicenseType.update({
          where: { id: match.id },
          data: { name: dto.name, isActive: dto.isActive ?? true },
        });
        await tx.federationLicensePriceRow.deleteMany({ where: { licenseTypeId: match.id } });
        await tx.federationLicensePriceRow.createMany({
          data: rows.map((row) => ({ licenseTypeId: match.id, ...row })),
        });
      } else {
        const created = await tx.federationLicenseType.create({
          data: { seasonId, name: dto.name, isActive: dto.isActive ?? true, priceRows: { create: rows } },
        });
        keptIds.add(created.id);
      }
    }

    await tx.federationLicenseType.updateMany({
      where: { seasonId, id: { notIn: [...keptIds] } },
      data: { isActive: false },
    });
  }

  /**
   * @param {FederationSeasonDto[] | undefined} seasons - Incoming seasons.
   * @returns {void}
   * @throws {BadRequestException} When a custom row is missing label or birth year.
   */
  private assertSeasons(seasons: FederationSeasonDto[] | undefined): void {
    if (!seasons) return;
    for (const season of seasons) {
      for (const type of season.licenseTypes ?? []) {
        for (const row of type.priceRows ?? []) {
          if (row.kind === 'CUSTOM' && (!row.label?.trim() || row.birthYearFrom == null)) {
            throw new BadRequestException('LICENSE_PRICE_CUSTOM_ROW_INVALID');
          }
        }
      }
    }
  }

  /**
   * @param {FederationCatalogRow['contacts'][number]} row - Persisted contact.
   * @returns {FederationContactDto} DTO for replace-all rebuilds.
   */
  private contactToDto(row: FederationCatalogRow['contacts'][number]): FederationContactDto {
    return {
      id: row.id,
      medium: row.medium,
      value: row.value,
      tag: row.tag,
    };
  }

  /**
   * @param {FederationCatalogRow} row - Prisma federation.
   * @returns {FederationResponse} JSON-safe catalog row.
   */
  private toResponse(row: FederationCatalogRow): FederationResponse {
    return {
      id: row.id,
      tenantId: row.tenantId,
      name: row.name,
      acronym: row.acronym,
      country: row.country,
      email: row.email,
      isActive: row.isActive,
      deletedAt: row.deletedAt ?? null,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      contacts: row.contacts.map(toContactResponse),
      seasons: row.seasons.map(toSeasonResponse),
    };
  }

  /**
   * @param {string} federationId - Federation UUID.
   * @param {string} season - Season label.
   * @param {ReturnType<typeof calculateFederationBudget>} breakdown - Decimal totals.
   * @returns {object} JSON-safe budget.
   */
  private serializeBudget(
    federationId: string,
    season: string,
    breakdown: ReturnType<typeof calculateFederationBudget>,
  ) {
    return {
      federationId,
      season,
      clubFee: decimalToString(breakdown.clubFee),
      studentCount: breakdown.studentCount,
      studentCost: decimalToString(breakdown.studentCost),
      studentSale: decimalToString(breakdown.studentSale),
      instructorCount: breakdown.instructorCount,
      instructorCost: decimalToString(breakdown.instructorCost),
      instructorSale: decimalToString(breakdown.instructorSale),
      technicalDirectorCount: breakdown.technicalDirectorCount,
      technicalDirectorCost: decimalToString(breakdown.technicalDirectorCost),
      totalCost: decimalToString(breakdown.totalCost),
      totalSale: decimalToString(breakdown.totalSale),
    };
  }
}

const ZERO = new Prisma.Decimal(0);
