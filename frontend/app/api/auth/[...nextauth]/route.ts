import NextAuth from 'next-auth';
import { NextAuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'read:user user:email'
        }
      }
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session?.user) {
        session.user.id = user.id;
        
        // Get the GitHub username from the user's accounts
        const account = await prisma.account.findFirst({
          where: {
            userId: user.id,
            provider: 'github'
          }
        });
        
        if (account?.providerAccountId) {
          // Update user with GitHub username if not already set
          await prisma.user.update({
            where: { id: user.id },
            data: { 
              githubUsername: session.user.name || account.providerAccountId 
            }
          });
        }
      }
      return session;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
      }
      if (account?.provider === 'github') {
        token.githubUsername = account.providerAccountId;
      }
      return token;
    }
  },
  session: {
    strategy: 'database'
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };