// api/franchises/index.js
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  // Service role key so we can do inserts/deletes from server
  process.env.SUPABASE_SERVICE_ROLE
);

// GET  /api/franchises?region=canada
// POST /api/franchises  { slug, name, region, city, state, monthly_goal, designers }
export default async function handler(req, res) {
  if (req.method === "GET") {
    const { region } = req.query;
    let query = supabase.from("franchises").select("*").order("name");
    if (region) query = query.eq("region", region);

    const { data, error } = await query;
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ data });
  }

  if (req.method === "POST") {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const { slug, name, region, city, state, monthly_goal, designers } = body || {};

    if (!slug || !name || !region) {
      return res.status(400).json({ error: "slug, name, region are required" });
    }

    const { data, error } = await supabase.from("franchises").insert([{
      slug,
      name,
      region,
      city: city || null,
      state: state || null,
      monthly_goal: monthly_goal ?? null,
      designers: designers ?? null
    }]).select().single();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json({ data });
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).end("Method Not Allowed");
}
