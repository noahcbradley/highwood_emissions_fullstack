import { Controller, Get, Param, Post, Body } from '@nestjs/common'
import { SitesService } from './sites.service'
import { CreateSiteDto } from './dto/create-site.dto'

@Controller('sites')
export class SitesController {
  constructor(private readonly sitesService: SitesService) {}

  @Get()
  getAll() {
    return this.sitesService.findAll()
  }

  @Get(':id/metrics')
  getSiteMetrics(@Param('id') id: string) {
    return this.sitesService.getSiteMetrics(id)
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.sitesService.findOne(id)
  }

  @Post()
  create(@Body() dto: CreateSiteDto) {
    return this.sitesService.create(dto)
  }
}
