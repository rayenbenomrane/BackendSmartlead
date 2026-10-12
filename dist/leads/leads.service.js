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
exports.LeadsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let LeadsService = class LeadsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    scope(user) {
        return user.role === 'ADMIN' ? {} : { ownerId: user.id };
    }
    findAll(user, q, status) {
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
    async findOne(user, id) {
        const lead = await this.prisma.lead.findFirst({
            where: { id, ...this.scope(user) },
            include: { interactions: { orderBy: { date: 'desc' } } },
        });
        if (!lead)
            throw new common_1.NotFoundException('Prospect introuvable');
        return lead;
    }
    create(user, dto) {
        return this.prisma.lead.create({ data: { ...dto, ownerId: user.id } });
    }
    async update(user, id, dto) {
        await this.findOne(user, id);
        return this.prisma.lead.update({ where: { id }, data: dto });
    }
    async remove(user, id) {
        await this.findOne(user, id);
        await this.prisma.lead.delete({ where: { id } });
        return { deleted: true };
    }
};
exports.LeadsService = LeadsService;
exports.LeadsService = LeadsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LeadsService);
//# sourceMappingURL=leads.service.js.map