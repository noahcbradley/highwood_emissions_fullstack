import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { CreateSiteDto } from './dto/create-site.dto'

@Injectable()
export class SitesService {
  constructor(private prisma: PrismaService) {}

  private getComplianceStatus(
    total: number,
    limit: number,
  ): 'WITHIN_LIMIT' | 'LIMIT_EXCEEDED' {
    return total <= limit ? 'WITHIN_LIMIT' : 'LIMIT_EXCEEDED'
  }

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

  async getSiteMetrics(siteId: string) {
    const site = await this.prisma.site.findUnique({
      where: { id: siteId },
      select: {
        id: true,
        name: true,
        totalEmissionsToDate: true,
        emissionLimit: true,
        methaneReadings: {
          select: { timestamp: true },
          orderBy: { timestamp: 'desc' },
          take: 1,
        },
      },
    })

    if (!site) {
      throw new NotFoundException('Site not found')
    }

    const percentOfLimit =
      (site.totalEmissionsToDate / site.emissionLimit) * 100

    return {
      siteId: site.id,
      name: site.name,
      totalEmissionsToDate: site.totalEmissionsToDate,
      emissionLimit: site.emissionLimit,
      percentOfLimit,
      complianceStatus: this.getComplianceStatus(
        site.totalEmissionsToDate,
        site.emissionLimit,
      ),
      lastReadingAt: site.methaneReadings[0]?.timestamp ?? null,
    }
  }
}
