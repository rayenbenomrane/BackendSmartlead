
import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseUUIDPipe,
    Patch,
    Post,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ProspectsService } from './prospects.service';
import { CreateProspectDto } from './prospects.dto';
import { UpdateProspectDto } from './prospects.dto';
import { ListProspectsDto } from './prospects.dto';

@Controller('businesses/:businessId/prospects')
@UseGuards(JwtAuthGuard)
export class ProspectsController {
    constructor(
        private readonly prospectService: ProspectsService,
    ) { }

    @Post()
    create(
        @Req() req: any,
        @Param('businessId', ParseUUIDPipe) businessId: string,
        @Body() dto: CreateProspectDto,
    ) {
        const userId = req.user.userId;

        return this.prospectService.create(userId, businessId, dto);
    }

    @Get()
    list(
        @Req() req: any,
        @Param('businessId', ParseUUIDPipe) businessId: string,
        @Query() query: ListProspectsDto,
    ) {
        const userId = req.user.userId;

        return this.prospectService.list(
            userId,
            businessId,
            query.page,
            query.limit,
            query.search,
            query.status,
            query.sortBy,
            query.order,
        );
    }

    @Get('stats')
    stats(
        @Req() req: any,
        @Param('businessId', ParseUUIDPipe) businessId: string,
    ) {
        return this.prospectService.stats(
            req.user.userId,
            businessId,
        );
    }

    @Get(':id')
    get(
        @Req() req: any,
        @Param('businessId', ParseUUIDPipe) businessId: string,
        @Param('id', ParseUUIDPipe) id: string,
    ) {
        return this.prospectService.get(
            req.user.userId,
            businessId,
            id,
        );
    }

    @Patch(':id')
    update(
        @Req() req: any,
        @Param('businessId', ParseUUIDPipe) businessId: string,
        @Param('id', ParseUUIDPipe) id: string,
        @Body() dto: UpdateProspectDto,
    ) {
        return this.prospectService.update(
            req.user.userId,
            businessId,
            id,
            dto,
        );
    }

    @Delete(':id')
    remove(
        @Req() req: any,
        @Param('businessId', ParseUUIDPipe) businessId: string,
        @Param('id', ParseUUIDPipe) id: string,
    ) {
        return this.prospectService.remove(
            req.user.userId,
            businessId,
            id,
        );
    }
}
