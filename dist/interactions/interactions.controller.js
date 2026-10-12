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
exports.InteractionsController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const interactions_service_1 = require("./interactions.service");
const interactions_dto_1 = require("./interactions.dto");
let InteractionsController = class InteractionsController {
    constructor(interactionsService) {
        this.interactionsService = interactionsService;
    }
    list(req, businessId, prospectId) {
        return this.interactionsService.list(req.user.userId, businessId, prospectId);
    }
    create(req, businessId, prospectId, dto) {
        return this.interactionsService.create(req.user.userId, businessId, prospectId, dto);
    }
    get(req, businessId, prospectId, id) {
        return this.interactionsService.get(req.user.userId, businessId, prospectId, id);
    }
    update(req, businessId, prospectId, id, dto) {
        return this.interactionsService.update(req.user.userId, businessId, prospectId, id, dto);
    }
    remove(req, businessId, prospectId, id) {
        return this.interactionsService.remove(req.user.userId, businessId, prospectId, id);
    }
};
exports.InteractionsController = InteractionsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('businessId', common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Param)('prospectId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], InteractionsController.prototype, "list", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('businessId', common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Param)('prospectId', common_1.ParseUUIDPipe)),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, interactions_dto_1.CreateInteractionDto]),
    __metadata("design:returntype", void 0)
], InteractionsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('businessId', common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Param)('prospectId', common_1.ParseUUIDPipe)),
    __param(3, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", void 0)
], InteractionsController.prototype, "get", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('businessId', common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Param)('prospectId', common_1.ParseUUIDPipe)),
    __param(3, (0, common_1.Param)('id')),
    __param(4, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, interactions_dto_1.UpdateInteractionDto]),
    __metadata("design:returntype", void 0)
], InteractionsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('businessId', common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Param)('prospectId', common_1.ParseUUIDPipe)),
    __param(3, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", void 0)
], InteractionsController.prototype, "remove", null);
exports.InteractionsController = InteractionsController = __decorate([
    (0, common_1.Controller)('businesses/:businessId/prospects/:prospectId/interactions'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [interactions_service_1.InteractionsService])
], InteractionsController);
//# sourceMappingURL=interactions.controller.js.map