import fs from "fs";
import path from "path";

const transactionsFile = path.resolve("./data/transactions.json");

export default function handler(req, res) {
  const transactions = JSON.parse(fs.readFileSync(transactionsFile, "utf-8"));
  const userId = Number(req.query.userId);

  if (req.method === "GET") {
    const userTx = transactions.filter(t => t.userId === userId);
    return res.status(200).json(userTx);
  }

  return res.status(405).json({ error: "Method not allowed" });
}
