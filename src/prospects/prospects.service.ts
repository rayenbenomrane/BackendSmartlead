import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateProspectDto } from './create-prospect.dto';


@Injectable()
export class ProspectsService {
    constructor(private prisma: PrismaService) { }

    // Central access check — swap this out for your real Business module's
    // guard/service call if it already has one, to avoid duplicating logic.
    private async assertBusinessAccess(userId: string, businessId: string) {
        const membership = await this.prisma.businessMember.findUnique({
            where: { userId_businessId: { userId, businessId } },
        });

        if (!membership) {
            const business = await this.prisma.business.findUnique({ where: { id: businessId } });
            if (!business) {
                throw new NotFoundException('Entreprise introuvable');
            }
            throw new ForbiddenException("Vous n'avez pas accès à cette entreprise");
        }
    }

    async create(userId: string, businessId: string, dto: CreateProspectDto) {
        await this.assertBusinessAccess(userId, businessId);

        return this.prisma.prospect.create({
            data: {
                ...dto,
                businessId, // always from the verified route param
            },
        });
    }

    async findAllForBusiness(userId: string, businessId: string) {
        await this.assertBusinessAccess(userId, businessId);

        return this.prisma.prospect.findMany({
            where: { businessId },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(userId: string, id: string) {
        const prospect = await this.prisma.prospect.findUnique({ where: { id } });
        if (!prospect) {
            throw new NotFoundException('Prospect introuvable');
        }

        await this.assertBusinessAccess(userId, prospect.businessId);
        return prospect;
    }



    async remove(userId: string, id: string) {
        const prospect = await this.findOne(userId, id);
        await this.prisma.prospect.delete({ where: { id: prospect.id } });
        return { deleted: true };
    }
}