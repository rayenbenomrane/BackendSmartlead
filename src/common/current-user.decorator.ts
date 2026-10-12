import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface AuthUser { id: string; email: string; role: string }

export const CurrentUser = createParamDecorator((_d: unknown, ctx: ExecutionContext): AuthUser => {
  return ctx.switchToHttp().getRequest().user;
});
