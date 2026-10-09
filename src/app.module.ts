import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { BusinessModule } from './businesses/businesses.module';
import { ProspectsModule } from './prospects/prospects.module';


@Module({
  imports: [AuthModule, UsersModule, BusinessModule, ProspectsModule],
})
export class AppModule {}
