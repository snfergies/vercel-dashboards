// /api/metrics/report.js
import { kv } from "@vercel/kv";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const token = (req.headers.authorization || "").replace("Bearer ", "");
  if (token !== process.env.METRICS_INGEST_TOKEN) return res.status(401).json({ error: "Unauthorized" });

  const { franchise, month, data, goals } = req.body || {};
  if (!franchise || !month) return res.status(400).json({ error: "Missing franchise/month" });

  await kv.set(`metrics:${franchise}:${month}`, { franchise, month, data, goals, updatedAt: Date.now() });

  // Basic region rollup
  const fr = await kv.get(`franchise:${franchise}`);
  if (fr?.region) {
    const regionKey = `region:${fr.region}:${month}`;
    const existing = (await kv.get(regionKey)) || { month, region: fr.region, totals: { sales: 0 }, franchises: {} };
    existing.franchises[franchise] = data?.totals || {};
    existing.totals.sales = Object.values(existing.franchises).reduce((s, x) => s + (x.sales || 0), 0);
    await kv.set(regionKey, existing);
  }

  return res.status(200).json({ ok: true });
}
