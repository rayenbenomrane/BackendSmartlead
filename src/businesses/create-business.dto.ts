import {
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUrl,
} from 'class-validator';

export class CreateBusinessDto {
    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsString()
    @IsNotEmpty()
    matriculeFiscale!: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsNotEmpty()
    region!: string;

    @IsString()
    @IsNotEmpty()
    serviceDomain!: string;

    @IsString()
    @IsOptional()
    phone?: string;

    @IsEmail()
    @IsOptional()
    email?: string;

    @IsString()
    @IsOptional()
    address?: string;

    @IsUrl()
    @IsOptional()
    website?: string;
}