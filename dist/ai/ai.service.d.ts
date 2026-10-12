import { PrismaService } from '../prisma.service';
import { AuthUser } from '../common/current-user.decorator';
import { LeadsService } from '../leads/leads.service';
export declare class AiService {
    private prisma;
    private leads;
    private client;
    private model;
    constructor(prisma: PrismaService, leads: LeadsService);
    private buildContext;
    private askJson;
    private save;
    analyze(user: AuthUser, id: string): Promise<{
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
    summarize(user: AuthUser, id: string): Promise<{
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
    score(user: AuthUser, id: string): Promise<{
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
    private heuristicScore;
    recommend(user: AuthUser, id: string): Promise<{
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
    refreshAll(user: AuthUser, id: string): Promise<{
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
