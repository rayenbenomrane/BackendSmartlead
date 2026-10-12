import { Module } from '@nestjs/common';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { LlmService } from './llm.service';
import { PrismaService } from 'src/prisma.service';

@Module({
    controllers: [AiController]
    , providers: [AiService, LlmService, PrismaService]
    , exports: [AiService]
})
export class AiModule { }
