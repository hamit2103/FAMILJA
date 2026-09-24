const COUNTRY_FEEDS = {
  de: "https://news.google.com/rss?hl=de&gl=DE&ceid=DE:de",
  xk: "https://news.google.com/rss/search?q=Kosovo%20OR%20Kosov%C3%AB%20when%3A2d&hl=sq&gl=XK&ceid=XK%3Asq",
  tr: "https://news.google.com/rss?hl=tr&gl=TR&ceid=TR:tr"
};

const FALLBACK_KOSOVO = "https://news.google.com/rss/search?q=Kosovo%20when%3A2d&hl=en&gl=US&ceid=US:en";

function decodeXml(value="") {
  return String(value)
    .replace(/^<!\[CDATA\[/, "")
    .replace(/\]\]>$/, "")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .trim();
}

function tag(block, name) {
  const match = block.match(new RegExp("<" + name + "(?:\\s[^>]*)?>([\\s\\S]*?)<\\/" + name + ">", "i"));
  return match ? decodeXml(match[1]) : "";
}

function parseFeed(xml) {
  const blocks = String(xml).match(/<item\b[\s\S]*?<\/item>/gi) || [];
  const cutoff = Date.now() - 48 * 60 * 60 * 1000;
  const seen = new Set();
  const items = [];

  for (const block of blocks) {
    let title = tag(block, "title");
    const url = tag(block, "link");
    const source = tag(block, "source");
    const pubDate = tag(block, "pubDate");
    const time = Date.parse(pubDate);

    if (!title || !url || !Number.isFinite(time) || time < cutoff) continue;

    if (source) {
      const suffix = " - " + source;
      if (title.endsWith(suffix)) title = title.slice(0, -suffix.length).trim();
    }

    const key = title.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);

    items.push({
      title,
      source: source || "Google News",
      url,
      published_at: new Date(time).toISOString()
    });
  }

  return items
    .sort((a, b) => Date.parse(b.published_at) - Date.parse(a.published_at))
    .slice(0, 80);
}

async function getItems(url) {
  const response = await fetch(url, {
    headers: {
      "accept": "application/rss+xml, application/xml, text/xml;q=0.9, */*;q=0.8",
      "user-agent": "DIAMOND-News/1.0"
    }
  });
  if (!response.ok) throw new Error("RSS " + response.status);
  return parseFeed(await response.text());
}

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const country = String(req.query && req.query.country || "").toLowerCase();
  if (!COUNTRY_FEEDS[country]) {
    return res.status(400).json({ error: "country must be de, xk or tr" });
  }

  try {
    let items = await getItems(COUNTRY_FEEDS[country]);
    if (country === "xk" && items.length === 0) items = await getItems(FALLBACK_KOSOVO);

    res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=300");
    return res.status(200).json({
      country,
      updated_at: new Date().toISOString(),
      items
    });
  } catch (error) {
    console.error("news api", error);
    return res.status(502).json({ error: "News feed unavailable", items: [] });
  }
};
