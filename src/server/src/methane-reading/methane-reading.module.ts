import { Module } from '@nestjs/common'
import { MethaneReadingService } from './methane-reading.service'
import { MethaneReadingController } from './methane-reading.controller'
import { PrismaModule } from '../../prisma/prisma.module'

@Module({
  imports: [PrismaModule],
  providers: [MethaneReadingService],
  controllers: [MethaneReadingController],
})
export class MethaneReadingModule {}
