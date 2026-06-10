export function isAuthError(message = "") {
  const normalized = message.toLowerCase();
  return (
    normalized.includes("not logged in") ||
    normalized.includes("not a admin") ||
    normalized.includes("not a worker")
  );
}
