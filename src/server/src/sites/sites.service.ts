import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SitesService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.site.findMany();
  }

  findOne(id: number) {
    return this.prisma.site.findUnique({ where: { id } });
  }
}
