import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'; 
import { AuthUser, CurrentUser } from '../common/current-user.decorator';
import { DashboardService } from './dashboard.service';

@UseGuards(JwtAuthGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly svc: DashboardService) {}
  @Get() stats(@CurrentUser() u: AuthUser, @Query('businessId') businessId?: string) {
    return this.svc.stats(u, businessId);
  }
}
