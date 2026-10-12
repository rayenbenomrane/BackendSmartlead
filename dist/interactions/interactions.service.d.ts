import { PrismaService } from 'src/prisma.service';
import { ProspectsService } from '../prospects/prospects.service';
import { CreateInteractionDto, UpdateInteractionDto } from './interactions.dto';
export declare class InteractionsService {
    private readonly prisma;
    private readonly prospects;
    constructor(prisma: PrismaService, prospects: ProspectsService);
    list(userId: string, businessId: string, prospectId: string): Promise<{
        id: string;
        createdAt: Date;
        description: string;
        type: import(".prisma/client").$Enums.InteractionType;
        date: Date;
        prospectId: string;
    }[]>;
    create(userId: string, businessId: string, prospectId: string, dto: CreateInteractionDto): Promise<{
        id: string;
        createdAt: Date;
        description: string;
        type: import(".prisma/client").$Enums.InteractionType;
        date: Date;
        prospectId: string;
    }>;
    private find;
    get(userId: string, businessId: string, prospectId: string, id: string): Promise<{
        id: string;
        createdAt: Date;
        description: string;
        type: import(".prisma/client").$Enums.InteractionType;
        date: Date;
        prospectId: string;
    }>;
    update(userId: string, businessId: string, prospectId: string, id: string, dto: UpdateInteractionDto): Promise<{
        id: string;
        createdAt: Date;
        description: string;
        type: import(".prisma/client").$Enums.InteractionType;
        date: Date;
        prospectId: string;
    }>;
    remove(userId: string, businessId: string, prospectId: string, id: string): Promise<{
        ok: boolean;
    }>;
}
