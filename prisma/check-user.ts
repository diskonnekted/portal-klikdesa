import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function check() {
  const users = await prisma.pengguna.findMany();
  console.log(users);
}

check()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
  });
