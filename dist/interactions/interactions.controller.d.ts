import { InteractionsService } from './interactions.service';
import { CreateInteractionDto, UpdateInteractionDto } from './interactions.dto';
export declare class InteractionsController {
    private readonly interactionsService;
    constructor(interactionsService: InteractionsService);
    list(req: any, businessId: string, prospectId: string): Promise<{
        id: string;
        date: Date;
        type: import(".prisma/client").$Enums.InteractionType;
        description: string;
        leadId: string;
        createdAt: Date;
    }[]>;
    create(req: any, businessId: string, prospectId: string, dto: CreateInteractionDto): Promise<{
        id: string;
        date: Date;
        type: import(".prisma/client").$Enums.InteractionType;
        description: string;
        leadId: string;
        createdAt: Date;
    }>;
    get(req: any, businessId: string, prospectId: string, id: string): Promise<{
        id: string;
        date: Date;
        type: import(".prisma/client").$Enums.InteractionType;
        description: string;
        leadId: string;
        createdAt: Date;
    }>;
    update(req: any, businessId: string, prospectId: string, id: string, dto: UpdateInteractionDto): Promise<{
        id: string;
        date: Date;
        type: import(".prisma/client").$Enums.InteractionType;
        description: string;
        leadId: string;
        createdAt: Date;
    }>;
    remove(req: any, businessId: string, prospectId: string, id: string): Promise<{
        ok: boolean;
    }>;
}
