import { Injectable, Logger } from '@nestjs/common';

/**
 * Client LLM minimal (API Anthropic, sans dépendance supplémentaire).
 * Si ANTHROPIC_API_KEY est absent ou si l'appel échoue, renvoie null :
 * AiService bascule alors sur ses règles locales (le backend reste fonctionnel).
 */
@Injectable()
export class LlmService {
  private readonly logger = new Logger(LlmService.name);

  get enabled(): boolean {
    return !!process.env.ANTHROPIC_API_KEY;
  }

  async json<T>(system: string, user: string, maxTokens = 1200): Promise<T | null> {
    if (!this.enabled) return null;
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_API_KEY as string,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: process.env.AI_MODEL || 'claude-sonnet-5-5',
          max_tokens: maxTokens,
          system: `${system}\nRéponds UNIQUEMENT avec un objet JSON valide, sans texte autour ni balises markdown. Rédige en français.`,
          messages: [{ role: 'user', content: user }],
        }),
      });
      if (!res.ok) {
        this.logger.warn(`LLM HTTP ${res.status}: ${(await res.text()).slice(0, 200)}`);
        return null;
      }
      const data: any = await res.json();
      const text: string = (data.content ?? [])
        .filter((b: any) => b.type === 'text')
        .map((b: any) => b.text)
        .join('');
      const start = text.indexOf('{');
      const end = text.lastIndexOf('}');
      if (start === -1 || end === -1) return null;
      return JSON.parse(text.slice(start, end + 1)) as T;
    } catch (e) {
      this.logger.warn(`LLM indisponible : ${(e as Error).message}`);
      return null;
    }
  }
}
