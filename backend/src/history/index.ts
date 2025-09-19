import type { Context, HttpRequest } from "@azure/functions";
import { fetch } from "undici";

export default async function (context: Context, req: HttpRequest) {
  const id = context.bindingData?.id as string | undefined;
  if (!id) {
    context.res = { status: 400, body: { error: "missing_id" } };
    return;
  }

  // 7 jours, prix en USD
  const url = `https://api.coingecko.com/api/v3/coins/${encodeURIComponent(
    id
  )}/market_chart?vs_currency=usd&days=7`;

  try {
    const r = await fetch(url, { headers: { accept: "application/json" } });
    if (!r.ok) throw new Error(`coingecko HTTP ${r.status}`);
    const json = (await r.json()) as { prices: [number, number][] };

    // map → { time (ISO), price }
    const points = (json.prices || []).map(([ts, price]) => ({
      time: new Date(ts).toISOString(),
      price,
    }));

    context.res = {
      headers: {
        "content-type": "application/json",
        "access-control-allow-origin": "*", // CORS POC
      },
      body: {
        id,
        range: "7d",
        points,
      },
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
