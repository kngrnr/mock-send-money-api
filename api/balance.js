import fs from "fs";
import path from "path";

const walletsFile = path.resolve("./data/wallets.json");

export default function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const userId = Number(req.query.userId); // pass ?userId=1
  const wallets = JSON.parse(fs.readFileSync(walletsFile, "utf-8"));

  const wallet = wallets.find(w => w.userId === userId);

  if (!wallet) return res.status(404).json({ error: "Wallet not found" });

  return res.status(200).json({
    balance: wallet.balance,
    currency: "PHP"
  });
}
