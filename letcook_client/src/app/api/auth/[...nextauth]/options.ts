import { AuthOptions } from "next-auth";
import Google from "next-auth/providers/google";
import axios from "@/lib/axios";

interface User {
    id: string;
    username: string;
    email: string;
    avatar: string;
}


export const authOptions: AuthOptions = {
    secret: process.env.SECRET,
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
    ],
    session: {
        maxAge: 1000 * 60, //15 minutes
    },
    callbacks: {
        async signIn({ user, account, profile, email, credentials }) {
            const initUser: User = {
                id: user.id as string,
                username: user.name as string,
                email: user.email as string,
                avatar: user.image as string,
            };
            const res = await axios.post(`/api/auth/authenticate`, initUser);
            // const data = res.data; // {}
            if (res.data) {
                user.id = res.data.user.id;
                user.username = res.data.user.username;
                user.email = res.data.user.email;
                user.avatar = res.data.user.avatar;
                user.role = res.data.user.role;
                user.accessToken = res.data.jwtAccessToken;
                user.refreshToken = res.data.jwtRefreshToken;
                return true;
            } else {
                return false;
            }
        },
        async jwt({ token, user, trigger }) {
            // console.log('jwt chay');
            if (user) {
                token.accessToken = user.accessToken;
                token.refreshToken = user.refreshToken;
                token.id = user.id;
                token.username = user.username;
                token.email = user.email;
                token.avatar = user.avatar;
                token.role = user.role;
            }

            if (trigger === 'update' && user) {
                return { ...token, ...user };
            }
            return token;
        },
        async session({ session, token }) {
            session.user.accessToken = token.accessToken as string;
            session.user.refreshToken = token.refreshToken as string;
            session.user.id = token.id as string;
            session.user.username = token.username as string;
            session.user.email = token.email as string;
            session.user.avatar = token.avatar as string;
            session.user.role = token.role as 'user' | 'admin';

            return session;
        },
    },
};