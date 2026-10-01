import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OpenCashSessionDto } from './dto/open-cash-session.dto';
import { CloseCashSessionDto } from './dto/close-cash-session.dto';
import { CreateCashTransactionDto } from './dto/create-cash-transaction.dto';
import { CashMovementType } from '@dms/shared-types';

/**
 * @file cash.service.ts
 * @description Business logic for cash register sessions, transaction management, and retroactive audit corrections.
 */
@Injectable()
export class CashService {
  constructor(private readonly prisma: PrismaService) {}

  async openSession(dto: OpenCashSessionDto, userId: string) {
    const activeSession = await this.prisma.cashRegisterSession.findFirst({
      where: { status: 'OPEN' },
    });

    if (activeSession) {
      throw new BadRequestException('There is already an open cash session. Close it before opening a new one.');
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

  async closeSession(sessionId: string, dto: CloseCashSessionDto, userId: string) {
    const session = await this.prisma.cashRegisterSession.findUnique({
      where: { id: sessionId },
      include: { transactions: true },
    });

    if (!session || session.status !== 'OPEN') {
      throw new NotFoundException('Open cash session not found.');
    }

    let totalIncomes = 0;
    let totalExpenses = 0;

    for (const tx of session.transactions) {
      if (tx.type === CashMovementType.INCOME) {
        totalIncomes += Number(tx.amount);
      } else {
        totalExpenses += Number(tx.amount);
      }
    }

    const expectedBalance = Number(session.initialBalance) + totalIncomes - totalExpenses;
    const discrepancy = Number(dto.closingBalance) - expectedBalance;

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

  async createTransaction(dto: CreateCashTransactionDto, userId: string) {
    const session = await this.prisma.cashRegisterSession.findUnique({
      where: { id: dto.cashSessionId },
    });

    if (!session) {
      throw new NotFoundException('Cash session not found.');
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

  async updateTransaction(transactionId: string, dto: Partial<CreateCashTransactionDto>) {
    const tx = await this.prisma.cashTransaction.findUnique({
      where: { id: transactionId },
    });

    if (!tx) {
      throw new NotFoundException('Cash transaction not found.');
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

  async deleteTransaction(transactionId: string) {
    const tx = await this.prisma.cashTransaction.findUnique({
      where: { id: transactionId },
    });

    if (!tx) {
      throw new NotFoundException('Cash transaction not found.');
    }

    await this.prisma.cashTransaction.delete({
      where: { id: transactionId },
    });

    return { message: 'Cash transaction successfully deleted.', deletedId: transactionId };
  }
}