import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Discipline } from '@dms/database';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    await this.seedInitialDiscipline();
  }

  getHello(): string {
    return 'Academic Service is running!';
  }

  async getDisciplines(): Promise<Discipline[]> {
    return this.prisma.discipline.findMany();
  }

  private async seedInitialDiscipline() {
    const existingBjj = await this.prisma.discipline.findUnique({
      where: { name: 'BJJ' },
    });

    if (!existingBjj) {
      await this.prisma.discipline.create({
        data: {
          name: 'BJJ',
          description: 'Brazilian Jiu-Jitsu',
        },
      });
      console.log('Seeded initial discipline: BJJ');
    }
  }
}