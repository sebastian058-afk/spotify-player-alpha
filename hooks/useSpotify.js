import { useSession } from "next-auth/react";
import { signIn, useEffect } from "react";
import spotifyApi from "../lib/spotify";

const useSpotify = () => {
    const { data: session, status } = useSession();

    useEffect(() => {
        if (session) {
            // If refresh access token attempt fails, redirect to login...
            if (session.error === 'RefreshAccessTokenError') {
                signIn();
            }

            spotifyApi.setAccessToken(session.user.accessToken);
        }
    }, [session])


    return spotifyApi;
}

export default useSpotify;