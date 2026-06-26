import { cookies } from "next/headers";
import crypto from "crypto";

const AUTH_COOKIE = "gfm_auth";
const SECRET = process.env.AUTH_SECRET || "default-secret";

function generateToken(): string {
  const timestamp = Date.now().toString();
  const hash = crypto
    .createHmac("sha256", SECRET)
    .update(timestamp)
    .digest("hex");
  return `${timestamp}.${hash}`;
}

function verifyToken(token: string): boolean {
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [timestamp, hash] = parts;
  const expected = crypto
    .createHmac("sha256", SECRET)
    .update(timestamp)
    .digest("hex");
  if (hash !== expected) return false;
  const age = Date.now() - parseInt(timestamp, 10);
  const thirtyDays = 30 * 24 * 60 * 60 * 1000;
  return age < thirtyDays;
}

export async function setAuthCookie(): Promise<string> {
  const token = generateToken();
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 30 * 24 * 60 * 60,
    path: "/",
  });
  return token;
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE)?.value;
  if (!token) return false;
  return verifyToken(token);
}

export async function clearAuthCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE);
}

export function verifyPassword(password: string): boolean {
  return password === process.env.FAMILY_PASSWORD;
}
