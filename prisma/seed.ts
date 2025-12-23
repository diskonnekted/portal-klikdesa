import { PrismaClient, PeranPengguna } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@sijenggung.id';
  const password = 'password123';
  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await prisma.pengguna.upsert({
    where: { email: email },
    update: {},
    create: {
      email,
      namaLengkap: 'Administrator',
      kataSandi: hashedPassword,
      peran: PeranPengguna.ADMIN,
      aktif: true,
      telepon: '08123456789',
      alamat: 'Kantor Desa Sijenggung',
    },
  });

  console.log({ admin });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

