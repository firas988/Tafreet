export function isAuthError(message = "") {
  const normalized = message.toLowerCase();
  return (
    normalized.includes("not logged in") ||
    normalized.includes("not a admin") ||
    normalized.includes("not a worker")
  );
}

export function isPublicPath(pathname = "") {
  return (
    pathname.startsWith("/menu/public/") ||
    pathname === "/cart" ||
    pathname === "/status"
  );
}

export function isPublicApi(url = "") {
  return (
    url.includes("/api/auth/check-login") ||
    url.includes("/api/menu/") ||
    url.includes("/api/order/createOrder")
  );
}
