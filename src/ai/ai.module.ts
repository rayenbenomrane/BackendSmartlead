import { Module } from '@nestjs/common';
import { LeadsModule } from '../leads/leads.module';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  imports: [LeadsModule],
  controllers: [AiController],
  providers: [AiService, PrismaService],
})
export class AiModule {}
