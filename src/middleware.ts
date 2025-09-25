import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {

    const userCookie = request.cookies.get('user');
    const user = userCookie && userCookie.value && userCookie.value !== 'undefined' ? JSON.parse(userCookie.value) : null;

    const publicPaths = ['/login', '/register'];
    if (user) {
        if (request.nextUrl.pathname === '/onboarding' && !user.first_login) {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }

        if(request.nextUrl.pathname.startsWith('/dashboard') && user.first_login){
            return NextResponse.redirect(new URL('/onboarding', request.url));
        }

        if (request.nextUrl.pathname === '/' || publicPaths.includes(request.nextUrl.pathname)) {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
    }

    if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/',
        '/login',
        '/register',
        '/dashboard/:path*',
        '/onboarding'
    ],
};
