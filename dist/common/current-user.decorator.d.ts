export interface AuthUser {
    id: string;
    email?: string;
    role: string;
}
export declare const CurrentUser: (...dataOrPipes: unknown[]) => ParameterDecorator;
export declare const isAdmin: (u: AuthUser) => boolean;
