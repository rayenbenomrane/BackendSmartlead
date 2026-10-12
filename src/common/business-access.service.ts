import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BusinessRole } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

const RANK: Record<BusinessRole, number> = {
  MEMBER: 1,
  ADMIN: 2,
  OWNER: 3,
};

@Injectable()
export class BusinessAccessService {
  constructor(private readonly prisma: PrismaService) { }

  async require(
    userId: string,
    businessId: string,
    min: BusinessRole = BusinessRole.MEMBER,
  ) {
    const membership = await this.prisma.businessMember.findUnique({
      where: {
        userId_businessId: {
          userId,
          businessId,
        },
      },
    });

    if (!membership) {
      const business = await this.prisma.business.findUnique({
        where: { id: businessId },
        select: { id: true },
      });

      if (!business) {
        throw new NotFoundException('Entreprise introuvable');
      }

      throw new ForbiddenException(
        "Vous n'appartenez pas à cette entreprise",
      );
    }

    if (RANK[membership.role] < RANK[min]) {
      throw new ForbiddenException(
        'Droits insuffisants pour cette action',
      );
    }

    return membership;
  }
}