import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create some sites
  const sites = await prisma.site.createMany({
    data: [
      {
        name: 'Highwood Pad A',
        location: 'Alberta, Canada',
        emissionLimit: 2000,
      },
      {
        name: 'Highwood Pad B',
        location: 'Alberta, Canada',
        emissionLimit: 1500,
      },
      {
        name: 'Highwood Pad C',
        location: 'Alberta, Canada',
        emissionLimit: 1800,
      },
    ],
    skipDuplicates: true,
  })

  console.log(`Inserted ${sites.count} sites.`)

  // Fetch the sites so we can get their IDs
  const allSites = await prisma.site.findMany()

  // Create methane readings for each site
  const readingsData: any[] = []

  const now = new Date()

  for (const site of allSites) {
    for (let i = 0; i < 30; i++) {
      readingsData.push({
        siteId: site.id,
        value: Math.random() * 50, // random methane reading
        timestamp: new Date(now.getTime() - i * 60 * 60 * 1000), // each reading 1 hour apart
      })
    }
  }

  const readings = await prisma.methaneReading.createMany({
    data: readingsData,
    skipDuplicates: true,
  })

  console.log(`Inserted ${readings.count} methane readings.`)

  // Update totalEmissionsToDate per site
  for (const site of allSites) {
    const total = await prisma.methaneReading.aggregate({
      where: { siteId: site.id },
      _sum: { value: true },
    })

    await prisma.site.update({
      where: { id: site.id },
      data: {
        totalEmissionsToDate: total._sum.value || 0,
      },
    })
  }

  console.log('Updated totalEmissionsToDate for each site.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
