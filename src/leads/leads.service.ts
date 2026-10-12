import { Injectable, NotFoundException } from '@nestjs/common';
import { LeadStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { AuthUser } from '../common/current-user.decorator';
import { CreateLeadDto, UpdateLeadDto } from './dto/lead.dto';

@Injectable()
export class LeadsService {
  constructor(private prisma: PrismaService) { }

  /** Admins see everything, sales reps only their own leads. */
  private scope(user: AuthUser): Prisma.LeadWhereInput {
    return user.role === 'ADMIN' ? {} : { ownerId: user.id };
  }

  findAll(user: AuthUser, q?: string, status?: LeadStatus) {
    const search = q?.trim();
    return this.prisma.lead.findMany({
      where: {
        ...this.scope(user),
        ...(status ? { status } : {}),
        ...(search
          ? {
            OR: [
              { contactName: { contains: search, mode: 'insensitive' } },
              { companyName: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } },
              { sector: { contains: search, mode: 'insensitive' } },
              { phone: { contains: search } },
            ],
          }
          : {}),
      },
      orderBy: [{ score: { sort: 'desc', nulls: 'last' } }, { updatedAt: 'desc' }],
    });
  }

  async findOne(user: AuthUser, id: string) {
    const lead = await this.prisma.lead.findFirst({
      where: { id, ...this.scope(user) },
      include: { interactions: { orderBy: { date: 'desc' } } },
    });
    if (!lead) throw new NotFoundException('Prospect introuvable');
    return lead;
  }

  create(user: AuthUser, dto: CreateLeadDto) {
    return this.prisma.lead.create({ data: { ...dto, ownerId: user.id } });
  }

  async update(user: AuthUser, id: string, dto: UpdateLeadDto) {
    await this.findOne(user, id);
    return this.prisma.lead.update({ where: { id }, data: dto });
  }

  async remove(user: AuthUser, id: string) {
    await this.findOne(user, id);
    await this.prisma.lead.delete({ where: { id } });
    return { deleted: true };
  }
}
