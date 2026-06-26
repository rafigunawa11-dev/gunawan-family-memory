import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getUploadSignature } from "@/lib/cloudinary";

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const folder = body.folder || "umum";

  const { timestamp, signature, folder: fullFolder } = getUploadSignature(folder);

  return NextResponse.json({
    timestamp,
    signature,
    folder: fullFolder,
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
  });
}
