import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { CreateSiteDto } from './dto/create-site.dto'

@Injectable()
export class SitesService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.site.findMany()
  }

  create(data: CreateSiteDto) {
    return this.prisma.site.create({
      data: {
        name: data.name,
        location: data.location,
        emissionLimit: data.emissionLimit,
        totalEmissionsToDate: data.totalEmissionsToDate ?? 0,
      },
    })
  }

  findOne(id: string) {
    return this.prisma.site.findUnique({ where: { id } })
  }
}
