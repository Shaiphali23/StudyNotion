import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET!;

export interface JWTPayload {
  email: string;
  id: string;
  accountType: "Admin" | "Student" | "Instructor";
  iat?: number;
  exp?: number;
}

export function signToken(payload: Omit<JWTPayload, "iat" | "exp">): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "2h" });
}

export function verifyToken(token: string): JWTPayload {
  return jwt.verify(token, JWT_SECRET) as JWTPayload;
}

export function getAuthUser(request: NextRequest): JWTPayload | null {
  try {
    const cookieToken = request.cookies.get("token")?.value;
    const authHeader = request.headers.get("Authorization");
    const headerToken = authHeader?.replace("Bearer ", "");
    const token = cookieToken || headerToken;

    if (!token) return null;
    return verifyToken(token);
  } catch {
    return null;
  }
}

export function requireAuth(request: NextRequest): { user: JWTPayload } | { error: NextResponse } {
  const user = getAuthUser(request);
  if (!user) {
    return {
      error: NextResponse.json({ success: false, message: "Token is missing or invalid" }, { status: 401 }),
    };
  }
  return { user };
}

export function requireRole(
  request: NextRequest,
  role: "Student" | "Instructor" | "Admin"
): { user: JWTPayload } | { error: NextResponse } {
  const authResult = requireAuth(request);
  if ("error" in authResult) return authResult;

  const { user } = authResult;
  if (user.accountType !== role) {
    return {
      error: NextResponse.json(
        { success: false, message: `This route is protected for ${role}s only` },
        { status: 403 }
      ),
    };
  }
  return { user };
}
