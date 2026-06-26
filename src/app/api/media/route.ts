import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getAllMedia, getMediaByFolder, getAlbums, deleteMedia } from "@/lib/cloudinary";

export async function GET(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const folder = searchParams.get("folder");
  const type = searchParams.get("type");

  if (type === "albums") {
    const albums = await getAlbums();
    return NextResponse.json({ albums });
  }

  const media = folder ? await getMediaByFolder(folder) : await getAllMedia();
  return NextResponse.json({ media });
}

export async function DELETE(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { publicId, resourceType } = await request.json();

  if (!publicId || !resourceType) {
    return NextResponse.json({ error: "Missing publicId or resourceType" }, { status: 400 });
  }

  const result = await deleteMedia(publicId, resourceType);
  return NextResponse.json({ result });
}
