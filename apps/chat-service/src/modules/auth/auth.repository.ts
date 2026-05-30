import { db, users, eq } from "@repo/database";

export type PublicUser = {
  id: string;
  email: string;
  createdAt: Date;
};

export async function findUserByEmail(
  email: string
): Promise<typeof users.$inferSelect | undefined> {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  return user;
}

export async function findUserById(
  id: string
): Promise<PublicUser | undefined> {
  const [user] = await db
    .select({
      id: users.id,
      email: users.email,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(eq(users.id, id))
    .limit(1);

  return user;
}

export async function createUser(
  email: string,
  passwordHash: string
): Promise<PublicUser> {
  const [user] = await db
    .insert(users)
    .values({ email, passwordHash })
    .returning({
      id: users.id,
      email: users.email,
      createdAt: users.createdAt,
    });

  if (!user) {
    throw new Error("Failed to create user.");
  }

  return user;
}
