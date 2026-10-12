import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { PrismaService } from 'src/prisma.service';
@Module({ controllers: [ProfileController], providers: [PrismaService] })
export class ProfileModule { }
