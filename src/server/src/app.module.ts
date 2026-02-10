import { Module } from '@nestjs/common';
import { SitesModule } from './sites/sites.module';

@Module({
  imports: [SitesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
