import { Transform, Type } from 'class-transformer';
import { IsEmail, IsInt, IsEnum, IsIn, IsNumber, IsOptional, IsString, Min, MinLength, Max } from 'class-validator';
import { PaginationDto } from '../common/pagination.dto';
import { ProspectStatus } from '@prisma/client';
import { ProspectSource } from '@prisma/client';

const emptyToUndef = ({ value }: { value: any }) => (value === '' || value === null ? undefined : value);



export class CreateProspectDto {
  @IsString()
  contactName!: string;

  @IsString()
  companyName!: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  industry?: string;

  @IsOptional()
  @IsEnum(ProspectSource)
  source?: ProspectSource;

  @IsOptional()
  @IsEnum(ProspectStatus)
  status?: ProspectStatus;

  @IsOptional()
  @IsNumber()
  @Min(0)
  estimatedValue?: number;
}

export class UpdateProspectDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  contactName?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  companyName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  jobTitle?: string;

  @IsOptional()
  @IsString()
  industry?: string;

  @IsOptional()
  @IsString()
  region?: string;

  @IsOptional()
  @IsString()
  website?: string;

  @IsOptional()
  @IsEnum(ProspectSource)
  source?: ProspectSource;

  @IsOptional()
  @IsEnum(ProspectStatus)
  status?: ProspectStatus;

  @IsOptional()
  @IsNumber()
  @Min(0)
  estimatedValue?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}

export const SORT_FIELDS = ['createdAt', 'updatedAt', 'contactName', 'companyName', 'estimatedBudget', 'status'] as const;

export class ListProspectsDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit = 10;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(ProspectStatus)
  status?: ProspectStatus;

  @IsOptional()
  @IsIn([
    'createdAt',
    'firstName',
    'lastName',
    'company',
    'email',
    'status',
    'estimatedValue',
  ])
  sortBy = 'createdAt';

  @IsOptional()
  @IsIn(['asc', 'desc', 'ASC', 'DESC'])
  order: 'asc' | 'desc' = 'desc';
}
