import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { BusinessModule } from './businesses/businesses.module';
import { ProspectsModule } from './prospects/prospects.module';
import { InteractionsModule } from './interactions/interactions.module';
import { AiModule } from './ai/ai.module';

import { LeadsModule } from './leads/leads.module';


@Module({
  imports: [AuthModule, UsersModule, BusinessModule, ProspectsModule, LeadsModule, InteractionsModule, AiModule],
})
export class AppModule { }
