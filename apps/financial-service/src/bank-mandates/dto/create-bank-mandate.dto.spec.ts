/**
 * @file create-bank-mandate.dto.spec.ts
 * @description ValidationPipe-equivalent checks for CreateBankMandateDto (transform + class-validator).
 */

import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateBankMandateDto } from './create-bank-mandate.dto';

/**
 * Transforms a plain payload into the DTO and runs class-validator (same order as Nest `ValidationPipe`).
 *
 * @param {Record<string, unknown>} plain - Raw JSON body.
 * @returns {Promise<string[]>} Flattened constraint messages.
 */
async function messagesOf(plain: Record<string, unknown>): Promise<string[]> {
  const instance = plainToInstance(CreateBankMandateDto, plain);
  const errors = await validate(instance);
  return errors.flatMap((error) => Object.values(error.constraints ?? {}));
}

const valid = {
  payerUserId: '22222222-2222-4222-8222-222222222222',
  iban: 'ES9121000418450200051332',
  accountHolderName: 'Ana Garcia',
  accountHolderDni: '12345678Z',
};

describe('CreateBankMandateDto', () => {
  it('accepts a compact valid IBAN without a client-supplied mandateReference', async () => {
    expect(await messagesOf(valid)).toEqual([]);
  });

  it('strips IBAN spaces before @IsIBAN()', async () => {
    const instance = plainToInstance(CreateBankMandateDto, {
      ...valid,
      iban: 'ES91 2100 0418 4502 0005 1332',
    });
    expect(instance.iban).toBe('ES9121000418450200051332');
    expect(await messagesOf({ ...valid, iban: 'ES91 2100 0418 4502 0005 1332' })).toEqual([]);
  });

  it('strips hyphens before @IsIBAN()', async () => {
    expect(await messagesOf({ ...valid, iban: 'ES91-2100-0418-4502-0005-1332' })).toEqual([]);
  });

  it('accepts a 20-digit Spanish CCC and wraps it as an ES IBAN', async () => {
    const instance = plainToInstance(CreateBankMandateDto, {
      ...valid,
      iban: '2100 0418 4502 0005 1332',
    });
    expect(instance.iban).toBe('ES9121000418450200051332');
    expect(await messagesOf({ ...valid, iban: '2100 0418 4502 0005 1332' })).toEqual([]);
  });

  it('treats an empty bic string as omitted', async () => {
    expect(await messagesOf({ ...valid, bic: '' })).toEqual([]);
  });

  it('rejects a checksum-invalid IBAN', async () => {
    const messages = await messagesOf({ ...valid, iban: 'ES0000000000000000000000' });
    expect(messages.some((message) => /iban/i.test(message))).toBe(true);
  });

  it('rejects a missing accountHolderDni', async () => {
    const messages = await messagesOf({
      payerUserId: valid.payerUserId,
      iban: valid.iban,
      accountHolderName: valid.accountHolderName,
    });
    expect(messages.some((message) => /accountHolderDni/i.test(message) || /empty/i.test(message))).toBe(true);
  });
});
