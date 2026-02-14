import fetch from "node-fetch";
import { checkAuth } from "./_auth.js";

const WALLETS_BIN_ID = process.env.JSONBIN_WALLETS_BIN_ID;
const TRANSACTIONS_BIN_ID = process.env.JSONBIN_TRANSACTIONS_BIN_ID;
const API_KEY = process.env.JSONBIN_API_KEY;

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const userId = checkAuth(req);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  const { recipientId, amount } = req.body;
  if (!recipientId || !amount) return res.status(400).json({ error: "recipientId and amount required" });

  try {
    // Fetch wallets
    const walletsResp = await fetch(`https://api.jsonbin.io/v3/b/${WALLETS_BIN_ID}/latest`, {
      headers: { "X-Master-Key": API_KEY }
    });
    const walletsData = await walletsResp.json();
    const wallets = walletsData.record;

    const senderWallet = wallets.find(w => w.userId === userId);
    const recipientWallet = wallets.find(w => w.userId === recipientId);

    if (!senderWallet || !recipientWallet) return res.status(404).json({ error: "Wallet not found" });
    if (amount > senderWallet.balance) return res.status(400).json({ error: "Insufficient balance" });

    // Update balances
    senderWallet.balance -= amount;
    recipientWallet.balance += amount;

    // Save wallets
    await fetch(`https://api.jsonbin.io/v3/b/${WALLETS_BIN_ID}`, {
      method: "PUT",
      headers: { "X-Master-Key": API_KEY, "Content-Type": "application/json" },
      body: JSON.stringify(wallets)
    });

    // Add transactions
    const txResp = await fetch(`https://api.jsonbin.io/v3/b/${TRANSACTIONS_BIN_ID}/latest`, {
      headers: { "X-Master-Key": API_KEY }
    });
    const txData = await txResp.json();
    const transactions = txData.record;

    const nextId = transactions.length + 1;
    transactions.push({
      id: nextId,
      userId,
      type: "debit",
      amount,
      description: `Sent to user ${recipientId}`,
      date: new Date().toISOString()
    });
    transactions.push({
      id: nextId + 1,
      userId: recipientId,
      type: "credit",
      amount,
      description: `Received from user ${userId}`,
      date: new Date().toISOString()
    });

    await fetch(`https://api.jsonbin.io/v3/b/${TRANSACTIONS_BIN_ID}`, {
      method: "PUT",
      headers: { "X-Master-Key": API_KEY, "Content-Type": "application/json" },
      body: JSON.stringify(transactions)
    });

    return res.status(200).json({ success: true, senderBalance: senderWallet.balance });
  } catch (err) {
    console.error("Send money error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}