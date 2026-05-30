import bcrypt from "bcryptjs";
import { BCRYPT_SALT_ROUNDS } from "../../config/constants";
import { AppError, isPostgresUniqueViolation } from "../../lib/errors";
import { signAccessToken } from "../../lib/jwt";
import type { JwtPayload } from "../../lib/jwt";
import type { LoginInput, RegisterInput } from "@repo/validation";
import {
  createUser,
  findUserByEmail,
  findUserById,
  type PublicUser,
} from "./auth.repository";

export type AuthResult = {
  user: PublicUser;
  token: string;
};

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function toAuthResult(user: PublicUser): AuthResult {
  const payload: JwtPayload = { sub: user.id, email: user.email };

  return {
    user,
    token: signAccessToken(payload),
  };
}

export class AuthService {
  async register(input: RegisterInput): Promise<AuthResult> {
    const email = normalizeEmail(input.email);

    const existing = await findUserByEmail(email);
    if (existing) {
      throw new AppError(409, "Email is already registered.", "email_taken");
    }

    const passwordHash = await bcrypt.hash(input.password, BCRYPT_SALT_ROUNDS);

    try {
      const user = await createUser(email, passwordHash);
      return toAuthResult(user);
    } catch (error) {
      if (isPostgresUniqueViolation(error)) {
        throw new AppError(409, "Email is already registered.", "email_taken");
      }
      throw new AppError(500, "Failed to register user.", "registration_failed");
    }
  }

  async login(input: LoginInput): Promise<AuthResult> {
    const email = normalizeEmail(input.email);
    const user = await findUserByEmail(email);

    if (!user) {
      throw new AppError(
        401,
        "Invalid email or password.",
        "invalid_credentials"
      );
    }

    const passwordMatches = await bcrypt.compare(
      input.password,
      user.passwordHash
    );

    if (!passwordMatches) {
      throw new AppError(
        401,
        "Invalid email or password.",
        "invalid_credentials"
      );
    }

    return toAuthResult({
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
    });
  }

  async getProfile(userId: string): Promise<PublicUser> {
    const user = await findUserById(userId);

    if (!user) {
      throw new AppError(404, "User not found.", "user_not_found");
    }

    return user;
  }

  logout(): void {}
}
