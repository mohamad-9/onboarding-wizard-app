export function apiUrl(path) {
  const base =
    import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

  // Debug in browser console so we SEE what base is in production
  console.log("[apiUrl] base =", base);

  return `${base}${path}`;
}
