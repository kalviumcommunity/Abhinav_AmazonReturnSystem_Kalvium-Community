import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const DEFAULT_ALLOWED_ORIGINS = ["http://localhost:3000"];

/**
 * Credentialed CORS requires echoing back a specific origin (never "*"),
 * so the allow-list must include every deployed frontend origin via env var.
 */
function getAllowedOrigins(): string[] {
  const configured = process.env.ALLOWED_ORIGINS;
  if (!configured) return DEFAULT_ALLOWED_ORIGINS;
  return configured
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

const corsHeaders = {
  "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export function proxy(request: NextRequest) {
  const origin = request.headers.get("origin") ?? "";
  const isAllowedOrigin = getAllowedOrigins().includes(origin);

  if (request.method === "OPTIONS") {
    return NextResponse.json(
      {},
      {
        headers: {
          ...(isAllowedOrigin && {
            "Access-Control-Allow-Origin": origin,
            "Access-Control-Allow-Credentials": "true",
          }),
          ...corsHeaders,
          Vary: "Origin",
        },
      }
    );
  }

  const response = NextResponse.next();

  if (isAllowedOrigin) {
    response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set("Access-Control-Allow-Credentials", "true");
  }

  Object.entries(corsHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  response.headers.set("Vary", "Origin");

  return response;
}

export const config = {
  matcher: "/api/:path*",
};
