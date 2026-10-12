import { LeadStatus } from '@prisma/client';
export declare class CreateLeadDto {
    contactName: string;
    companyName: string;
    email: string;
    phone?: string;
    sector?: string;
    source?: string;
    estimatedBudget?: number;
    status?: LeadStatus;
}
export declare class UpdateLeadDto {
    contactName?: string;
    companyName?: string;
    email?: string;
    phone?: string;
    sector?: string;
    source?: string;
    estimatedBudget?: number;
    status?: LeadStatus;
}
