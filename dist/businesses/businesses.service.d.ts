import { PrismaService } from 'src/prisma.service';
import { CreateBusinessDto } from './create-business.dto';
export declare class BusinessService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(userId: string, dto: CreateBusinessDto): Promise<{
        id: string;
        email: string | null;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        matriculeFiscale: string;
        description: string | null;
        region: string;
        serviceDomain: string;
        phone: string | null;
        address: string | null;
        website: string | null;
    }>;
    findMyBusinesses(userId: string): Promise<{
        role: import(".prisma/client").$Enums.BusinessRole;
        id: string;
        email: string | null;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        matriculeFiscale: string;
        description: string | null;
        region: string;
        serviceDomain: string;
        phone: string | null;
        address: string | null;
        website: string | null;
    }[]>;
    findOne(userId: string, businessId: string): Promise<{
        role: import(".prisma/client").$Enums.BusinessRole;
        id: string;
        email: string | null;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        matriculeFiscale: string;
        description: string | null;
        region: string;
        serviceDomain: string;
        phone: string | null;
        address: string | null;
        website: string | null;
    }>;
}
