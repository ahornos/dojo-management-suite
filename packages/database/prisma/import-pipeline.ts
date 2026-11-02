/**
 * @file import-pipeline.ts
 * @description Headless CLI for `pnpm import:pipeline`.
 * Reads numbered production `*.csv` files from `import-data/` in 01→08 order.
 * Mock templates (`*.csv.mock`) are never imported.
 */

import { PrismaClient } from '../client';
import { createPipelineContext, formatPipelineSummary, runImportPipeline } from './pipeline-import/run-pipeline';

const prisma = new PrismaClient();

/**
 * Resolves files, upserts 01→08, and prints an audit summary.
 *
 * @returns {Promise<void>}
 */
async function main(): Promise<void> {
  const context = createPipelineContext();
  const summary = await runImportPipeline(prisma, {
    tenantId: context.tenantId,
    passwordHash: null,
    hashPassword: async () => context.resolvePasswordHash(),
  });
  console.log(formatPipelineSummary(summary));
}

main()
  .catch((error: unknown) => {
    console.error('[import-pipeline] fatal', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
