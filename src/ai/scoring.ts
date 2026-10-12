import { Interaction, Prospect } from '@prisma/client';

export type ScoreLevel = 'HOT' | 'WARM' | 'COLD';
export interface ScoreResult {
  score: number;
  level: ScoreLevel;
  breakdown: Record<string, number>;
}

const DAY = 86_400_000;
export const levelOf = (s: number): ScoreLevel => (s >= 70 ? 'HOT' : s >= 40 ? 'WARM' : 'COLD');

const STATUS_POINTS: Record<string, number> = {
  NEW: 5,
  CONTACTED: 10,
  QUALIFIED: 18,
  NEGOTIATION: 22,
  PROPOSAL_SENT: 25, // si vous ajoutez ce statut à l'enum
};

/** Score déterministe 0-100 : budget (25) + avancement (25) + engagement (28) + récence (15) + complétude (10). */
export function baseScore(p: Prospect, interactions: Interaction[]): ScoreResult {
  if (p.status === 'WON') return { score: 100, level: 'HOT', breakdown: { status: 100 } };
  if (p.status === 'LOST') return { score: 0, level: 'COLD', breakdown: { status: 0 } };

  const v = p.estimatedValue ?? 0;
  const budget = v <= 0 ? 0 : v < 5_000 ? 5 : v < 20_000 ? 12 : v < 50_000 ? 18 : 25;
  const status = STATUS_POINTS[p.status] ?? 0;

  const meetings = interactions.filter((i) => i.type === 'REUNION').length;
  const engagement = Math.min(interactions.length, 6) * 3 + Math.min(meetings, 2) * 5;

  const last = interactions.length ? Math.max(...interactions.map((i) => i.date.getTime())) : null;
  const age = last === null ? Infinity : (Date.now() - last) / DAY;
  const recency = age <= 3 ? 15 : age <= 7 ? 10 : age <= 14 ? 5 : age <= 30 ? 2 : 0;

  const completeness =
    [p.email, p.phone, p.jobTitle, p.industry, p.region].filter(Boolean).length * 2;

  const breakdown = { budget, status, engagement, recency, completeness };
  const score = Math.max(0, Math.min(100, Object.values(breakdown).reduce((a, n) => a + n, 0)));
  return { score, level: levelOf(score), breakdown };
}
