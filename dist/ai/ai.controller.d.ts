import { AuthUser } from '../common/current-user.decorator';
import { AiService } from './ai.service';
export declare class AiController {
    private ai;
    constructor(ai: AiService);
    analyze(u: AuthUser, id: string): Promise<{
        interactions: {
            id: string;
            createdAt: Date;
            description: string;
            date: Date;
            type: import(".prisma/client").$Enums.InteractionType;
            leadId: string;
        }[];
    } & {
        id: string;
        email: string;
        status: import(".prisma/client").$Enums.LeadStatus;
        createdAt: Date;
        updatedAt: Date;
        phone: string | null;
        contactName: string;
        companyName: string;
        estimatedBudget: number | null;
        source: string | null;
        sector: string | null;
        score: number | null;
        aiScoreDetails: import("@prisma/client/runtime/library").JsonValue | null;
        aiAnalysis: import("@prisma/client/runtime/library").JsonValue | null;
        aiSummary: import("@prisma/client/runtime/library").JsonValue | null;
        aiActions: import("@prisma/client/runtime/library").JsonValue | null;
        aiUpdatedAt: Date | null;
        ownerId: string;
    }>;
    summarize(u: AuthUser, id: string): Promise<{
        interactions: {
            id: string;
            createdAt: Date;
            description: string;
            date: Date;
            type: import(".prisma/client").$Enums.InteractionType;
            leadId: string;
        }[];
    } & {
        id: string;
        email: string;
        status: import(".prisma/client").$Enums.LeadStatus;
        createdAt: Date;
        updatedAt: Date;
        phone: string | null;
        contactName: string;
        companyName: string;
        estimatedBudget: number | null;
        source: string | null;
        sector: string | null;
        score: number | null;
        aiScoreDetails: import("@prisma/client/runtime/library").JsonValue | null;
        aiAnalysis: import("@prisma/client/runtime/library").JsonValue | null;
        aiSummary: import("@prisma/client/runtime/library").JsonValue | null;
        aiActions: import("@prisma/client/runtime/library").JsonValue | null;
        aiUpdatedAt: Date | null;
        ownerId: string;
    }>;
    score(u: AuthUser, id: string): Promise<{
        interactions: {
            id: string;
            createdAt: Date;
            description: string;
            date: Date;
            type: import(".prisma/client").$Enums.InteractionType;
            leadId: string;
        }[];
    } & {
        id: string;
        email: string;
        status: import(".prisma/client").$Enums.LeadStatus;
        createdAt: Date;
        updatedAt: Date;
        phone: string | null;
        contactName: string;
        companyName: string;
        estimatedBudget: number | null;
        source: string | null;
        sector: string | null;
        score: number | null;
        aiScoreDetails: import("@prisma/client/runtime/library").JsonValue | null;
        aiAnalysis: import("@prisma/client/runtime/library").JsonValue | null;
        aiSummary: import("@prisma/client/runtime/library").JsonValue | null;
        aiActions: import("@prisma/client/runtime/library").JsonValue | null;
        aiUpdatedAt: Date | null;
        ownerId: string;
    }>;
    recommend(u: AuthUser, id: string): Promise<{
        interactions: {
            id: string;
            createdAt: Date;
            description: string;
            date: Date;
            type: import(".prisma/client").$Enums.InteractionType;
            leadId: string;
        }[];
    } & {
        id: string;
        email: string;
        status: import(".prisma/client").$Enums.LeadStatus;
        createdAt: Date;
        updatedAt: Date;
        phone: string | null;
        contactName: string;
        companyName: string;
        estimatedBudget: number | null;
        source: string | null;
        sector: string | null;
        score: number | null;
        aiScoreDetails: import("@prisma/client/runtime/library").JsonValue | null;
        aiAnalysis: import("@prisma/client/runtime/library").JsonValue | null;
        aiSummary: import("@prisma/client/runtime/library").JsonValue | null;
        aiActions: import("@prisma/client/runtime/library").JsonValue | null;
        aiUpdatedAt: Date | null;
        ownerId: string;
    }>;
    refresh(u: AuthUser, id: string): Promise<{
        interactions: {
            id: string;
            createdAt: Date;
            description: string;
            date: Date;
            type: import(".prisma/client").$Enums.InteractionType;
            leadId: string;
        }[];
    } & {
        id: string;
        email: string;
        status: import(".prisma/client").$Enums.LeadStatus;
        createdAt: Date;
        updatedAt: Date;
        phone: string | null;
        contactName: string;
        companyName: string;
        estimatedBudget: number | null;
        source: string | null;
        sector: string | null;
        score: number | null;
        aiScoreDetails: import("@prisma/client/runtime/library").JsonValue | null;
        aiAnalysis: import("@prisma/client/runtime/library").JsonValue | null;
        aiSummary: import("@prisma/client/runtime/library").JsonValue | null;
        aiActions: import("@prisma/client/runtime/library").JsonValue | null;
        aiUpdatedAt: Date | null;
        ownerId: string;
    }>;
}
