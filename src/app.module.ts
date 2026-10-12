import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { BusinessModule } from './businesses/businesses.module';
import { ProspectsModule } from './prospects/prospects.module';
import { InteractionsModule } from './interactions/interactions.module';
import { AiModule } from './ai/ai.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ProfileModule } from './profile/profile.module';



@Module({
  imports: [AuthModule, UsersModule, BusinessModule, ProspectsModule, InteractionsModule,AiModule,DashboardModule,ProfileModule],
})
export class AppModule { }
