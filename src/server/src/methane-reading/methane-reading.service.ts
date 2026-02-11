import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { CreateMethaneReadingsBatchDto } from './dto/create-methane-reading-batch.dto'

@Injectable()
export class MethaneReadingService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateMethaneReadingsBatchDto) {
    // Prisma createMany ignores individual model validations, but is super fast
    return this.prisma.methaneReading.createMany({
      data: data.readings,
      skipDuplicates: true,
    })
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
