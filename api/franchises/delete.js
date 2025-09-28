// api/franchises/delete.js
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE
);

export default async function handler(req, res) {
  if (req.method !== "DELETE" && req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const src = req.body && Object.keys(req.body).length ? req.body : req.query;
  const { slug } = src || {};
  if (!slug) return res.status(400).json({ error: "slug is required" });

  const { error } = await supabase.from("franchises").delete().eq("slug", slug);

  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json({ ok: true });
}
