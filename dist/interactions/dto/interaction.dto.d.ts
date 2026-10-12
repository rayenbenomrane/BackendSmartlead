import { InteractionType } from '@prisma/client';
export declare class CreateInteractionDto {
    type: InteractionType;
    description: string;
    date?: string;
}
export declare class UpdateInteractionDto {
    type?: InteractionType;
    description?: string;
    date?: string;
}
