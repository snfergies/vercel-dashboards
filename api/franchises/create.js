// /api/franchises/create.js
import { kv } from "@vercel/kv";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const token = (req.headers.authorization || "").replace("Bearer ", "");
  if (token !== process.env.ADMIN_API_TOKEN) return res.status(401).json({ error: "Unauthorized" });

  const { name, location, region = "PNW" } = req.body || {};
  if (!name || !location) return res.status(400).json({ error: "Missing name/location" });

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const key = `franchise:${slug}`;

  const exists = await kv.get(key);
  if (exists) return res.status(409).json({ error: "Franchise already exists", slug });

  const franchise = {
    slug,
    name,
    location,
    region,
    createdAt: Date.now(),
    designers: [],
    goalsByMonth: {}
  };

  await kv.set(key, franchise);

  // Sales URL inside this same deployment
  const salesUrl = `/sales/index.html?franchise=${encodeURIComponent(slug)}`;
  return res.status(200).json({ ok: true, franchise, salesUrl });
}
