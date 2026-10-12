import { Controller, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'; 
import { AuthUser, CurrentUser } from '../common/current-user.decorator';
import { AiService } from './ai.service';

/** Every endpoint returns the updated lead (with interactions + stored AI results). */
@UseGuards(JwtAuthGuard)
@Controller('ai/leads/:id')
export class AiController {
  constructor(private ai: AiService) {}

  @Post('analyze')   analyze(@CurrentUser() u: AuthUser, @Param('id') id: string)   { return this.ai.analyze(u, id); }
  @Post('summarize') summarize(@CurrentUser() u: AuthUser, @Param('id') id: string) { return this.ai.summarize(u, id); }
  @Post('score')     score(@CurrentUser() u: AuthUser, @Param('id') id: string)     { return this.ai.score(u, id); }
  @Post('recommend') recommend(@CurrentUser() u: AuthUser, @Param('id') id: string) { return this.ai.recommend(u, id); }
  @Post('refresh')   refresh(@CurrentUser() u: AuthUser, @Param('id') id: string)   { return this.ai.refreshAll(u, id); }
}
