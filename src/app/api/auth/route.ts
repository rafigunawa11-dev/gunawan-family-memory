import { NextRequest, NextResponse } from "next/server";
import { setAuthCookie, verifyPassword, clearAuthCookie } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { password } = body;

  if (!password) {
    return NextResponse.json({ error: "Password required" }, { status: 400 });
  }

  if (!verifyPassword(password)) {
    return NextResponse.json({ error: "Password salah" }, { status: 401 });
  }

  await setAuthCookie();
  return NextResponse.json({ success: true });
}

export async function DELETE() {
  await clearAuthCookie();
  return NextResponse.json({ success: true });
}
