// /api/franchises/create-proxy.js
// Public endpoint that forwards to /api/franchises/create and injects ADMIN_API_TOKEN on the server.
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const base = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : `http://localhost:3000`;
    const resp = await fetch(`${base}/api/franchises/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.ADMIN_API_TOKEN}`
      },
      body: JSON.stringify(req.body || {})
    });

    const data = await resp.json().catch(() => ({}));
    return res.status(resp.status).json(data);
  } catch (e) {
    console.error("create-proxy error:", e);
    return res.status(500).json({ error: "Proxy error" });
  }
}
