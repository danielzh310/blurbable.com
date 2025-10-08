import { register, collectDefaultMetrics } from "prom-client";

// collect default metrics (node process)
collectDefaultMetrics({ register });

export default async function handler(req, res) {
  res.setHeader("Content-Type", register.contentType);
  res.send(await register.metrics());
}