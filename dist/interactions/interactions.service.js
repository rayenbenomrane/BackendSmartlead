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
exports.InteractionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const prospects_service_1 = require("../prospects/prospects.service");
let InteractionsService = class InteractionsService {
    constructor(prisma, prospects) {
        this.prisma = prisma;
        this.prospects = prospects;
    }
    async list(userId, businessId, prospectId) {
        await this.prospects.findOwned(userId, businessId, prospectId);
        return this.prisma.interaction.findMany({
            where: { leadId: prospectId },
            orderBy: [
                { date: 'desc' },
                { createdAt: 'desc' },
            ],
        });
    }
    async create(userId, businessId, prospectId, dto) {
        await this.prospects.findOwned(userId, businessId, prospectId);
        return this.prisma.interaction.create({
            data: {
                leadId: prospectId,
                type: dto.type,
                description: dto.description,
                date: dto.date ? new Date(dto.date) : new Date(),
            },
        });
    }
    async find(userId, businessId, prospectId, id) {
        await this.prospects.findOwned(userId, businessId, prospectId);
        const interaction = await this.prisma.interaction.findFirst({
            where: {
                id,
                leadId: prospectId,
            },
        });
        if (!interaction) {
            throw new common_1.NotFoundException('Interaction introuvable');
        }
        return interaction;
    }
    async get(userId, businessId, prospectId, id) {
        return this.find(userId, businessId, prospectId, id);
    }
    async update(userId, businessId, prospectId, id, dto) {
        const interaction = await this.find(userId, businessId, prospectId, id);
        return this.prisma.interaction.update({
            where: { id: interaction.id },
            data: {
                ...(dto.type !== undefined && { type: dto.type }),
                ...(dto.description !== undefined && {
                    description: dto.description,
                }),
                ...(dto.date !== undefined && {
                    date: new Date(dto.date),
                }),
            },
        });
    }
    async remove(userId, businessId, prospectId, id) {
        const interaction = await this.find(userId, businessId, prospectId, id);
        await this.prisma.interaction.delete({
            where: { id: interaction.id },
        });
        return { ok: true };
    }
};
exports.InteractionsService = InteractionsService;
exports.InteractionsService = InteractionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        prospects_service_1.ProspectsService])
], InteractionsService);
//# sourceMappingURL=interactions.service.js.map