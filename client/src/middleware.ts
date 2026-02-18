import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED_ROUTES = ['/dashboard', '/orders', '/profile', '/wallet'];
const ADMIN_ROUTES = ['/admin'];
const AUTH_ROUTES = ['/login', '/register'];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const accessToken = request.cookies.get('accessToken')?.value;
    const userRoles = request.cookies.get('userRoles')?.value;

    const isAuthenticated = !!accessToken;
    const roles: string[] = userRoles ? JSON.parse(userRoles) : [];
    const isAdmin = roles.includes('ADMIN');

    // Redirect authenticated users away from auth pages
    if (AUTH_ROUTES.some(route => pathname.startsWith(route))) {
        if (isAuthenticated) {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
    }

    // Protect admin routes
    if (ADMIN_ROUTES.some(route => pathname.startsWith(route))) {
        if (!isAuthenticated) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
        if (!isAdmin) {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
    }

    // Protect user routes
    if (PROTECTED_ROUTES.some(route => pathname.startsWith(route))) {
        if (!isAuthenticated) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images).*)'],
};
