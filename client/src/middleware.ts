import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Route protection disabled for review deployment
// Auth is handled client-side via RouteGuard component
export function middleware(_request: NextRequest) {
    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images).*)'],
};
