import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import type { Role } from "@/lib/rbac";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials, req) {
        void req;
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Credenciais inválidas");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          throw new Error("Usuário não encontrado");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password,
        );

        if (!isPasswordValid) {
          throw new Error("Senha Incorreta");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role as Role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.role = token.role;
        session.user.id = token.id;
      }
      return session;
    },
  },
  events: {
    async signIn({ user }) {
      const userId = (user as { id?: string }).id;
      if (!userId) return;

      await prisma.auditLog
        .create({
          data: {
            userId,
            action: "auth.login",
            entity: "User",
            entityId: userId,
            metadata: { email: user.email },
          },
        })
        .catch(() => null);
    },
    async signOut({ token }) {
      const userId = (token as { id?: string } | undefined)?.id;
      if (!userId) return;

      await prisma.auditLog
        .create({
          data: {
            userId,
            action: "auth.logout",
            entity: "User",
            entityId: userId,
          },
        })
        .catch(() => null);
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

if (process.env.NODE_ENV === "production" && !process.env.NEXTAUTH_SECRET) {
  throw new Error("❌ NEXTAUTH_SECRET não definido em ambiente de produção!");
}
