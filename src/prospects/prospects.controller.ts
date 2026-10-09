import { Body, Controller, Delete, Get, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ProspectsService } from './prospects.service';
import { CreateProspectDto } from './create-prospect.dto';


@UseGuards(JwtAuthGuard)
@Controller('prospects')
export class ProspectsController {
    constructor(private prospectService: ProspectsService) { }

    @Post('business/:businessId')
    create(@Request() req, @Param('businessId') businessId: string, @Body() dto: CreateProspectDto) {
        return this.prospectService.create(req.user.userId, businessId, dto);
    }

    @Get('business/:businessId')
    findAllForBusiness(@Request() req, @Param('businessId') businessId: string) {
        return this.prospectService.findAllForBusiness(req.user.userId, businessId);
    }

    @Get(':id')
    findOne(@Request() req, @Param('id') id: string) {
        return this.prospectService.findOne(req.user.userId, id);
    }
    @Delete(':id')
    remove(@Request() req, @Param('id') id: string) {
        return this.prospectService.remove(req.user.userId, id);
    }
}