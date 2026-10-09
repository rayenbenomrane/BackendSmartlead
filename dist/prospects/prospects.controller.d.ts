import { ProspectsService } from './prospects.service';
import { CreateProspectDto } from './create-prospect.dto';
export declare class ProspectsController {
    private prospectService;
    constructor(prospectService: ProspectsService);
    create(req: any, businessId: string, dto: CreateProspectDto): Promise<{
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
    findAllForBusiness(req: any, businessId: string): Promise<{
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
    findOne(req: any, id: string): Promise<{
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
    remove(req: any, id: string): Promise<{
        deleted: boolean;
    }>;
}
