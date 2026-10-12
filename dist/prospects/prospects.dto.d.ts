import { ProspectStatus } from '@prisma/client';
import { ProspectSource } from '@prisma/client';
export declare class CreateProspectDto {
    contactName: string;
    companyName: string;
    email?: string;
    phone?: string;
    industry?: string;
    source?: ProspectSource;
    status?: ProspectStatus;
    estimatedValue?: number;
}
export declare class UpdateProspectDto {
    contactName?: string;
    companyName?: string;
    email?: string;
    phone?: string;
    jobTitle?: string;
    industry?: string;
    region?: string;
    website?: string;
    source?: ProspectSource;
    status?: ProspectStatus;
    estimatedValue?: number;
    notes?: string;
}
export declare const SORT_FIELDS: readonly ["createdAt", "updatedAt", "contactName", "companyName", "estimatedBudget", "status"];
export declare class ListProspectsDto {
    page: number;
    limit: number;
    search?: string;
    status?: ProspectStatus;
    sortBy: string;
    order: 'asc' | 'desc';
}
