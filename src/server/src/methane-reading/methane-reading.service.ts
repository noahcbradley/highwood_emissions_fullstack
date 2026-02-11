import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { CreateMethaneReadingsBatchDto } from './dto/create-methane-reading-batch.dto'

@Injectable()
export class MethaneReadingService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateMethaneReadingsBatchDto) {
    const readings = data.readings.map((r) => ({
      siteId: r.siteId,
      value: r.value,
      timestamp: r.timestamp,
    }))

    // Group readings by site for total calculation
    const totalPerSite = readings.reduce(
      (acc, r) => {
        acc[r.siteId] = (acc[r.siteId] || 0) + r.value
        return acc
      },
      {} as Record<string, number>,
    )

    // Build array of operations
    const operations = [
      this.prisma.methaneReading.createMany({
        data: readings,
        skipDuplicates: true,
      }),
      ...Object.entries(totalPerSite).map(([siteId, sum]) =>
        this.prisma.site.update({
          where: { id: siteId },
          data: { totalEmissionsToDate: { increment: sum } }, // atomic increment
        }),
      ),
    ]

    // Run transaction
    await this.prisma.$transaction(operations)

    return {
      inserted: readings.length,
      totalsUpdated: Object.keys(totalPerSite).length,
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
