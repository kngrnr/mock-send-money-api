import fetch from "node-fetch";
import { checkAuth } from "./_auth.js";

const TRANSACTIONS_BIN_ID = process.env.JSONBIN_TRANSACTIONS_BIN_ID;
const API_KEY = process.env.JSONBIN_API_KEY;

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const userId = checkAuth(req);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  try {
    const txResp = await fetch(`https://api.jsonbin.io/v3/b/${TRANSACTIONS_BIN_ID}/latest`, {
      headers: { "X-Master-Key": API_KEY }
    });
    const txData = await txResp.json();
    const transactions = txData.record;

    const userTx = transactions.filter(t => t.userId === userId);
    return res.status(200).json(userTx);
  } catch (err) {
    console.error("Get transactions error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}