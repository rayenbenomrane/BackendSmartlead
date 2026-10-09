import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';


import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BusinessService } from './businesses.service';
import { CreateBusinessDto } from './create-business.dto';

@Controller('businesses')
@UseGuards(JwtAuthGuard)
export class BusinessController {
    constructor(
        private readonly businessService: BusinessService,
    ) { }

    /**
     * Create a business
     *
     * POST /businesses
     */
    @Post()
    async create(
        @Req() req: any,
        @Body() dto: CreateBusinessDto,
    ) {
        const userId = req.user.userId;

        return this.businessService.create(userId, dto);
    }

    /**
     * Get businesses of authenticated user
     *
     * GET /businesses
     */
    @Get()
    async findMyBusinesses(@Req() req: any) {
        const userId = req.user.userId;
        return this.businessService.findMyBusinesses(userId);
    }

    /**
     * Get one business
     *
     * GET /businesses/:id
     */
    @Get(':id')
    async findOne(
        @Req() req: any,
        @Param('id') businessId: string,
    ) {
        const userId = req.user.userId;

        return this.businessService.findOne(
            userId,
            businessId,
        );
    }
}