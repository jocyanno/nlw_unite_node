import { prisma } from '../src/lib/prisma';

async function seed () {
  await prisma.event.create({
    data: {
      id: '026604dd-f04c-43e1-8ca0-4c286d18f8be',
      title: 'Unite Summit',
      slug: 'unite-summit',
      details: 'Um evento p/ devs apaixonados(as) por código!',
      maximumAttendees: 120
    }
  })
}

seed().then(() => {
  console.log('Database seeded')
  prisma.$disconnect()
})