// Cloudflare Worker: relay cek halaman Fragment.
// Dipanggil: https://NAMA.SUBDOMAIN.workers.dev/?u=USERNAME&k=SECRET
// Balasan JSON: {"code": <HTTP status dari Fragment>, "title": "<og:title mentah>"}

const OG1 = /<meta[^>]*?property="og:title"[^>]*?content="([^"]*)"/i;
const OG2 = /<meta[^>]*?content="([^"]*)"[^>]*?property="og:title"/i;
const USN = /^[a-z][a-z0-9_]{3,30}[a-z0-9]$/;

const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.5",
  "Referer": "https://fragment.com/",
};

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const u = (url.searchParams.get("u") || "").toLowerCase();
    const k = url.searchParams.get("k") || "";

    // Kunci rahasia supaya worker tidak dipakai orang lain
    if (env.SECRET && k !== env.SECRET) {
      return json({ error: "unauthorized" }, 401);
    }
    if (!USN.test(u) || u.includes("__")) {
      return json({ code: 400, title: "" });
    }

    try {
      const r = await fetch(`https://fragment.com/username/${u}`, {
        headers: HEADERS,
        redirect: "follow",
        cf: { cacheTtl: 0, cacheEverything: false },
      });
      const text = await r.text();
      const m = text.match(OG1) || text.match(OG2);
      return json({ code: r.status, title: m ? m[1].trim() : "" });
    } catch (e) {
      return json({ code: 0, title: "" });
    }
  },
};
