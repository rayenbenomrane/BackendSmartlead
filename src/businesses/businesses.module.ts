import { Module } from '@nestjs/common';
import { BusinessController } from './businesses.controller';
import { BusinessService } from './businesses.service';
import { PrismaService } from 'src/prisma.service';


@Module({

  controllers: [BusinessController],
  providers: [BusinessService, PrismaService],
  exports: [BusinessService],
})
export class BusinessModule { }