import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface AuthUser {
  id: string;
  email?: string;
  role: string;
}

/**
 * Normalise req.user quel que soit ce que renvoie votre JwtStrategy.validate()
 * ({ id }, { userId } ou { sub }).
 */
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthUser => {
    const u = ctx.switchToHttp().getRequest().user ?? {};
    return { id: u.id ?? u.userId ?? u.sub, email: u.email, role: u.role };
  },
);

export const isAdmin = (u: AuthUser) => u.role === 'ADMIN';
