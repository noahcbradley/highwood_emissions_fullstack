import { Controller, Get, Param } from '@nestjs/common';
import { SitesService } from './sites.service';

@Controller('sites')
export class SitesController {
  constructor(private readonly sitesService: SitesService) {}

  @Get()
  getAll() {
    return this.sitesService.findAll();
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.sitesService.findOne(Number(id));
  }
}
