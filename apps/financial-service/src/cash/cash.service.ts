import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OpenCashSessionDto } from './dto/open-cash-session.dto';
import { CloseCashSessionDto } from './dto/close-cash-session.dto';
import { CreateCashTransactionDto } from './dto/create-cash-transaction.dto';
import { CashMovementType } from '@dms/shared-types';
import { Prisma } from '@dms/database/client';

/**
 * @file cash.service.ts
 * @description Business logic for cash register sessions, transaction management, and retroactive audit corrections.
 */
@Injectable()
export class CashService {
  /**
   * @param {PrismaService} prisma - Financial-domain Prisma client.
   */
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Opens a cash session when none is currently `OPEN`.
   *
   * @param {OpenCashSessionDto} dto - Opening float and optional notes.
   * @param {string} userId - Operator recorded as `openedById`.
   * @returns {Promise<object>} The created session.
   * @throws {BadRequestException} If another session is already open (`CASH_SESSION_ALREADY_OPEN`).
   */
  async openSession(dto: OpenCashSessionDto, userId: string) {
    const activeSession = await this.prisma.cashRegisterSession.findFirst({
      where: { status: 'OPEN' },
    });

    if (activeSession) {
      throw new BadRequestException('CASH_SESSION_ALREADY_OPEN');
    }

    return this.prisma.cashRegisterSession.create({
      data: {
        openedById: userId,
        initialBalance: dto.openingFloat,
        notes: dto.notes,
        status: 'OPEN',
      },
    });
  }

  /**
   * Closes an open session using `Prisma.Decimal` arithmetic (never JS `number`).
   *
   * @param {string} sessionId - Session UUID.
   * @param {CloseCashSessionDto} dto - Counted closing balance and optional notes.
   * @param {string} userId - Operator recorded as `closedById`.
   * @returns {Promise<object>} Closed session plus income, expense, expected balance, and discrepancy.
   * @throws {NotFoundException} If the session is missing or not `OPEN`.
   */
  async closeSession(sessionId: string, dto: CloseCashSessionDto, userId: string) {
    const session = await this.prisma.cashRegisterSession.findUnique({
      where: { id: sessionId },
      include: { transactions: true },
    });

    if (!session || session.status !== 'OPEN') {
      throw new NotFoundException('OPEN_CASH_SESSION_NOT_FOUND');
    }

    let totalIncomes = new Prisma.Decimal(0);
    let totalExpenses = new Prisma.Decimal(0);

    for (const tx of session.transactions) {
      if (tx.type === CashMovementType.INCOME) {
        totalIncomes = totalIncomes.plus(tx.amount);
      } else {
        totalExpenses = totalExpenses.plus(tx.amount);
      }
    }

    const expectedBalance = session.initialBalance.plus(totalIncomes).minus(totalExpenses);
    const discrepancy = new Prisma.Decimal(dto.closingBalance).minus(expectedBalance);

    const closedSession = await this.prisma.cashRegisterSession.update({
      where: { id: sessionId },
      data: {
        closedById: userId,
        actualClosingBalance: dto.closingBalance,
        expectedClosingBalance: expectedBalance,
        discrepancy,
        closingDate: new Date(),
        status: 'CLOSED',
        notes: dto.notes ? `${session.notes || ''} | Closing note: ${dto.notes}` : session.notes,
      },
    });

    return { ...closedSession, summary: { totalIncomes, totalExpenses, expectedBalance, discrepancy } };
  }

  /**
   * Persists a cash movement. Posting onto a closed session appends an audit note.
   *
   * @param {CreateCashTransactionDto} dto - Movement payload.
   * @param {string} userId - Operator recorded as `recordedById`.
   * @returns {Promise<object>} The persisted transaction.
   * @throws {NotFoundException} If the referenced session does not exist.
   */
  async createTransaction(dto: CreateCashTransactionDto, userId: string) {
    const session = await this.prisma.cashRegisterSession.findUnique({
      where: { id: dto.cashSessionId },
    });

    if (!session) {
      throw new NotFoundException('CASH_SESSION_NOT_FOUND');
    }

    const transaction = await this.prisma.cashTransaction.create({
      data: {
        sessionId: dto.cashSessionId,
        type: dto.type,
        category: dto.category,
        paymentMethod: dto.paymentMethod,
        amount: dto.amount,
        description: dto.description,
        studentProfileId: dto.studentProfileId,
        recordedById: userId,
      },
    });

    if (session.status === 'CLOSED') {
      await this.prisma.cashRegisterSession.update({
        where: { id: session.id },
        data: {
          notes: `${session.notes || ''} [Audit: Retroactive transaction added on ${new Date().toISOString()}]`,
        },
      });
    }

    return transaction;
  }

  /**
   * Overwrites mutable fields of an existing cash movement.
   *
   * @param {string} transactionId - Transaction UUID.
   * @param {Partial<CreateCashTransactionDto>} dto - Fields to apply.
   * @returns {Promise<object>} The updated transaction.
   * @throws {NotFoundException} If the transaction does not exist.
   */
  async updateTransaction(transactionId: string, dto: Partial<CreateCashTransactionDto>) {
    const tx = await this.prisma.cashTransaction.findUnique({
      where: { id: transactionId },
    });

    if (!tx) {
      throw new NotFoundException('CASH_TRANSACTION_NOT_FOUND');
    }

    return this.prisma.cashTransaction.update({
      where: { id: transactionId },
      data: {
        type: dto.type,
        category: dto.category,
        paymentMethod: dto.paymentMethod,
        amount: dto.amount,
        description: dto.description,
        studentProfileId: dto.studentProfileId,
      },
    });
  }

  /**
   * Hard-deletes a cash movement after confirming it exists.
   *
   * @param {string} transactionId - Transaction UUID.
   * @returns {Promise<{ message: string; deletedId: string }>} Confirmation payload.
   * @throws {NotFoundException} If the transaction does not exist.
   */
  async deleteTransaction(transactionId: string) {
    const tx = await this.prisma.cashTransaction.findUnique({
      where: { id: transactionId },
    });

    if (!tx) {
      throw new NotFoundException('CASH_TRANSACTION_NOT_FOUND');
    }

    await this.prisma.cashTransaction.delete({
      where: { id: transactionId },
    });

    return { message: 'Cash transaction successfully deleted.', deletedId: transactionId };
  }
}