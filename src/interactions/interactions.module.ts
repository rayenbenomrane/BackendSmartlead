import { Module } from '@nestjs/common';
import { LeadsModule } from '../leads/leads.module';
import { InteractionsController } from './interactions.controller';
import { InteractionsService } from './interactions.service';
import { PrismaService } from 'src/prisma.service';
import { ProspectsModule } from 'src/prospects/prospects.module';

@Module({
  imports: [ProspectsModule],
  controllers: [InteractionsController],
  providers: [InteractionsService, PrismaService],
})
export class InteractionsModule {}
