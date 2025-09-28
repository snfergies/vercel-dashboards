// api/franchises/[slug].js
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE
);

// DELETE /api/franchises/downtown-seattle
export default async function handler(req, res) {
  const { slug } = req.query;

  if (req.method === "DELETE") {
    const { error } = await supabase.from("franchises").delete().eq("slug", slug);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(204).end();
  }

  res.setHeader("Allow", ["DELETE"]);
  return res.status(405).end("Method Not Allowed");
}
