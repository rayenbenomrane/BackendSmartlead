import { BadRequestException, Body, ConflictException, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import * as bcrypt from 'bcrypt'; // 
import { JwtAuthGuard } from 'src/common/roles';
import { RolesGuard } from 'src/common/roles';
import { Roles } from 'src/common/roles';
import { PrismaService } from 'src/prisma.service';
import { AuthUser, CurrentUser } from '../common/current-user.decorator';
import { ChangePasswordDto, SetRoleDto, SetStatusDto, UpdateProfileDto } from './dto/profile.dto';

const SAFE = { id: true, name: true, email: true, role: true, status: true, createdAt: true, updatedAt: true } as const;

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class ProfileController {
  constructor(private readonly prisma: PrismaService) { }

  @Patch('me')
  async updateMe(@CurrentUser() u: AuthUser, @Body() dto: UpdateProfileDto) {
    if (dto.email) {
      const taken = await this.prisma.user.findFirst({ where: { email: dto.email, NOT: { id: u.id } } });
      if (taken) throw new ConflictException('Email déjà utilisé');
    }
    return this.prisma.user.update({ where: { id: u.id }, data: dto, select: SAFE });
  }

  @Patch('me/password')
  async changePassword(@CurrentUser() u: AuthUser, @Body() dto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({ where: { id: u.id } });
    if (!user || !(await bcrypt.compare(dto.currentPassword, user.password))) {
      throw new BadRequestException('Mot de passe actuel incorrect');
    }
    await this.prisma.user.update({ where: { id: u.id }, data: { password: await bcrypt.hash(dto.newPassword, 10) } });
    return { success: true };
  }

  // ── ADMIN ──
  @Roles('ADMIN') @Get()
  list() { return this.prisma.user.findMany({ select: SAFE, orderBy: { createdAt: 'desc' } }); }

  @Roles('ADMIN') @Patch(':id/role')
  setRole(@Param('id') id: string, @Body() dto: SetRoleDto) {
    return this.prisma.user.update({ where: { id }, data: { role: dto.role }, select: SAFE });
  }

  @Roles('ADMIN') @Patch(':id/status')
  setStatus(@Param('id') id: string, @Body() dto: SetStatusDto) {
    return this.prisma.user.update({ where: { id }, data: { status: dto.status }, select: SAFE });
  }
}
