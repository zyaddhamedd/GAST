import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('FATAL: JWT_SECRET environment variable is not defined!');
  }
  console.warn('WARNING: JWT_SECRET is not defined. Using a temporary secret for development only.');
}

const secret = new TextEncoder().encode(JWT_SECRET || 'temp-dev-secret-unsafe');

export interface TokenPayload {
  userId: number;
  role: string;
  [key: string]: unknown;
}

export async function signToken(payload: TokenPayload): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secret);
}

export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as TokenPayload;
  } catch (error) {
    // Gracefully handle invalid or expired tokens
    return null;
  }
}
