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
const prisma_service_1 = require("../prisma.service");
let ProspectsService = class ProspectsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async assertBusinessAccess(userId, businessId) {
        const membership = await this.prisma.businessMember.findUnique({
            where: { userId_businessId: { userId, businessId } },
        });
        if (!membership) {
            const business = await this.prisma.business.findUnique({ where: { id: businessId } });
            if (!business) {
                throw new common_1.NotFoundException('Entreprise introuvable');
            }
            throw new common_1.ForbiddenException("Vous n'avez pas accès à cette entreprise");
        }
    }
    async create(userId, businessId, dto) {
        await this.assertBusinessAccess(userId, businessId);
        return this.prisma.prospect.create({
            data: {
                ...dto,
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
        const prospect = await this.prisma.prospect.findUnique({ where: { id } });
        if (!prospect) {
            throw new common_1.NotFoundException('Prospect introuvable');
        }
        await this.assertBusinessAccess(userId, prospect.businessId);
        return prospect;
    }
    async remove(userId, id) {
        const prospect = await this.findOne(userId, id);
        await this.prisma.prospect.delete({ where: { id: prospect.id } });
        return { deleted: true };
    }
};
exports.ProspectsService = ProspectsService;
exports.ProspectsService = ProspectsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProspectsService);
//# sourceMappingURL=prospects.service.js.map