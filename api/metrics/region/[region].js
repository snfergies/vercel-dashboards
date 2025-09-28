// api/metrics/region/[region].js
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE
);

export default async function handler(req, res) {
  const { region } = req.query;
  const { month } = req.query;
  if (!region) return res.status(400).json({ error: "region is required" });
  if (!month) return res.status(400).json({ error: "month is required (e.g. 2025-09)" });

  const { data, error } = await supabase
    .from("metrics")
    .select("franchise_slug, payload")
    .eq("region", region)
    .eq("month", month);

  if (error) return res.status(500).json({ error: error.message });

  // Shape to { [franchise_slug]: payload }
  const shaped = Object.fromEntries((data || []).map(r => [r.franchise_slug, r.payload]));
  return res.status(200).json(shaped);
}
