import fetch from "node-fetch";

const USERS_BIN_ID = process.env.JSONBIN_USERS_BIN_ID;
const API_KEY = process.env.JSONBIN_API_KEY;

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: "Username and password required" });

  try {
    const usersResp = await fetch(`https://api.jsonbin.io/v3/b/${USERS_BIN_ID}/latest`, {
      headers: { "X-Master-Key": API_KEY }
    });
    const usersData = await usersResp.json();
    const users = usersData.record;

    const user = users.find(u => u.username === username && u.password === password);
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    // Mock token with username
    const token = `mock-token-${user.username}`;

    return res.status(200).json({
      token,
      user: { id: user.id, name: user.name, username: user.username }
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}