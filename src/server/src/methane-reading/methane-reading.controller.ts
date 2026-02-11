import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { MethaneReadingService } from './methane-reading.service'
import { CreateMethaneReadingsBatchDto } from './dto/create-methane-reading-batch.dto'

@Controller('methane-readings')
export class MethaneReadingController {
  constructor(private readonly service: MethaneReadingService) {}

  @Post('ingest')
  async create(@Body() data: CreateMethaneReadingsBatchDto) {
    return this.service.create(data)
  }

  @Get()
  async findAll() {
    return this.service.findAll()
  }

  @Get(':siteId')
  async findBySite(@Param('siteId') siteId: string) {
    return this.service.findBySite(siteId)
  }
}
