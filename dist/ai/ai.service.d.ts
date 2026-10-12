import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { AuthUser } from '../common/current-user.decorator';
import { LlmService } from './llm.service';
export declare class AiService {
    private readonly prisma;
    private readonly llm;
    constructor(prisma: PrismaService, llm: LlmService);
    private memberWhere;
    private load;
    private assertBusiness;
    private context;
    private save;
    analyze(user: AuthUser, id: string): Promise<any>;
    private analyzeRules;
    summarize(user: AuthUser, id: string): Promise<any>;
    score(user: AuthUser, id: string): Promise<{
        source: string;
        score: number;
        level: import("./scoring").ScoreLevel;
        baseScore: number;
        adjustment: number;
        breakdown: Record<string, number>;
        reasons: string[];
    }>;
    scoreAll(user: AuthUser, businessId: string): Promise<{
        updated: number;
    }>;
    priorities(user: AuthUser, businessId: string, limit?: number): Promise<{
        level: import("./scoring").ScoreLevel;
        id: string;
        status: import(".prisma/client").$Enums.ProspectStatus;
        estimatedValue: number | null;
        firstName: string;
        lastName: string;
        company: string;
        score: number | null;
        aiUpdatedAt: Date | null;
    }[]>;
    recommend(user: AuthUser, id: string): Promise<any>;
    private recommendRules;
    runAll(user: AuthUser, id: string): Promise<{
        analysis: any;
        summary: any;
        score: {
            source: string;
            score: number;
            level: import("./scoring").ScoreLevel;
            baseScore: number;
            adjustment: number;
            breakdown: Record<string, number>;
            reasons: string[];
        };
        recommendations: any;
    }>;
    stored(user: AuthUser, id: string): Promise<{
        id: string;
        score: number | null;
        aiScoreDetails: Prisma.JsonValue;
        aiAnalysis: Prisma.JsonValue;
        aiSummary: Prisma.JsonValue;
        aiActions: Prisma.JsonValue;
        aiUpdatedAt: Date | null;
    } | null>;
}
