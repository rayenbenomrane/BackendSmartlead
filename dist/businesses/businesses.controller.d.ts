import { BusinessService } from './businesses.service';
import { CreateBusinessDto } from './create-business.dto';
export declare class BusinessController {
    private readonly businessService;
    constructor(businessService: BusinessService);
    create(req: any, dto: CreateBusinessDto): Promise<{
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
    findMyBusinesses(req: any): Promise<{
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
    findOne(req: any, businessId: string): Promise<{
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
