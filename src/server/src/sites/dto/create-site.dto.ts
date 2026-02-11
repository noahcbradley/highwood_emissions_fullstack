import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateSiteDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsNumber()
  emissionLimit: number;

  @IsOptional()
  @IsNumber()
  totalEmissionsToDate?: number;
}
