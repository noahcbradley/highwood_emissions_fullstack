import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { CreateMethaneReadingsBatchDto } from './dto/create-methane-reading-batch.dto'

@Injectable()
export class MethaneReadingService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateMethaneReadingsBatchDto) {
    if (data.readings.length === 0) {
      return {
        success: true,
        recordsSubmitted: 0,
        recordsInserted: 0,
        recordsSkipped: 0,
      }
    }

    const siteIds = Array.from(new Set(data.readings.map((r) => r.siteId)))

    // The following transaction ensures atomicity during the creation of new readings
    const result = await this.prisma.$transaction(async (tx) => {
      // Insert readings
      const insertResult = await tx.methaneReading.createMany({
        data: data.readings,
        skipDuplicates: true,
      })

      // Recalculate totals
      const totalsFromDb = await tx.methaneReading.groupBy({
        by: ['siteId'],
        where: { siteId: { in: siteIds } },
        _sum: { value: true },
      })

      // Update sites
      await Promise.all(
        totalsFromDb.map((t) =>
          tx.site.update({
            where: { id: t.siteId },
            data: { totalEmissionsToDate: t._sum.value || 0 },
          }),
        ),
      )

      return insertResult
    })

    return {
      success: true,
      recordsSubmitted: data.readings.length,
      recordsInserted: result.count,
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
