import { PrismaService } from '../prisma.service';
import { CreateProspectDto } from './create-prospect.dto';
export declare class ProspectsService {
    private prisma;
    constructor(prisma: PrismaService);
    private assertBusinessAccess;
    create(userId: string, businessId: string, dto: CreateProspectDto): Promise<{
        id: string;
        email: string | null;
        status: import(".prisma/client").$Enums.ProspectStatus;
        createdAt: Date;
        updatedAt: Date;
        region: string | null;
        phone: string | null;
        website: string | null;
        businessId: string;
        firstName: string;
        lastName: string;
        company: string;
        jobTitle: string | null;
        industry: string | null;
        source: import(".prisma/client").$Enums.ProspectSource;
        estimatedValue: number | null;
        notes: string | null;
    }>;
    findAllForBusiness(userId: string, businessId: string): Promise<{
        id: string;
        email: string | null;
        status: import(".prisma/client").$Enums.ProspectStatus;
        createdAt: Date;
        updatedAt: Date;
        region: string | null;
        phone: string | null;
        website: string | null;
        businessId: string;
        firstName: string;
        lastName: string;
        company: string;
        jobTitle: string | null;
        industry: string | null;
        source: import(".prisma/client").$Enums.ProspectSource;
        estimatedValue: number | null;
        notes: string | null;
    }[]>;
    findOne(userId: string, id: string): Promise<{
        id: string;
        email: string | null;
        status: import(".prisma/client").$Enums.ProspectStatus;
        createdAt: Date;
        updatedAt: Date;
        region: string | null;
        phone: string | null;
        website: string | null;
        businessId: string;
        firstName: string;
        lastName: string;
        company: string;
        jobTitle: string | null;
        industry: string | null;
        source: import(".prisma/client").$Enums.ProspectSource;
        estimatedValue: number | null;
        notes: string | null;
    }>;
    remove(userId: string, id: string): Promise<{
        deleted: boolean;
    }>;
}
