import Google from 'next-auth/providers/google';
// import { authOptions } from '@/server/auth';
import axios from '@/lib/axios';
import { AuthOptions } from 'next-auth';
import NextAuth from 'next-auth/next';
import { authOptions } from './options';
async function refreshToken(expired: string) {
  const expiryDate = new Date(expired);
  // console.log(Date.now() / 1000 - expiryDate.getTime() / 1000);
  // if (Date.now() / 1000 > expired.getTime() / 1000) {
  //   console.log('Token expired');
  //   return;
  // }
}


const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
