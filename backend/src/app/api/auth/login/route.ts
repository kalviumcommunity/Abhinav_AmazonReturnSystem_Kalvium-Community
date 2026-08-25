import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signSession, SESSION_COOKIE_NAME, SESSION_TTL_SECONDS } from "@/lib/auth";

export async function POST(request: Request) {
  let body: { email?: unknown; password?: unknown } | null;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const email = body?.email;
  const password = body?.password;
  if (typeof email !== "string" || !email.trim() || typeof password !== "string" || !password) {
    return NextResponse.json(
      { error: "email and password are required" },
      { status: 400 }
    );
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    const passwordMatches = user
      ? await bcrypt.compare(password, user.passwordHash)
      : false;

    if (!user || !passwordMatches) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const token = signSession({ sub: user.id, email: user.email, role: user.role });

    const response = NextResponse.json({
      message: "Login successful",
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    });

    response.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_TTL_SECONDS,
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}
