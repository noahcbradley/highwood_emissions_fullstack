import { Module } from '@nestjs/common'
import { SitesModule } from './sites/sites.module'
import { PrismaModule } from 'prisma/prisma.module'
import { MethaneReadingModule } from './methane-reading/methane-reading.module'

@Module({
  imports: [SitesModule, PrismaModule, MethaneReadingModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
