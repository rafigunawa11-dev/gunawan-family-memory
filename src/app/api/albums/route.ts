import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import cloudinary, { FOLDER_ROOT } from "@/lib/cloudinary";

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { name } = body;

  if (!name) {
    return NextResponse.json({ error: "Album name required" }, { status: 400 });
  }

  const folderPath = `${FOLDER_ROOT}/${name}`;
  await cloudinary.api.create_folder(folderPath);

  return NextResponse.json({ success: true, path: folderPath });
}
