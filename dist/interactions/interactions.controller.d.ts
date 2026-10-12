import { InteractionsService } from './interactions.service';
import { CreateInteractionDto, UpdateInteractionDto } from './interactions.dto';
export declare class InteractionsController {
    private readonly interactionsService;
    constructor(interactionsService: InteractionsService);
    list(req: any, businessId: string, prospectId: string): Promise<{
        id: string;
        createdAt: Date;
        description: string;
        type: import(".prisma/client").$Enums.InteractionType;
        date: Date;
        prospectId: string;
    }[]>;
    create(req: any, businessId: string, prospectId: string, dto: CreateInteractionDto): Promise<{
        id: string;
        createdAt: Date;
        description: string;
        type: import(".prisma/client").$Enums.InteractionType;
        date: Date;
        prospectId: string;
    }>;
    get(req: any, businessId: string, prospectId: string, id: string): Promise<{
        id: string;
        createdAt: Date;
        description: string;
        type: import(".prisma/client").$Enums.InteractionType;
        date: Date;
        prospectId: string;
    }>;
    update(req: any, businessId: string, prospectId: string, id: string, dto: UpdateInteractionDto): Promise<{
        id: string;
        createdAt: Date;
        description: string;
        type: import(".prisma/client").$Enums.InteractionType;
        date: Date;
        prospectId: string;
    }>;
    remove(req: any, businessId: string, prospectId: string, id: string): Promise<{
        ok: boolean;
    }>;
}
