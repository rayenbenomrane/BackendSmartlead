
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { InteractionsService } from './interactions.service';
import {
  CreateInteractionDto,
  UpdateInteractionDto,
} from './interactions.dto';

@Controller('businesses/:businessId/prospects/:prospectId/interactions')
@UseGuards(JwtAuthGuard)
export class InteractionsController {
  constructor(
    private readonly interactionsService: InteractionsService,
  ) {}

  @Get()
  list(
    @Req() req: any,
    @Param('businessId', ParseUUIDPipe) businessId: string,
    @Param('prospectId', ParseUUIDPipe) prospectId: string,
  ) {
    return this.interactionsService.list(
      req.user.userId,
      businessId,
      prospectId,
    );
  }

  @Post()
  create(
    @Req() req: any,
    @Param('businessId', ParseUUIDPipe) businessId: string,
    @Param('prospectId', ParseUUIDPipe) prospectId: string,
    @Body() dto: CreateInteractionDto,
  ) {
    return this.interactionsService.create(
      req.user.userId,
      businessId,
      prospectId,
      dto,
    );
  }

  @Get(':id')
  get(
    @Req() req: any,
    @Param('businessId', ParseUUIDPipe) businessId: string,
    @Param('prospectId', ParseUUIDPipe) prospectId: string,
    @Param('id') id: string,
  ) {
    return this.interactionsService.get(
      req.user.userId,
      businessId,
      prospectId,
      id,
    );
  }

  @Patch(':id')
  update(
    @Req() req: any,
    @Param('businessId', ParseUUIDPipe) businessId: string,
    @Param('prospectId', ParseUUIDPipe) prospectId: string,
    @Param('id') id: string,
    @Body() dto: UpdateInteractionDto,
  ) {
    return this.interactionsService.update(
      req.user.userId,
      businessId,
      prospectId,
      id,
      dto,
    );
  }

  @Delete(':id')
  remove(
    @Req() req: any,
    @Param('businessId', ParseUUIDPipe) businessId: string,
    @Param('prospectId', ParseUUIDPipe) prospectId: string,
    @Param('id') id: string,
  ) {
    return this.interactionsService.remove(
      req.user.userId,
      businessId,
      prospectId,
      id,
    );
  }
}
