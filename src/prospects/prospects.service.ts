
import {
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import {
    Prisma,
    ProspectStatus,
} from '@prisma/client';

import { PrismaService } from 'src/prisma.service';
import { CreateProspectDto } from './prospects.dto';
import { UpdateProspectDto } from './prospects.dto';

@Injectable()
export class ProspectsService {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    private async assertBusinessAccess(
        userId: string,
        businessId: string,
    ): Promise<void> {
        if (!userId) {
            throw new ForbiddenException(
                'User ID missing from authentication',
            );
        }

        const business = await this.prisma.business.findUnique({
            where: { id: businessId },
            select: { id: true },
        });

        if (!business) {
            throw new NotFoundException('Business not found');
        }

        const membership = await this.prisma.businessMember.findUnique({
            where: {
                userId_businessId: {
                    userId,
                    businessId,
                },
            },
        });

        if (!membership) {
            throw new ForbiddenException(
                'You do not have access to this business',
            );
        }
    }

    async create(
        userId: string,
        businessId: string,
        dto: CreateProspectDto,
    ) {
        await this.assertBusinessAccess(userId, businessId);

        const names = dto.contactName.trim().split(/\s+/);
        const firstName = names.shift()!;
        const lastName = names.join(' ') || firstName;

        return this.prisma.prospect.create({
            data: {
                firstName,
                lastName,
                company: dto.companyName,
                email: dto.email || null,
                phone: dto.phone || null,
                industry: dto.industry || null,
                source: dto.source,
                status: dto.status,
                estimatedValue: dto.estimatedValue,
                businessId,
            },
        });
    }

    async findAllForBusiness(
        userId: string,
        businessId: string,
    ) {
        await this.assertBusinessAccess(userId, businessId);

        return this.prisma.prospect.findMany({
            where: { businessId },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(userId: string, id: string) {
        const prospect = await this.prisma.prospect.findUnique({
            where: { id },
        });

        if (!prospect) {
            throw new NotFoundException('Prospect not found');
        }

        await this.assertBusinessAccess(
            userId,
            prospect.businessId,
        );

        return prospect;
    }

    async findOwned(
        userId: string,
        businessId: string,
        id: string,
    ) {
        await this.assertBusinessAccess(userId, businessId);

        const prospect = await this.prisma.prospect.findFirst({
            where: {
                id,
                businessId,
            },
        });

        if (!prospect) {
            throw new NotFoundException('Prospect not found');
        }

        return prospect;
    }

    async get(
        userId: string,
        businessId: string,
        id: string,
    ) {
        return this.findOwned(userId, businessId, id);
    }

    async remove(
        userId: string,
        businessId: string,
        id: string,
    ) {
        await this.findOwned(userId, businessId, id);

        return this.prisma.prospect.delete({
            where: { id },
        });
    }

    async list(
        userId: string,
        businessId: string,
        page = 1,
        limit = 10,
        search?: string,
        status?: ProspectStatus,
        sortBy = 'createdAt',
        order: 'asc' | 'desc' | 'ASC' | 'DESC' = 'desc',
    ) {
        await this.assertBusinessAccess(userId, businessId);

        const safePage = Math.max(1, Number(page) || 1);
        const safeLimit = Math.min(
            100,
            Math.max(1, Number(limit) || 10),
        );

        const allowedSortFields = [
            'createdAt',
            'firstName',
            'lastName',
            'company',
            'email',
            'status',
            'estimatedValue',
        ] as const;

        type SortField = (typeof allowedSortFields)[number];

        const safeSortBy: SortField =
            allowedSortFields.includes(sortBy as SortField)
                ? (sortBy as SortField)
                : 'createdAt';

        const safeOrder: Prisma.SortOrder =
            order?.toLowerCase() === 'asc' ? 'asc' : 'desc';

        const searchTerm = search?.trim();

        const where: Prisma.ProspectWhereInput = {
            businessId,
            ...(status ? { status } : {}),
            ...(searchTerm
                ? {
                    OR: [
                        {
                            firstName: {
                                contains: searchTerm,
                                mode: 'insensitive',
                            },
                        },
                        {
                            lastName: {
                                contains: searchTerm,
                                mode: 'insensitive',
                            },
                        },
                        {
                            company: {
                                contains: searchTerm,
                                mode: 'insensitive',
                            },
                        },
                        {
                            email: {
                                contains: searchTerm,
                                mode: 'insensitive',
                            },
                        },
                        {
                            phone: {
                                contains: searchTerm,
                                mode: 'insensitive',
                            },
                        },
                        {
                            industry: {
                                contains: searchTerm,
                                mode: 'insensitive',
                            },
                        },
                    ],
                }
                : {}),
        };

        const [data, total] = await Promise.all([
            this.prisma.prospect.findMany({
                where,
                orderBy: {
                    [safeSortBy]: safeOrder,
                },
                skip: (safePage - 1) * safeLimit,
                take: safeLimit,
            }),
            this.prisma.prospect.count({ where }),
        ]);

        return {
            data,
            total,
            page: safePage,
            limit: safeLimit,
            totalPages: Math.ceil(total / safeLimit),
        };
    }

    async stats(userId: string, businessId: string) {
        await this.assertBusinessAccess(userId, businessId);

        const [total, grouped] = await Promise.all([
            this.prisma.prospect.count({
                where: { businessId },
            }),
            this.prisma.prospect.groupBy({
                by: ['status'],
                where: { businessId },
                _count: { _all: true },
                _sum: { estimatedValue: true },
            }),
        ]);

        const byStatus: Record<
            string,
            { count: number; value: number }
        > = {};

        for (const value of Object.values(ProspectStatus)) {
            byStatus[value] = {
                count: 0,
                value: 0,
            };
        }

        for (const group of grouped) {
            byStatus[group.status] = {
                count: group._count._all,
                value: group._sum.estimatedValue ?? 0,
            };
        }

        return {
            total,
            byStatus,
        };
    }

    async update(
        userId: string,
        businessId: string,
        id: string,
        dto: UpdateProspectDto,
    ) {
        await this.findOwned(userId, businessId, id);

        const data: Prisma.ProspectUpdateInput = {};

        if (dto.contactName !== undefined) {
            const names = dto.contactName.trim().split(/\s+/);

            data.firstName = names.shift()!;
            data.lastName = names.join(' ') || data.firstName;
        }

        if (dto.companyName !== undefined) {
            data.company = dto.companyName;
        }

        if (dto.email !== undefined) {
            data.email = dto.email || null;
        }

        if (dto.phone !== undefined) {
            data.phone = dto.phone || null;
        }

        if (dto.jobTitle !== undefined) {
            data.jobTitle = dto.jobTitle || null;
        }

        if (dto.industry !== undefined) {
            data.industry = dto.industry || null;
        }

        if (dto.region !== undefined) {
            data.region = dto.region || null;
        }

        if (dto.website !== undefined) {
            data.website = dto.website || null;
        }

        if (dto.source !== undefined) {
            data.source = dto.source;
        }

        if (dto.status !== undefined) {
            data.status = dto.status;
        }

        if (dto.estimatedValue !== undefined) {
            data.estimatedValue = dto.estimatedValue;
        }

        if (dto.notes !== undefined) {
            data.notes = dto.notes || null;
        }

        return this.prisma.prospect.update({
            where: { id },
            data,
        });
    }
}
