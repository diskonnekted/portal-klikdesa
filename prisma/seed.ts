import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;
  if (!email || !password) {
    throw new Error('Missing SEED_ADMIN_EMAIL or SEED_ADMIN_PASSWORD');
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await prisma.pengguna.upsert({
    where: { email: email },
    update: {},
    create: {
      email,
      namaLengkap: 'Administrator',
      kataSandi: hashedPassword,
      peran: 'ADMIN',
      aktif: true,
      telepon: '08123456789',
      alamat: 'Kantor Desa Sijenggung',
    },
  });

  console.log({ id: admin.id, email: admin.email, peran: admin.peran });
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

