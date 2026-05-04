import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/jwt';

/**
 * PRODUCTION-GRADE MIDDLEWARE
 * Handles route protection, token verification, and CORS.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Define Protection Scope
  const isAdminPath = pathname.startsWith('/admin') && !pathname.startsWith('/admin/login');
  const isAdminApiPath = pathname.startsWith('/api/admin');

  // 2. Handle Admin Protection
  if (isAdminPath || isAdminApiPath) {
    const token = request.cookies.get('admin-token')?.value;

    if (!token) {
      if (isAdminApiPath) {
        return new NextResponse(
          JSON.stringify({ error: 'Authentication required' }),
          { status: 401, headers: { 'Content-Type': 'application/json' } }
        );
      }
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Verify JWT
    const payload = await verifyToken(token);

    if (!payload || payload.role !== 'ADMIN') {
      if (isAdminApiPath) {
        return new NextResponse(
          JSON.stringify({ error: 'Unauthorized: Admin privileges required' }),
          { status: 403, headers: { 'Content-Type': 'application/json' } }
        );
      }
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  const response = NextResponse.next();

  // 3. CORS Policy
  if (pathname.startsWith('/api')) {
    const origin = request.headers.get('origin');
    
    // In production, you should specify your Railway domain here
    const allowedOrigins = [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      // The middleware will allow the current host if it's the same
      request.nextUrl.origin 
    ];

    if (origin && (allowedOrigins.includes(origin) || origin.endsWith('.railway.app'))) {
      response.headers.set('Access-Control-Allow-Origin', origin);
    }

    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.headers.set('Access-Control-Allow-Credentials', 'true');
  }

  return response;
}

// Matcher for middleware
export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
  ],
};
