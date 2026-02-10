import { Module } from '@nestjs/common';
import { SitesModule } from './sites/sites.module';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  imports: [SitesModule, PrismaModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
