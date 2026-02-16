export function checkAuth(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  const token = authHeader.replace("Bearer ", "");
  // Token format: "mock-token-<username>"
  const username = token.split("-").slice(2).join("-");
  if (!username) return null;
  return username;
}
