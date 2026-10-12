import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { BusinessModule } from './businesses/businesses.module';
import { ProspectsModule } from './prospects/prospects.module';
import { InteractionsModule } from './interactions/interactions.module';



@Module({
  imports: [AuthModule, UsersModule, BusinessModule, ProspectsModule, InteractionsModule],
})
export class AppModule { }
