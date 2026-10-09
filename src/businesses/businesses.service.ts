import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateBusinessDto } from './create-business.dto';



@Injectable()
export class BusinessService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a new business.
   *
   * The authenticated user automatically becomes OWNER.
   */
  async create(userId: string, dto: CreateBusinessDto) {
    // Check if matricule fiscale already exists
    const existingBusiness = await this.prisma.business.findUnique({
      where: {
        matriculeFiscale: dto.matriculeFiscale,
      },
    });

    if (existingBusiness) {
      throw new ConflictException(
        'A business with this matricule fiscale already exists',
      );
    }

    // Create business + owner membership in one transaction
    const business = await this.prisma.$transaction(async (tx) => {
      const newBusiness = await tx.business.create({
        data: {
          name: dto.name,
          matriculeFiscale: dto.matriculeFiscale,
          description: dto.description,
          region: dto.region,
          serviceDomain: dto.serviceDomain,
          phone: dto.phone,
          email: dto.email,
          address: dto.address,
          website: dto.website,
        },
      });

      await tx.businessMember.create({
        data: {
          userId,
          businessId: newBusiness.id,
          role: 'OWNER',
        },
      });

      return newBusiness;
    });

    return business;
  }

  /**
   * Return all businesses where the authenticated
   * user is a member.
   */
  async findMyBusinesses(userId: string) {
    const memberships = await this.prisma.businessMember.findMany({
      where: {
        userId,
      },
      include: {
        business: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return memberships.map((membership) => ({
      ...membership.business,
      role: membership.role,
    }));
  }

  /**
   * Return one business only if the authenticated
   * user belongs to it.
   */
  async findOne(userId: string, businessId: string) {
    const membership = await this.prisma.businessMember.findUnique({
      where: {
        userId_businessId: {
          userId,
          businessId,
        },
      },
      include: {
        business: true,
      },
    });

    if (!membership) {
      throw new ForbiddenException(
        'You do not have access to this business',
      );
    }

    return {
      ...membership.business,
      role: membership.role,
    };
  }
}