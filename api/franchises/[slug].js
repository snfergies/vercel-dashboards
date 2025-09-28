// /api/franchises/[slug].js
import { kv } from "@vercel/kv";

export default async function handler(req, res) {
  const slug = req.query.slug;
  if (!slug) return res.status(400).json({ error: "Missing slug" });

  const key = `franchise:${slug}`;
  const franchise = await kv.get(key);

  if (req.method === "GET") {
    if (!franchise) return res.status(404).json({ error: "Not found" });
    return res.status(200).json(franchise);
  }

  if (req.method === "PATCH") {
    if (!franchise) return res.status(404).json({ error: "Not found" });
    const body = req.body || {};
    const updated = { ...franchise };

    if (Array.isArray(body.designers)) updated.designers = body.designers;
    if (body.goalsByMonth && typeof body.goalsByMonth === "object") {
      updated.goalsByMonth = { ...updated.goalsByMonth, ...body.goalsByMonth };
    }

    await kv.set(key, updated);
    return res.status(200).json({ ok: true, franchise: updated });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
