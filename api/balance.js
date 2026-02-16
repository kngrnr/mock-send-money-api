import fetch from "node-fetch";
import { checkAuth } from "./_auth.js";

const WALLETS_BIN_ID = process.env.JSONBIN_WALLETS_BIN_ID;
const API_KEY = process.env.JSONBIN_API_KEY;

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const username = checkAuth(req);
  if (!username) return res.status(401).json({ error: "Unauthorized" });

  try {
    const walletsResp = await fetch(`https://api.jsonbin.io/v3/b/${WALLETS_BIN_ID}/latest`, {
      headers: { "X-Master-Key": API_KEY }
    });
    const walletsData = await walletsResp.json();
    const wallets = walletsData.record;

    const wallet = wallets.find(w => w.userName === username);
    if (!wallet) return res.status(404).json({ error: "Wallet not found" });

    return res.status(200).json(wallet);
  } catch (err) {
    console.error("Get balance error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}