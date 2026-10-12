import { IsDateString, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { InteractionType } from '@prisma/client';

export class CreateInteractionDto {
  @IsEnum(InteractionType) type: InteractionType;
  @IsString() @MinLength(1) description: string;
  @IsOptional() @IsDateString() date?: string;
}

export class UpdateInteractionDto {
  @IsOptional() @IsEnum(InteractionType) type?: InteractionType;
  @IsOptional() @IsString() @MinLength(1) description?: string;
  @IsOptional() @IsDateString() date?: string;
}
