import path from "path";
import fs from "fs/promises";

// Function to get the MIME type of a file based on its extension
export function getMimeType(filePath: string): string {
  const extension = path.extname(filePath).toLowerCase();
  switch (extension) {
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".png":
      return "image/png";
    case ".gif":
      return "image/gif";
    // Add more cases for other supported file types
    default:
      return "application/octet-stream"; // Default to generic binary data
  }
}

// Async function to get image data
export async function getImage(imagePath: string): Promise<Buffer | null> {
  try {
    const imageData = await fs.readFile(imagePath);
    return imageData;
  } catch (err) {
    console.error("Error reading image:", err);
    return null;
  }
}
