import { ForbiddenException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service'; 
import { AuthUser } from '../common/current-user.decorator';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async stats(user: AuthUser, businessId?: string) {
    if (businessId && user.role !== 'ADMIN') {
      const m = await this.prisma.businessMember.findUnique({
        where: { userId_businessId: { userId: user.id, businessId } },
      });
      if (!m) throw new ForbiddenException("Vous n'appartenez pas à cette entreprise");
    }
    const where: Prisma.ProspectWhereInput = {
      ...(businessId && { businessId }),
      ...(user.role !== 'ADMIN' && { business: { members: { some: { userId: user.id } } } }),
    };
    const weekAgo = new Date(Date.now() - 7 * 86_400_000);

    const [byStatus, avg, hot, stale] = await Promise.all([
      this.prisma.prospect.groupBy({ by: ['status'], where, _count: { _all: true }, _sum: { estimatedValue: true } }),
      this.prisma.prospect.aggregate({ where, _avg: { score: true } }),
      this.prisma.prospect.count({ where: { ...where, score: { gte: 70 }, status: { notIn: ['WON', 'LOST'] } } }),
      this.prisma.prospect.count({
        where: { ...where, status: { notIn: ['WON', 'LOST'] }, createdAt: { lt: weekAgo }, interactions: { none: { date: { gte: weekAgo } } } },
      }),
    ]);

    const total = byStatus.reduce((a, s) => a + s._count._all, 0);
    const won = byStatus.find((s) => s.status === 'WON')?._count._all ?? 0;
    const lost = byStatus.find((s) => s.status === 'LOST')?._count._all ?? 0;
    return {
      total,
      byStatus: byStatus.map((s) => ({ status: s.status, count: s._count._all, totalValue: s._sum.estimatedValue ?? 0 })),
      pipelineValue: byStatus
        .filter((s) => !['WON', 'LOST'].includes(s.status))
        .reduce((a, s) => a + (s._sum.estimatedValue ?? 0), 0),
      wonValue: byStatus.find((s) => s.status === 'WON')?._sum.estimatedValue ?? 0,
      conversionRate: won + lost ? Math.round((won / (won + lost)) * 100) : null,
      averageScore: avg._avg.score !== null ? Math.round(avg._avg.score) : null,
      hotProspects: hot,
      followUpsDue: stale,
    };
  }
}
