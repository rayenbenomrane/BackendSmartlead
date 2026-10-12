import { Controller, Get, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'; 
import { AuthUser, CurrentUser } from '../common/current-user.decorator';
import { AiService } from './ai.service';

@UseGuards(JwtAuthGuard)
@Controller('ai')
export class AiController {
  constructor(private readonly ai: AiService) {}

  @Get('prospects/:id') stored(@CurrentUser() u: AuthUser, @Param('id') id: string) { return this.ai.stored(u, id); }
  @Post('prospects/:id/analyze') analyze(@CurrentUser() u: AuthUser, @Param('id') id: string) { return this.ai.analyze(u, id); }
  @Post('prospects/:id/summarize') summarize(@CurrentUser() u: AuthUser, @Param('id') id: string) { return this.ai.summarize(u, id); }
  @Post('prospects/:id/score') score(@CurrentUser() u: AuthUser, @Param('id') id: string) { return this.ai.score(u, id); }
  @Post('prospects/:id/recommend') recommend(@CurrentUser() u: AuthUser, @Param('id') id: string) { return this.ai.recommend(u, id); }
  @Post('prospects/:id/run-all') runAll(@CurrentUser() u: AuthUser, @Param('id') id: string) { return this.ai.runAll(u, id); }

  @Post('businesses/:businessId/score-all')
  scoreAll(@CurrentUser() u: AuthUser, @Param('businessId') b: string) { return this.ai.scoreAll(u, b); }

  @Get('businesses/:businessId/priorities')
  priorities(
    @CurrentUser() u: AuthUser,
    @Param('businessId') b: string,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    return this.ai.priorities(u, b, Math.min(limit ?? 10, 100));
  }
}
