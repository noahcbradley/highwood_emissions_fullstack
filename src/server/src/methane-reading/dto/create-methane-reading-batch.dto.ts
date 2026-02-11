import { Type } from 'class-transformer'
import { IsArray, ValidateNested } from 'class-validator'
import { CreateMethaneReadingDto } from './create-methane-reading.dto'

export class CreateMethaneReadingsBatchDto {
  @IsArray() // ensures it is an array
  @ValidateNested({ each: true }) // validates each item in the array
  @Type(() => CreateMethaneReadingDto) // transforms plain objects into class instances
  readings: CreateMethaneReadingDto[]
}
