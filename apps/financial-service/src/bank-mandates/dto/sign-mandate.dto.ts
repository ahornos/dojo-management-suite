/**
 * @file sign-mandate.dto.ts
 * @description Clickwrap consent for `PATCH /financial/mandates/:id/sign`.
 * Signer identity and IP are taken from the JWT and gateway headers, never from this body.
 */

import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsBoolean } from 'class-validator';

/**
 * Explicit acceptance of the on-screen SEPA Direct Debit legal terms.
 */
export class SignMandateDto {
  @ApiProperty({ description: 'Must be true: the signer ticked the on-screen consent checkbox.', example: true })
  @IsBoolean()
  @Equals(true)
  accepted: boolean;
}
