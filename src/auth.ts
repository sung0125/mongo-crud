import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google, GitHub],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async signIn({ user, account }) {
      const apiUrl = process.env.API_URL;
      const { name, email } = user;
      if (account?.provider === 'google' || account?.provider === 'github') {
        try {
          // MongoDB 관련 작업은 API로 처리
          const userCheckResponse = await fetch(`${apiUrl}/api/user/check`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
          });

          if (userCheckResponse.ok) {
            const userExists = await userCheckResponse.json();
            if (!userExists) {
              const createUserResponse = await fetch(`${apiUrl}/api/user`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email }),
              });

              if (!createUserResponse.ok) {
                throw new Error('Failed to create user');
              }
            }
          }

          const logResponse = await fetch(`${apiUrl}/api/log`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
          });

          if (logResponse.ok) {
            return true;
          }
        } catch (error) {
          console.error('Error during sign-in:', error);
          return false;
        }
      }
      return true;
    },
  },
});
