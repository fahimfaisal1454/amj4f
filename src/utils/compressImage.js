import imageCompression from "browser-image-compression";

export async function compressImage(file) {
  if (!file || !file.type.startsWith("image/")) return file;

  const isLargeImage = file.size > 1.5 * 1024 * 1024; // >1.5 MB original
  const isGroupPhoto =
    file.name.toLowerCase().includes("group") || isLargeImage;

  // More aggressive compression targets
  const targetKB = isGroupPhoto ? 180 : 90; // max ~180 KB for group, ~90 KB for others
  const maxPasses = 8;

  let quality = isGroupPhoto ? 0.6 : 0.45;
  let maxDim  = isGroupPhoto ? 1600 : 1300;
  const minQuality = 0.25;
  const minDim = 700;

  let input = file;
  let output = file;

  for (let pass = 0; pass < maxPasses; pass++) {
    const options = {
      maxSizeMB: targetKB / 1024,
      maxWidthOrHeight: Math.round(maxDim),
      useWebWorker: true,
      fileType: "image/jpeg",
      initialQuality: quality,
    };

    output = await imageCompression(input, options);

    if (output.size / 1024 <= targetKB) break;

    // Reduce quality and size further each pass
    quality = Math.max(minQuality, quality - 0.07);
    maxDim  = Math.max(minDim, Math.round(maxDim * 0.9));
    input = output;

    if (quality === minQuality && maxDim === minDim) break;
  }

  const newName =
    file.name.replace(/\.(jpe?g|png|webp)$/i, "") + ".jpg";
  return new File([output], newName, { type: "image/jpeg" });
}
