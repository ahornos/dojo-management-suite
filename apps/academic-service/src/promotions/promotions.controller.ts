import { Controller, Get, Post, Param } from '@nestjs/common';
import { PromotionsService } from './promotions.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PromotionParamDto } from './dto/promotion-param.dto';

@ApiTags('Promotions & Grading')
@Controller('promotions')
export class PromotionsController {
  constructor(private readonly promotionsService: PromotionsService) {}

  @Get('eligibility/:studentProfileId')
  @ApiOperation({ summary: 'Check if a student is eligible for a stripe or belt promotion' })
  @ApiResponse({ status: 200, description: 'Returns evaluation metrics for promotion.' })
  async checkEligibility(@Param() params: PromotionParamDto) {
    return this.promotionsService.evaluatePromotionEligibility(params.studentProfileId);
  }

  @Post('promote/:studentProfileId')
  @ApiOperation({ summary: 'Promote a student to the next stripe or next belt rank' })
  @ApiResponse({ status: 201, description: 'Student successfully promoted.' })
  async promoteStudent(@Param() params: PromotionParamDto) {
    return this.promotionsService.promoteStudent(params.studentProfileId);
  }
}