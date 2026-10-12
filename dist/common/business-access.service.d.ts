import { BusinessRole } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
export declare class BusinessAccessService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    require(userId: string, businessId: string, min?: BusinessRole): Promise<{
        id: string;
        role: import(".prisma/client").$Enums.BusinessRole;
        createdAt: Date;
        userId: string;
        businessId: string;
    }>;
}
