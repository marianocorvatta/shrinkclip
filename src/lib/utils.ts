export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function getDownloadFilename(
  originalName: string | undefined,
  suffix: string,
  format: string
): string {
  if (!originalName) return `${suffix}.${format}`;
  const base = originalName.replace(/\.[^.]+$/, "");
  return `${base}_${suffix}.${format}`;
}

export function getMimeType(format: string): string {
  const mimes: Record<string, string> = {
    mp4: "video/mp4",
    webm: "video/webm",
    mov: "video/quicktime",
    avi: "video/x-msvideo",
    mkv: "video/x-matroska",
  };
  return mimes[format.toLowerCase()] ?? "video/mp4";
}

export function getExtension(file: File): string {
  const parts = file.name.split(".");
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : "mp4";
}
