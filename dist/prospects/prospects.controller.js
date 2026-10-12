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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProspectsController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const prospects_service_1 = require("./prospects.service");
const prospects_dto_1 = require("./prospects.dto");
const prospects_dto_2 = require("./prospects.dto");
const prospects_dto_3 = require("./prospects.dto");
let ProspectsController = class ProspectsController {
    constructor(prospectService) {
        this.prospectService = prospectService;
    }
    create(req, businessId, dto) {
        const userId = req.user.userId;
        return this.prospectService.create(userId, businessId, dto);
    }
    list(req, businessId, query) {
        const userId = req.user.userId;
        return this.prospectService.list(userId, businessId, query.page, query.limit, query.search, query.status, query.sortBy, query.order);
    }
    stats(req, businessId) {
        return this.prospectService.stats(req.user.userId, businessId);
    }
    get(req, businessId, id) {
        return this.prospectService.get(req.user.userId, businessId, id);
    }
    update(req, businessId, id, dto) {
        return this.prospectService.update(req.user.userId, businessId, id, dto);
    }
    remove(req, businessId, id) {
        return this.prospectService.remove(req.user.userId, businessId, id);
    }
};
exports.ProspectsController = ProspectsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('businessId', common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, prospects_dto_1.CreateProspectDto]),
    __metadata("design:returntype", void 0)
], ProspectsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('businessId', common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, prospects_dto_3.ListProspectsDto]),
    __metadata("design:returntype", void 0)
], ProspectsController.prototype, "list", null);
__decorate([
    (0, common_1.Get)('stats'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('businessId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ProspectsController.prototype, "stats", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('businessId', common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], ProspectsController.prototype, "get", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('businessId', common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, prospects_dto_2.UpdateProspectDto]),
    __metadata("design:returntype", void 0)
], ProspectsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('businessId', common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], ProspectsController.prototype, "remove", null);
exports.ProspectsController = ProspectsController = __decorate([
    (0, common_1.Controller)('businesses/:businessId/prospects'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [prospects_service_1.ProspectsService])
], ProspectsController);
//# sourceMappingURL=prospects.controller.js.map