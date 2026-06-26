import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

export const FOLDER_ROOT = "gunawan-farm";

export interface MediaItem {
  public_id: string;
  secure_url: string;
  resource_type: "image" | "video";
  format: string;
  width: number;
  height: number;
  created_at: string;
  folder: string;
  bytes: number;
  tags: string[];
}

export async function getAlbums(): Promise<{ name: string; path: string; count: number }[]> {
  try {
    const result = await cloudinary.api.sub_folders(FOLDER_ROOT);
    const albums = await Promise.all(
      result.folders.map(async (f: { name: string; path: string }) => {
        const resources = await cloudinary.api.resources({
          type: "upload",
          prefix: f.path,
          max_results: 1,
        });
        return {
          name: f.name,
          path: f.path,
          count: resources.resources.length,
        };
      })
    );
    return albums;
  } catch {
    return [];
  }
}

export async function getMediaByFolder(folder: string): Promise<MediaItem[]> {
  try {
    const [images, videos] = await Promise.all([
      cloudinary.api.resources({
        type: "upload",
        prefix: folder,
        resource_type: "image",
        max_results: 500,
        tags: true,
      }),
      cloudinary.api.resources({
        type: "upload",
        prefix: folder,
        resource_type: "video",
        max_results: 500,
        tags: true,
      }),
    ]);
    const all = [...images.resources, ...videos.resources] as MediaItem[];
    all.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    return all;
  } catch {
    return [];
  }
}

export async function getAllMedia(): Promise<MediaItem[]> {
  try {
    const [images, videos] = await Promise.all([
      cloudinary.api.resources({
        type: "upload",
        prefix: FOLDER_ROOT,
        resource_type: "image",
        max_results: 500,
        tags: true,
      }),
      cloudinary.api.resources({
        type: "upload",
        prefix: FOLDER_ROOT,
        resource_type: "video",
        max_results: 500,
        tags: true,
      }),
    ]);
    const all = [...images.resources, ...videos.resources] as MediaItem[];
    all.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    return all;
  } catch {
    return [];
  }
}

export function getUploadSignature(folder: string) {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const params = {
    timestamp,
    folder: `${FOLDER_ROOT}/${folder}`,
  };
  const signature = cloudinary.utils.api_sign_request(
    params,
    process.env.CLOUDINARY_API_SECRET!
  );
  return { timestamp, signature, folder: params.folder };
}
