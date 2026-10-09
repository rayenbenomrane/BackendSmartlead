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
exports.BusinessService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let BusinessService = class BusinessService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, dto) {
        const existingBusiness = await this.prisma.business.findUnique({
            where: {
                matriculeFiscale: dto.matriculeFiscale,
            },
        });
        if (existingBusiness) {
            throw new common_1.ConflictException('A business with this matricule fiscale already exists');
        }
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
    async findMyBusinesses(userId) {
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
    async findOne(userId, businessId) {
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
            throw new common_1.ForbiddenException('You do not have access to this business');
        }
        return {
            ...membership.business,
            role: membership.role,
        };
    }
};
exports.BusinessService = BusinessService;
exports.BusinessService = BusinessService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BusinessService);
//# sourceMappingURL=businesses.service.js.map