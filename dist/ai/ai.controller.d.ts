import { AuthUser } from '../common/current-user.decorator';
import { AiService } from './ai.service';
export declare class AiController {
    private readonly ai;
    constructor(ai: AiService);
    stored(u: AuthUser, id: string): Promise<{
        id: string;
        score: number | null;
        aiScoreDetails: import("@prisma/client/runtime/library").JsonValue;
        aiAnalysis: import("@prisma/client/runtime/library").JsonValue;
        aiSummary: import("@prisma/client/runtime/library").JsonValue;
        aiActions: import("@prisma/client/runtime/library").JsonValue;
        aiUpdatedAt: Date | null;
    } | null>;
    analyze(u: AuthUser, id: string): Promise<any>;
    summarize(u: AuthUser, id: string): Promise<any>;
    score(u: AuthUser, id: string): Promise<{
        source: string;
        score: number;
        level: import("./scoring").ScoreLevel;
        baseScore: number;
        adjustment: number;
        breakdown: Record<string, number>;
        reasons: string[];
    }>;
    recommend(u: AuthUser, id: string): Promise<any>;
    runAll(u: AuthUser, id: string): Promise<{
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
    scoreAll(u: AuthUser, b: string): Promise<{
        updated: number;
    }>;
    priorities(u: AuthUser, b: string, limit?: number): Promise<{
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
}
