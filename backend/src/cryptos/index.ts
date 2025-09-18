import type { Context, HttpRequest } from "@azure/functions";
import { fetch } from "undici";

export default async function (context: Context, req: HttpRequest) {
  try {
    const url =
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&price_change_percentage=24h";
    const res = await fetch(url, { headers: { accept: "application/json" } });

    if (!res.ok) {
      throw new Error(`coingecko HTTP ${res.status}`);
    }

    const data = (await res.json()) as any[];
    const mapped = data.map((c) => ({
      id: c.id,
      name: c.name,
      price: c.current_price,
      change24h: c.price_change_percentage_24h?.toFixed?.(2) ?? 0,
      trend:
        (c.price_change_percentage_24h ?? 0) >= 0 ? "Hausse 🚀" : "Baisse 📉",
    }));

    context.res = {
      headers: {
        "content-type": "application/json",
        "access-control-allow-origin": "*",
      },
      body: mapped,
    };
  } catch (e: any) {
    context.log.error(e?.message ?? e);
    context.res = {
      status: 502,
      headers: {
        "content-type": "application/json",
        "access-control-allow-origin": "*",
      },
      body: { error: "fetch_failed" },
    };
  }
}
