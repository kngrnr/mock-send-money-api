import fs from "fs";
import path from "path";

const usersFile = path.resolve("./data/users.json");

export default function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { email, password } = req.body;
  const users = JSON.parse(fs.readFileSync(usersFile, "utf-8"));

  const user = users.find(u => u.email === email && u.password === password);

  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  return res.status(200).json({
    token: `mock-token-${user.id}`,
    user: { id: user.id, name: user.name, email: user.email }
  });
}
