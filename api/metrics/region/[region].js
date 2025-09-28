// /api/metrics/region/[region].js
import { kv } from "@vercel/kv";

export default async function handler(req, res) {
  const region = (req.query.region || "").toUpperCase();
  const month = req.query.month || "";
  if (!region) return res.status(400).json({ error: "Missing region" });

  if (month) {
    const doc = await kv.get(`region:${region}:${month}`);
    return res.status(200).json(doc || { region, month, totals: { sales: 0 }, franchises: {} });
  }

  const months = ["2025-09", "2025-08", "2025-07"];
  const out = {};
  for (const m of months) {
    out[m] = (await kv.get(`region:${region}:${m}`)) || { region, month: m, totals: { sales: 0 }, franchises: {} };
  }
  return res.status(200).json(out);
}
