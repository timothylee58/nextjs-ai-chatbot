/**
 * @file entitlements.ts
 * @description Defines rate limits and feature entitlements per user type. Maps each
 * user type (guest, regular) to its allowed quotas, such as the maximum number of
 * messages per day. Used by the chat API to enforce usage limits before processing
 * a new message.
 */

import type { UserType } from "@/app/(auth)/auth";

type Entitlements = {
  maxMessagesPerDay: number;
};

export const entitlementsByUserType: Record<UserType, Entitlements> = {
  /*
   * For users without an account
   */
  guest: {
    maxMessagesPerDay: 20,
  },

  /*
   * For users with an account
   */
  regular: {
    maxMessagesPerDay: 50,
  },

  /*
   * TODO: For users with an account and a paid membership
   */
};
