// api/metrics/report.js
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE
);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { month, region, franchiseSlug, payload } = req.body || {};
    if (!month || !region || !franchiseSlug || !payload) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const { error } = await supabase.from("metrics").insert({
      month,
      region,
      franchise_slug: franchiseSlug,
      payload
    });

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
