export function checkAuth(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  const token = authHeader.replace("Bearer ", "");
  // Token format: "mock-token-<userId>"
  const userId = Number(token.split("-")[2]);
  if (!userId) return null;
  return userId;
}
