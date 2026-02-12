/**
 * @file utils.ts
 * @description Database utility functions for password hashing. Provides
 * generateHashedPassword (hashes a password using bcrypt with a salt) and
 * generateDummyPassword (generates a random password and hashes it, used for
 * timing-safe authentication comparisons to prevent user enumeration attacks).
 */

import { generateId } from "ai";
import { genSaltSync, hashSync } from "bcrypt-ts";

export function generateHashedPassword(password: string) {
  const salt = genSaltSync(10);
  const hash = hashSync(password, salt);

  return hash;
}

export function generateDummyPassword() {
  const password = generateId();
  const hashedPassword = generateHashedPassword(password);

  return hashedPassword;
}
