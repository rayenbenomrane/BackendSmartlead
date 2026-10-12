"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProspectsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma.service");
let ProspectsService = class ProspectsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async assertBusinessAccess(userId, businessId) {
        if (!userId) {
            throw new common_1.ForbiddenException('User ID missing from authentication');
        }
        const business = await this.prisma.business.findUnique({
            where: { id: businessId },
            select: { id: true },
        });
        if (!business) {
            throw new common_1.NotFoundException('Business not found');
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
            throw new common_1.ForbiddenException('You do not have access to this business');
        }
    }
    async create(userId, businessId, dto) {
        await this.assertBusinessAccess(userId, businessId);
        const names = dto.contactName.trim().split(/\s+/);
        const firstName = names.shift();
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
    async findAllForBusiness(userId, businessId) {
        await this.assertBusinessAccess(userId, businessId);
        return this.prisma.prospect.findMany({
            where: { businessId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(userId, id) {
        const prospect = await this.prisma.prospect.findUnique({
            where: { id },
        });
        if (!prospect) {
            throw new common_1.NotFoundException('Prospect not found');
        }
        await this.assertBusinessAccess(userId, prospect.businessId);
        return prospect;
    }
    async findOwned(userId, businessId, id) {
        await this.assertBusinessAccess(userId, businessId);
        const prospect = await this.prisma.prospect.findFirst({
            where: {
                id,
                businessId,
            },
        });
        if (!prospect) {
            throw new common_1.NotFoundException('Prospect not found');
        }
        return prospect;
    }
    async get(userId, businessId, id) {
        return this.findOwned(userId, businessId, id);
    }
    async remove(userId, businessId, id) {
        await this.findOwned(userId, businessId, id);
        return this.prisma.prospect.delete({
            where: { id },
        });
    }
    async list(userId, businessId, page = 1, limit = 10, search, status, sortBy = 'createdAt', order = 'desc') {
        await this.assertBusinessAccess(userId, businessId);
        const safePage = Math.max(1, Number(page) || 1);
        const safeLimit = Math.min(100, Math.max(1, Number(limit) || 10));
        const allowedSortFields = [
            'createdAt',
            'firstName',
            'lastName',
            'company',
            'email',
            'status',
            'estimatedValue',
        ];
        const safeSortBy = allowedSortFields.includes(sortBy)
            ? sortBy
            : 'createdAt';
        const safeOrder = order?.toLowerCase() === 'asc' ? 'asc' : 'desc';
        const searchTerm = search?.trim();
        const where = {
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
    async stats(userId, businessId) {
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
        const byStatus = {};
        for (const value of Object.values(client_1.ProspectStatus)) {
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
    async update(userId, businessId, id, dto) {
        await this.findOwned(userId, businessId, id);
        const data = {};
        if (dto.contactName !== undefined) {
            const names = dto.contactName.trim().split(/\s+/);
            data.firstName = names.shift();
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
};
exports.ProspectsService = ProspectsService;
exports.ProspectsService = ProspectsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProspectsService);
//# sourceMappingURL=prospects.service.js.map