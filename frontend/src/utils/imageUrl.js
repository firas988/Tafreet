const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export function getUploadUrl(folder, filename) {
  if (!filename) return "";
  if (filename.startsWith("http")) return filename;
  return `${API_BASE}/uploads/${folder}/${filename}`;
}
