import type { Context } from "@azure/functions";
import { fetch } from "undici";

type Coin = {
  id: string;
  name: string;
  price_change_percentage_24h: number | null;
};

const alertedRecently = new Map<string, number>(); // anti-spam léger (mémoire)
const COOLDOWN_MS = 30 * 60 * 1000; // 30 minutes

export default async function (context: Context) {
  try {
    const url =
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&price_change_percentage=24h";
    const res = await fetch(url, { headers: { accept: "application/json" } });
    if (!res.ok) throw new Error(`coingecko HTTP ${res.status}`);

    const data = (await res.json()) as Coin[];
    const now = Date.now();

    for (const c of data) {
      const ch = c.price_change_percentage_24h ?? 0;
      if (ch <= -5) {
        const last = alertedRecently.get(c.id) ?? 0;
        if (now - last > COOLDOWN_MS) {
          context.log(
            `ALERT_DROP_5PCT {"id":"${c.id}","name":"${
              c.name
            }","change24h":${ch.toFixed(2)},"at":"${new Date().toISOString()}"}`
          );
          context.log(`INGEST_TIMER_TICK ${new Date().toISOString()}`);
          alertedRecently.set(c.id, now);
        }
      }
    }
  } catch (e: any) {
    context.log.error("INGEST_TIMER_ERROR", e?.message ?? e);
  }
}
