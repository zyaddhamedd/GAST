import { cookies } from 'next/headers';


import { verifyToken } from './jwt';

export interface AuthSession {
  userId: number;
  role: string;
}

/**
 * Verifies the admin-token cookie and returns the payload.
 * Useful for secondary protection and context retrieval in API routes.
 */
export async function getAuthSession(): Promise<AuthSession | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin-token')?.value;

    if (!token) return null;

    const payload = await verifyToken(token);
    
    if (!payload) return null;

    return {
      userId: payload.userId,
      role: payload.role,
    };
  } catch (error) {
    return null;
  }
}


/**
 * Middleware-like wrapper for API routes that requires authentication.
 * Returns a 401 response if not authenticated.
 */
export function withAuth(handler: (session: AuthSession) => Promise<Response>) {
  return async () => {
    const session = await getAuthSession();
    
    if (!session) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Authentication required' }),
        { status: 401, headers: { 'content-type': 'application/json' } }
      );
    }

    return handler(session);
  };
}
