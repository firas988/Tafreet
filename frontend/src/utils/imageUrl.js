const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export function normalizeUploadFilename(folder, filename) {
  if (!filename) return "";
  return String(filename)
    .replace(/^https?:\/\/[^/]+\/uploads\/(?:profile|products|categories)\//, "")
    .replace(/^uploads\//, "")
    .replace(new RegExp(`^${folder}/`), "")
    .split("/")
    .pop();
}

export function getUploadUrl(folder, filename) {
  if (!filename) return "";
  if (filename.startsWith("http")) return filename;

  const cleanName = normalizeUploadFilename(folder, filename);
  if (!cleanName) return "";

  return `${API_BASE}/uploads/${folder}/${cleanName}`;
}
