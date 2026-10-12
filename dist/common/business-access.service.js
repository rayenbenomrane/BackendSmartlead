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
exports.BusinessAccessService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma.service");
const RANK = {
    MEMBER: 1,
    ADMIN: 2,
    OWNER: 3,
};
let BusinessAccessService = class BusinessAccessService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async require(userId, businessId, min = client_1.BusinessRole.MEMBER) {
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
                throw new common_1.NotFoundException('Entreprise introuvable');
            }
            throw new common_1.ForbiddenException("Vous n'appartenez pas à cette entreprise");
        }
        if (RANK[membership.role] < RANK[min]) {
            throw new common_1.ForbiddenException('Droits insuffisants pour cette action');
        }
        return membership;
    }
};
exports.BusinessAccessService = BusinessAccessService;
exports.BusinessAccessService = BusinessAccessService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BusinessAccessService);
//# sourceMappingURL=business-access.service.js.map