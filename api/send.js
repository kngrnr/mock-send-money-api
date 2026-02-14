import fs from "fs";
import path from "path";

const walletsFile = path.resolve("./data/wallets.json");
const transactionsFile = path.resolve("./data/transactions.json");

export default function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { userId, recipientId, amount } = req.body;

  const wallets = JSON.parse(fs.readFileSync(walletsFile, "utf-8"));
  const transactions = JSON.parse(fs.readFileSync(transactionsFile, "utf-8"));

  const senderWallet = wallets.find(w => w.userId === userId);
  const recipientWallet = wallets.find(w => w.userId === recipientId);

  if (!senderWallet || !recipientWallet) return res.status(404).json({ error: "Wallet not found" });
  if (amount > senderWallet.balance) return res.status(400).json({ error: "Insufficient balance" });

  // Update balances
  senderWallet.balance -= amount;
  recipientWallet.balance += amount;

  // Update wallets.json
  fs.writeFileSync(walletsFile, JSON.stringify(wallets, null, 2));

  // Add transactions
  const newTxId = transactions.length + 1;
  transactions.push({
    id: newTxId,
    userId: userId,
    type: "debit",
    amount,
    description: `Sent to user ${recipientId}`,
    date: new Date().toISOString()
  });
  transactions.push({
    id: newTxId + 1,
    userId: recipientId,
    type: "credit",
    amount,
    description: `Received from user ${userId}`,
    date: new Date().toISOString()
  });

  fs.writeFileSync(transactionsFile, JSON.stringify(transactions, null, 2));

  return res.status(200).json({
    success: true,
    senderBalance: senderWallet.balance
  });
}
