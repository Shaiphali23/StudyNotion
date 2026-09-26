import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadToCloudinary(
  filePath: string,
  folder: string,
  height?: number,
  quality?: number
) {
  const options: Record<string, unknown> = { folder, resource_type: "auto" };
  if (height) options.height = height;
  if (quality) options.quality = quality;
  return cloudinary.uploader.upload(filePath, options);
}

export default cloudinary;
