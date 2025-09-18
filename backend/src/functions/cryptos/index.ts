import type { HttpRequest } from "@azure/functions";

export default async function (context: any, req: HttpRequest) {
  const data = [
    {
      id: "bitcoin",
      name: "Bitcoin",
      price: 0,
      change24h: 0,
      trend: "Hausse 🚀",
    },
    {
      id: "ethereum",
      name: "Ethereum",
      price: 0,
      change24h: 0,
      trend: "Baisse 📉",
    },
  ];
  context.res = {
    headers: { "content-type": "application/json" },
    body: data,
  };
}
