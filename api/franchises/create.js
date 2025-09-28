// api/franchises/create.js
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE
);

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { name, cityState, monthlyGoal, designers } = req.body || {};
    if (!name || !cityState || !monthlyGoal || !designers) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const [city, stateRaw] = cityState.split(",").map(s => s.trim());
    const state = stateRaw || "";
    const slug = slugify(name);

    const { data, error } = await supabase
      .from("franchises")
      .upsert(
        {
          slug,
          name,
          city,
          state,
          monthly_goal: Number(monthlyGoal),
          designers: Number(designers)
        },
        { onConflict: "slug" }
      )
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ ok: true, franchise: data, slug });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
