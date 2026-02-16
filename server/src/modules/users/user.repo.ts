import { prisma } from "../../libs/prisma.js";
import type { User, CreateUserData, UpdateUserData, UserRole } from "./user.types.js";
import type { User as PrismaUser, UserRole as PrismaUserRole } from "@prisma/client";

// Convert Prisma User to our User type
function toUser(prismaUser: PrismaUser & { roles?: { role: PrismaUserRole }[] }): User {
  return {
    id: prismaUser.id,
    email: prismaUser.email,
    passwordHash: prismaUser.passwordHash,
    firstName: prismaUser.firstName,
    lastName: prismaUser.lastName,
    phoneNumber: prismaUser.phoneNumber,
    isActive: prismaUser.isActive,
    tokenVersion: prismaUser.tokenVersion,
    createdAt: prismaUser.createdAt,
    updatedAt: prismaUser.updatedAt,
    deletedAt: prismaUser.deletedAt,
    emailVerified: prismaUser.emailVerified,
    verificationToken: prismaUser.verificationToken,
    verificationTokenExpiresAt: prismaUser.verificationTokenExpiresAt,
    resetPasswordToken: prismaUser.resetPasswordToken,
    resetPasswordTokenExpiresAt: prismaUser.resetPasswordTokenExpiresAt,
    failedLoginAttempts: prismaUser.failedLoginAttempts,
    lockedUntil: prismaUser.lockedUntil,
    roles: prismaUser.roles?.map((r) => r.role as UserRole) || [],
  };
}

export async function createUser(data: CreateUserData): Promise<User> {
  const user = await prisma.user.create({
    data: {
      email: data.email,
      passwordHash: data.passwordHash,
      firstName: data.firstName,
      lastName: data.lastName,
      roles: {
        create: {
          role: (data.role || "USER") as PrismaUserRole,
        },
      },
    },
    include: {
      roles: true,
    },
  });

  return toUser(user);
}

export async function findUserByEmail(email: string): Promise<User | null> {
  const user = await prisma.user.findFirst({
    where: {
      email,
      deletedAt: null,
    },
    include: {
      roles: true,
    },
  });

  return user ? toUser(user) : null;
}

export async function findUserById(id: string): Promise<User | null> {
  const user = await prisma.user.findFirst({
    where: {
      id,
      deletedAt: null,
    },
    include: {
      roles: true,
    },
  });

  return user ? toUser(user) : null;
}

export async function findAllUsers(skip: number, take: number): Promise<User[]> {
  const users = await prisma.user.findMany({
    where: {
      deletedAt: null,
    },
    orderBy: {
      createdAt: "desc",
    },
    skip,
    take,
    include: {
      roles: true,
    },
  });

  return users.map(toUser);
}

export async function countAllUsers(): Promise<number> {
  return prisma.user.count({
    where: {
      deletedAt: null,
    },
  });
}

export async function updateUser(id: string, data: UpdateUserData): Promise<User> {
  const user = await prisma.user.update({
    where: { id },
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      phoneNumber: data.phoneNumber,
      passwordHash: data.passwordHash,
      emailVerified: data.emailVerified,
      verificationToken: data.verificationToken,
      verificationTokenExpiresAt: data.verificationTokenExpiresAt,
      resetPasswordToken: data.resetPasswordToken,
      resetPasswordTokenExpiresAt: data.resetPasswordTokenExpiresAt,
      failedLoginAttempts: data.failedLoginAttempts,
      lockedUntil: data.lockedUntil,
      tokenVersion: data.tokenVersion,
      isActive: data.isActive,
    },
    include: {
      roles: true,
    },
  });

  return toUser(user);
}

export async function incrementTokenVersion(id: string): Promise<User> {
  const user = await prisma.user.update({
    where: { id },
    data: {
      tokenVersion: {
        increment: 1,
      },
    },
    include: {
      roles: true,
    },
  });

  return toUser(user);
}

export async function softDeleteUser(id: string): Promise<User> {
  const user = await prisma.user.update({
    where: { id },
    data: {
      deletedAt: new Date(),
    },
    include: {
      roles: true,
    },
  });

  return toUser(user);
}

export async function findDeletedUserById(id: string): Promise<User | null> {
  const user = await prisma.user.findFirst({
    where: {
      id,
      deletedAt: { not: null },
    },
    include: {
      roles: true,
    },
  });

  return user ? toUser(user) : null;
}

export async function restoreUser(id: string): Promise<User> {
  const user = await prisma.user.update({
    where: { id },
    data: {
      deletedAt: null,
      isActive: true,
    },
    include: {
      roles: true,
    },
  });

  return toUser(user);
}

// ==========================================
// USER ROLES
// ==========================================

export async function getUserRoles(userId: string): Promise<UserRole[]> {
  const roleAssignments = await prisma.userRoleAssignment.findMany({
    where: { userId },
    select: { role: true },
  });

  return roleAssignments.map((r) => r.role as UserRole);
}

export async function addUserRole(userId: string, role: UserRole): Promise<void> {
  await prisma.userRoleAssignment.upsert({
    where: {
      userId_role: {
        userId,
        role: role as PrismaUserRole,
      },
    },
    update: {},
    create: {
      userId,
      role: role as PrismaUserRole,
    },
  });
}

export async function removeUserRole(userId: string, role: UserRole): Promise<void> {
  await prisma.userRoleAssignment.deleteMany({
    where: {
      userId,
      role: role as PrismaUserRole,
    },
  });
}

export async function hasRole(userId: string, role: UserRole): Promise<boolean> {
  const count = await prisma.userRoleAssignment.count({
    where: {
      userId,
      role: role as PrismaUserRole,
    },
  });

  return count > 0;
}

// ==========================================
// USER WITH ROLES FOR SAFE USER
// ==========================================

export interface UserWithRolesForSafeUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string | null;
  isActive: boolean;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  roles: UserRole[];
}

/**
 * Fetches user with roles needed for SafeUser in a single query.
 */
export async function findUserWithRolesForSafeUser(
  userId: string
): Promise<UserWithRolesForSafeUser | null> {
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
      deletedAt: null,
    },
    include: {
      roles: { select: { role: true } },
    },
  });

  if (!user) return null;

  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    phoneNumber: user.phoneNumber,
    isActive: user.isActive,
    emailVerified: user.emailVerified,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    roles: user.roles.map((r) => r.role as UserRole),
  };
}
