import { ProspectSource, ProspectStatus } from '@prisma/client';
export declare class CreateProspectDto {
    firstName: string;
    lastName: string;
    company: string;
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
