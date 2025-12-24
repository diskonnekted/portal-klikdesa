import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        console.log("Authorizing user...");
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          console.log(`Checking user: ${email}`);
          const user = await prisma.pengguna.findUnique({ where: { email } });
          if (!user) {
             console.log("User not found");
             return null;
          }
          
          console.log("User found, comparing password...");
          const passwordsMatch = await bcrypt.compare(password, user.kataSandi);

          if (passwordsMatch) {
            console.log("Password match!");
            return {
                id: user.id.toString(),
                name: user.namaLengkap,
                email: user.email,
                image: user.avatar,
                peran: user.peran,
            };
          } else {
             console.log("Password mismatch");
          }
        } else {
            console.log("Invalid credentials format");
        }

        console.log('Invalid credentials');
        return null;
      },
    }),
  ],
});
