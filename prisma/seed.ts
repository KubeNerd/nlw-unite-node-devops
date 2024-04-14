import { prismaClient } from "../src/lib/prisma";

async function seed() {

    const eventId = '9e9bd979-9d10-4915-b339-3786b1634f33'
    await prismaClient.event.create({
        data: {
          id: eventId,
          title: 'Unite Summit',
          slug: 'unite-summit',
          details: 'Um evento p/ devs apaixonados(as) por código!',
          maximumAttendees: 120,
        }
      })

}


seed().then(() =>{
    console.log('Database seeded!');
    prismaClient.$disconnect()
});