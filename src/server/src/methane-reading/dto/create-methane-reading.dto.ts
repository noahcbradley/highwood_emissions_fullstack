import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator'
import { Type } from 'class-transformer'

export class CreateMethaneReadingDto {
  @IsString()
  siteId: string

  @IsNumber()
  value: number

  @IsDate()
  @Type(() => Date)
  timestamp: Date
}
