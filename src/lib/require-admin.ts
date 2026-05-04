import { getAuthSession, AuthSession } from './auth-server';
import { NextResponse } from 'next/server';

/**
 * Ensures the user is authenticated and is an admin.
 * Use this in API routes.
 * 
 * @returns AuthSession if valid
 * @throws Error with status 401/403 if invalid
 */
export async function requireAdmin(): Promise<AuthSession> {
  const session = await getAuthSession();

  if (!session) {
    throw new Error('Unauthorized');
  }

  if (session.role !== 'ADMIN') {
    throw new Error('Forbidden');
  }

  return session;
}

/**
 * Reusable wrapper for API route handlers to catch requireAdmin errors
 * and return appropriate NextResponse.
 */
export function withAdminProtection(handler: (session: AuthSession, request: Request, context: any) => Promise<Response>) {
  return async (request: Request, context: any) => {
    try {
      const session = await requireAdmin();
      return await handler(session, request, context);
    } catch (error: any) {


      if (error.message === 'Unauthorized') {
        return new NextResponse(
          JSON.stringify({ error: 'Authentication required' }),
          { status: 401, headers: { 'Content-Type': 'application/json' } }
        );
      }
      if (error.message === 'Forbidden') {
        return new NextResponse(
          JSON.stringify({ error: 'Admin privileges required' }),
          { status: 403, headers: { 'Content-Type': 'application/json' } }
        );
      }
      console.error('[AUTH_ERROR]', error);
      return new NextResponse(
        JSON.stringify({ error: 'Internal Server Error' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  };
}
