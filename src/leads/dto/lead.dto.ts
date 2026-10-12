import { IsEmail, IsEnum, IsNumber, IsOptional, IsString, Min, MinLength } from 'class-validator';
import { LeadStatus } from '@prisma/client';

export class CreateLeadDto {
  @IsString() @MinLength(1) contactName: string;
  @IsString() @MinLength(1) companyName: string;
  @IsEmail() email: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() sector?: string;
  @IsOptional() @IsString() source?: string;
  @IsOptional() @IsNumber() @Min(0) estimatedBudget?: number;
  @IsOptional() @IsEnum(LeadStatus) status?: LeadStatus;
}

export class UpdateLeadDto {
  @IsOptional() @IsString() @MinLength(1) contactName?: string;
  @IsOptional() @IsString() @MinLength(1) companyName?: string;
  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() sector?: string;
  @IsOptional() @IsString() source?: string;
  @IsOptional() @IsNumber() @Min(0) estimatedBudget?: number;
  @IsOptional() @IsEnum(LeadStatus) status?: LeadStatus;
}
