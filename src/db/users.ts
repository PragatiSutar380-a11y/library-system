/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Academic B.Sc. Computer Science Field Project: Library Management System
 * Database User Registration & Upsert Helper
 */

import { db } from './index.ts';
import { users } from './schema.ts';
import { eq } from 'drizzle-orm';

export async function getOrCreateUser(uid: string, email: string, name?: string, role: string = 'member') {
  try {
    const result = await db.insert(users)
      .values({
        uid,
        email,
        name: name || email.split('@')[0],
        username: email.split('@')[0],
        role,
      })
      .onConflictDoUpdate({
        target: users.uid,
        set: {
          email,
          ...(name ? { name } : {}),
        },
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error('Database getOrCreateUser failed:', error);
    throw new Error('User operation failed', { cause: error });
  }
}
