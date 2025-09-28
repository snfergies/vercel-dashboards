// /api/metrics/ingest-proxy.js
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const base = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : `http://localhost:3000`;
    const resp = await fetch(`${base}/api/metrics/report`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.METRICS_INGEST_TOKEN}`
      },
      body: JSON.stringify(req.body || {})
    });
    const data = await resp.json().catch(() => ({}));
    return res.status(resp.status).json(data);
  } catch (e) {
    console.error("ingest-proxy error:", e);
    return res.status(500).json({ error: "Proxy error" });
  }
}
