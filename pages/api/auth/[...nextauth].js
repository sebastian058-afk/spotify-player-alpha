import NextAuth from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import spotifyApi, { LOGIN_URL } from '../../../lib/spotify';

const refreshAccessToken = async (token) => {
    try {
        spotifyApi.setAccessToken(token.accessToken);
        spotifyApi.setRefreshToken(token.refreshToken);

        const { body: refreshedToken } = await spotifyApi.refreshAccessToken();

        return {
            ...token,
            accessToken: refreshedToken.accessToken,
            accessTokenExpires: Date.now + refreshedToken.expires_in * 1000, // = 1 hour as 3600 is returned from API
            refreshToken: refreshedToken.refresh_token ?? token.refreshToken, // Replace if new one came back else fallback to old refresh token
        };

    } catch (error) {
        console.error(error);
        return {
            ...token,
            error: 'RefreshAccessTokenError',
        }
    }
}

export default NextAuth({

    providers: [
        SpotifyProvider({
            clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
            clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
            authorization: LOGIN_URL,
        }),
    ],
    secret: process.env.JWT_SECRET,
    pages: {
        signIn: '/login'
    },
    callbacks: {
        async jwt({ token, account, user }) {
            // initial sign in

            if (account && user) {

                return {
                    ...token,
                    accessToken: account.accessToken,
                    refreshToken: account.refresh_token,
                    username: account.providerAccountId,
                    accessTokenExpires: account.expires_at * 1000, // handling expiry times in milliseconds hence * 1000
                }
            }

            // Return previus token if the acces token has not expired yet
            if (Date.now() < token.accessTokenExpires) {
                console.log("Existing token is valid");
                return token;
            }

            // Access token has expired, so we need to refresh it...
            console.log("Access token has expired, refreshing...");
            return await refreshAccessToken(token);

        },
        async session({ session, token  }) {
            console.log(spotifyApi.getAccessToken());
            session.user.accessToken = token.accessToken;
            session.user.refreshToken = token.accessToken;
            session.user.username = token.username;
    
            //console.log(token);
            //console.log(session);
            return session;
        },
    },
});