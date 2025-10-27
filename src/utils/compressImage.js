import imageCompression from "browser-image-compression";

export async function compressImage(file) {
  if (!file || !file.type.startsWith("image/")) return file;

  const options = {
    maxSizeMB: 0.4,          // Target max ~400 KB
    maxWidthOrHeight: 1600,  // Resize long edge to 1600 px
    useWebWorker: true,
    fileType: "image/webp",  // Convert to WebP
  };

  try {
    const compressed = await imageCompression(file, options);
    const newName = file.name.replace(/\.(jpe?g|png|webp)$/i, "") + ".webp";
    return new File([compressed], newName, { type: "image/webp" });
  } catch (e) {
    console.error("Compression failed:", e);
    return file;
  }
}
