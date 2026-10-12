"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = exports.CurrentUser = void 0;
const common_1 = require("@nestjs/common");
exports.CurrentUser = (0, common_1.createParamDecorator)((_data, ctx) => {
    const u = ctx.switchToHttp().getRequest().user ?? {};
    return { id: u.id ?? u.userId ?? u.sub, email: u.email, role: u.role };
});
const isAdmin = (u) => u.role === 'ADMIN';
exports.isAdmin = isAdmin;
//# sourceMappingURL=current-user.decorator.js.map