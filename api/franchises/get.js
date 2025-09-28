const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE);

module.exports = async (req, res) => {
  const { slug } = req.query || {};
  if (!slug) return res.status(400).json({ error: "slug is required" });

  const { data, error } = await supabase
    .from("franchises")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) return res.status(404).json({ error: error.message });
  res.status(200).json(data);
};
