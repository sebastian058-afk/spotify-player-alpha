import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export const middleware = async( req ) => {
    // Token will exits if user is logged in
    const token = await getToken( { req, secret: process.env.JWT_SECRET });
    const { pathname } = req.nextUrl;

    // Allow the requests if the following is true...
    // 1) Its a request for next-auth session & provider fetching
    // 2) The token exists

    if (pathname.startsWith("/_next")) return NextResponse.next();

	if (pathname.includes('/api/auth') || token) {
		return NextResponse.next()
	}

	if (!token && pathname !== '/login') {
		const loginUrl = new URL('/login', req.url)
		return NextResponse.redirect(loginUrl)
	}
}