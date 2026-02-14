import fetch from "node-fetch";

// Replace with your JSONBin details
const USERS_BIN_ID = "6990a5b1d0ea881f40ba66dc";      // e.g., "63f8d1..."
const API_KEY = "$2a$10$C9FqG5Fmpmf15BZJncAnq.uqcwQj0qcb6aCOxE1qORuxeGvghQc2G";    // your secret key

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // 1️⃣ Get users from JSONBin
    const usersResp = await fetch(`https://api.jsonbin.io/v3/b/${USERS_BIN_ID}/latest`, {
      headers: {
        "X-Master-Key": API_KEY
      }
    });

    if (!usersResp.ok) {
      return res.status(500).json({ error: "Failed to fetch users" });
    }

    const usersData = await usersResp.json();
    const users = usersData.record;

    // 2️⃣ Get login info from request
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // 3️⃣ Find user
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // 4️⃣ Return mock token + user info
    return res.status(200).json({
      token: `mock-token-${user.id}`, // just a mock token
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Server error" });
  }
}