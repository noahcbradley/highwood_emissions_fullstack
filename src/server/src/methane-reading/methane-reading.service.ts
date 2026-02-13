import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { CreateMethaneReadingsBatchDto } from './dto/create-methane-reading-batch.dto'

@Injectable()
export class MethaneReadingService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateMethaneReadingsBatchDto) {
    let result: any = {}
    if (data.readings.length !== 0) {
      // Insert all readings (skip duplicates)
      result = await this.prisma.methaneReading.createMany({
        data: data.readings,
        skipDuplicates: true,
      })

      // Get affected site IDs
      const siteIds = Array.from(new Set(data.readings.map((r) => r.siteId)))

      // Recalculate totals per site from DB
      const totalsFromDb = await this.prisma.methaneReading.groupBy({
        by: ['siteId'],
        where: { siteId: { in: siteIds } },
        _sum: { value: true },
      })

      // Update totalEmissionsToDate for each site
      const updateOps = totalsFromDb.map((t) =>
        this.prisma.site.update({
          where: { id: t.siteId },
          data: { totalEmissionsToDate: t._sum.value || 0 },
        }),
      )

      await this.prisma.$transaction(updateOps)
    }
    return {
      success: true,
      recordsSubmitted: data.readings.length,
      recordsInserted: result.count, // only the new rows
      recordsSkipped: data.readings.length - result.count,
    }
  }

  findAll() {
    return this.prisma.methaneReading.findMany()
  }

  findBySite(siteId: string) {
    return this.prisma.methaneReading.findMany({
      where: { siteId },
    })
  }
}
