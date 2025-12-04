import jwt, { SignOptions } from 'jsonwebtoken';
import { JWTPayload } from '../types/models';

function getJWTSecret(): string {
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  return JWT_SECRET;
}

export function generateToken(payload: JWTPayload): string {
  const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
  const secret = getJWTSecret();
  return jwt.sign(
    {
      userId: payload.userId,
      churchId: payload.churchId,
      email: payload.email,
      role: payload.role,
      isMaster: payload.isMaster,
    },
    secret,
    {
      expiresIn: JWT_EXPIRES_IN,
      issuer: 'zionhub',
    } as SignOptions
  );
}

export function verifyToken(token: string): JWTPayload {
  try {
    const decoded = jwt.verify(token, getJWTSecret(), {
      issuer: 'zionhub',
    }) as JWTPayload;
    return decoded;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}

export function generateSetupToken(): string {
  return jwt.sign(
    { type: 'setup' },
    getJWTSecret(),
    { expiresIn: '7d' }
  );
}

export function generateActivationToken(): string {
  return jwt.sign(
    { type: 'activation' },
    getJWTSecret(),
    { expiresIn: '24h' }
  );
}
