import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export const SESSION_COOKIE_NAME = "session";
export const SESSION_TTL_SECONDS = 60 * 60 * 24; // 24h

export interface SessionPayload {
  sub: string;
  email: string;
  role: string;
  name?: string;
}

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET environment variable is not set");
  }
  return secret;
}

export function signSession(payload: SessionPayload): string {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: SESSION_TTL_SECONDS });
}

export function verifySession(token: string): SessionPayload | null {
  try {
    return jwt.verify(token, getJwtSecret()) as SessionPayload;
  } catch {
    return null;
  }
}

function extractToken(request: Request): string | null {
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice("Bearer ".length).trim();
  }

  const cookieHeader = request.headers.get("cookie");
  if (cookieHeader) {
    const cookie = cookieHeader
      .split(";")
      .map((entry) => entry.trim())
      .find((entry) => entry.startsWith(`${SESSION_COOKIE_NAME}=`));
    if (cookie) {
      return decodeURIComponent(cookie.slice(SESSION_COOKIE_NAME.length + 1));
    }
  }

  return null;
}

export function getSession(request: Request): SessionPayload | null {
  const token = extractToken(request);
  if (!token) {
    return null;
  }
  return verifySession(token);
}

type AuthResult =
  | { session: SessionPayload; response?: undefined }
  | { session?: undefined; response: NextResponse };

/**
 * Auth guard for route handlers. Returns the verified session, or a ready-to-return
 * 401 NextResponse when the request has no session or the token is missing/invalid.
 */
export function requireSession(request: Request): AuthResult {
  const session = getSession(request);
  if (!session) {
    return {
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }
  return { session };
}
