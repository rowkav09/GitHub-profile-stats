import { Redis } from "@upstash/redis";

const USERS_SET_KEY = "embed:users";

function getRedis(): Redis | null {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return null;
  }
  return new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
}

/** Record a username that used the embed (fire-and-forget). */
export async function trackUser(username: string): Promise<void> {
  const redis = getRedis();
  if (!redis) return;
  await redis.sadd(USERS_SET_KEY, username.toLowerCase());
}

/** Return the number of unique usernames that have ever used the embed. */
export async function getUserCount(): Promise<number> {
  const redis = getRedis();
  if (!redis) return 0;
  return await redis.scard(USERS_SET_KEY);
}

const VISITS_KEY = "embed:visits";

/** Increment and return total visit count. */
export async function trackVisit(): Promise<number> {
  const redis = getRedis();
  if (!redis) return 0;
  return await redis.incr(VISITS_KEY);
}

/** Return total visit count without incrementing. */
export async function getVisitCount(): Promise<number> {
  const redis = getRedis();
  if (!redis) return 0;
  return (await redis.get<number>(VISITS_KEY)) ?? 0;
}

/**
 * Increment and return the profile view count for a specific username.
 * This is the per-profile counter — each user embeds their own badge URL.
 */
export async function trackProfileView(username: string): Promise<number> {
  const redis = getRedis();
  if (!redis) return 0;
  const key = `views:${username.toLowerCase()}`;
  return await redis.incr(key);
}

/** Return the profile view count without incrementing. */
export async function getProfileViewCount(username: string): Promise<number> {
  const redis = getRedis();
  if (!redis) return 0;
  const key = `views:${username.toLowerCase()}`;
  return (await redis.get<number>(key)) ?? 0;
}
