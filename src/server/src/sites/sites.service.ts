import { Injectable } from '@nestjs/common';

@Injectable()
export class SitesService {
  private sites = [
    { id: 1, name: 'Well Pad 1', emissionLimit: 100 },
    { id: 2, name: 'Well Pad 2', emissionLimit: 200 },
  ];

  findAll() {
    return this.sites;
  }

  findOne(id: number) {
    return this.sites.find((site) => site.id === id);
  }
}
