import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "signups.json");

export default function handler(req, res) {
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf8");
    const list = JSON.parse(raw);
    res.status(200).json({ count: list.length });
  } catch (e) {
    res.status(200).json({ count: 0 });
  }
}