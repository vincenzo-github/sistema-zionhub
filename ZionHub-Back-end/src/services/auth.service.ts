import bcrypt from 'bcryptjs';
import { generateToken, generateActivationToken } from '../utils/jwt';
import { User, JWTPayload } from '../types/models';
import { logger } from '../config/logger';
import { UserStorage } from '../storage/user.storage';

export async function loginUser(
  churchId: string | undefined,
  email: string,
  password: string
): Promise<{ user: User; token: string } | null> {
  try {
    const userStorage = new UserStorage();
    
    let user: User | null;
    
    // Se churchId foi fornecido, busca na church específica
    // Caso contrário, busca globalmente
    if (churchId) {
      user = await userStorage.getUserByEmail(churchId, email);
    } else {
      user = await userStorage.getUserByEmailGlobal(email);
    }

    if (!user) {
      logger.warn(`Login attempt failed for ${email}`);
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      logger.warn(`Invalid password for user ${email}`);
      return null;
    }

    // Update last login
    await userStorage.updateLastLogin(user.id);

    const token = generateToken({
      userId: user.id,
      churchId: user.church_id,
      email: user.email,
      role: user.role,
      isMaster: user.is_master,
    } as JWTPayload);

    return { user, token };
  } catch (err) {
    logger.error('Login error:', err);
    throw err;
  }
}

export async function createUser(
  churchId: string,
  email: string,
  password: string,
  fullName: string,
  isMaster: boolean = false
): Promise<User> {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const userStorage = new UserStorage();

    const user = await userStorage.createUser({
      church_id: churchId,
      email,
      password: hashedPassword,
      full_name: fullName,
      is_master: isMaster,
      role: isMaster ? 'master' : 'member',
      status: 'active',
    });

    logger.info(`User created: ${user.id} (${email})`);
    return user;
  } catch (err) {
    logger.error('Create user error:', err);
    throw err;
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}