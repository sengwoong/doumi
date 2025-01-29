import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
} = NextAuth({
  pages: {
    signIn: '/sigin',
    newUser: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        try {
          console.log('credentials', credentials);
          
          // user 정보는 credentials.user에서 파싱
          const user = JSON.parse(credentials.user as string);
          console.log('Parsed user:', user);

          return {
            id: user.id,
            email: user.email,
            username: user.username,
            role: user.role,
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.user;
      return session;
    }
  }
});