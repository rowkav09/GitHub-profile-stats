import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

export const config = {
  matcher: "/api/card",
};

export async function middleware(request: NextRequest) {
  const username = request.nextUrl.searchParams.get("username")?.toLowerCase();

  if (username) {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (url && token) {
      const redis = new Redis({ url, token });
      // Fire-and-forget — don't block the response
      redis.sadd("embed:users", username).catch(() => {});
    }
  }

  return NextResponse.next();
}
