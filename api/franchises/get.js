// api/franchises/get.js
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE
);

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { slug } = req.query;

  let query = supabase
    .from("franchises")
    .select("slug,name,city,province,created_at")
    .order("slug", { ascending: true });

  if (slug) query = query.eq("slug", slug).single();

  const { data, error } = await query;

  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json(data);
}
