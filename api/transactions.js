import fetch from "node-fetch";
import { checkAuth } from "./_auth.js";

const WALLETS_BIN_ID = process.env.JSONBIN_WALLETS_BIN_ID;
const TRANSACTIONS_BIN_ID = process.env.JSONBIN_TRANSACTIONS_BIN_ID;
const API_KEY = process.env.JSONBIN_API_KEY;

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const username = checkAuth(req);
  if (!username) return res.status(401).json({ error: "Unauthorized" });

  try {
    // Get wallets to find userId by username
    const walletsResp = await fetch(`https://api.jsonbin.io/v3/b/${WALLETS_BIN_ID}/latest`, {
      headers: { "X-Master-Key": API_KEY }
    });
    const walletsData = await walletsResp.json();
    const wallets = walletsData.record;
    const userWallet = wallets.find(w => w.userName === username);
    if (!userWallet) return res.status(404).json({ error: "Wallet not found" });

    const txResp = await fetch(`https://api.jsonbin.io/v3/b/${TRANSACTIONS_BIN_ID}/latest`, {
      headers: { "X-Master-Key": API_KEY }
    });
    const txData = await txResp.json();
    const transactions = txData.record;

    const userTx = transactions.filter(t => t.userId === userWallet.userId);
    
    return res.status(200).json({
      debug: {
        username,
        userWallet,
        totalTransactions: transactions.length,
        userIdLookingFor: userWallet.userId,
        sample_transactions: transactions.slice(0, 3)
      },
      transactions: userTx
    });
  } catch (err) {
    console.error("Get transactions error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}