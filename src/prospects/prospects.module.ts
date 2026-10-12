import { Module } from '@nestjs/common';
import { ProspectsController } from './prospects.controller';
import { ProspectsService } from './prospects.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [ProspectsController],
  providers: [ProspectsService, PrismaService],
  exports: [ProspectsService],
})
export class ProspectsModule { }
