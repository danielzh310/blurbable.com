import fs from "fs";
import path from "path";
import { register, Counter } from "prom-client";

const DATA_FILE = path.join(process.cwd(), "data", "signups.json");

// ensure metrics are registered once
if (!register.getSingleMetric("blurbable_signups_total")) {
  const signupCounter = new Counter({
    name: "blurbable_signups_total",
    help: "Total signups received"
  });
  register.registerMetric(signupCounter);
}

// helper: load file
function readSignups() {
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf8");
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

function writeSignups(list) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(list, null, 2), "utf8");
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const { name, email } = req.body || {};
  if (!name || !email) return res.status(400).json({ error: "Missing name or email" });

  // append to signups
  const list = readSignups();
  const exists = list.find((s) => s.email.toLowerCase() === email.toLowerCase());
  if (exists) {
    return res.status(200).json({ message: "You're already on the list — thanks!" });
  }
  list.push({ name, email, ts: new Date().toISOString() });
  writeSignups(list);

  // increment prom metric (if available)
  try {
    const metric = register.getSingleMetric("blurbable_signups_total");
    if (metric) metric.inc();
  } catch (err) {
    // ignore
  }

  return res.status(200).json({ success: true, message: `Added ${name} to the waitlist!` });
}