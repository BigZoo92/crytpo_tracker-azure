import React from "react";

type Row = {
  id: string;
  name: string;
  price: number;
  change24h: number;
  trend: string;
};

const BACKEND = import.meta.env.VITE_API_BASE_URL ?? "";

export default function App() {
  const [rows, setRows] = React.useState<Row[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${BACKEND}/api/cryptos`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = (await res.json()) as Row[];
        setRows(json);
      } catch (err: any) {
        setError(String(err?.message ?? err));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <main style={{ padding: 24, fontFamily: "system-ui, sans-serif" }}>
      <h1>Crypto Tracker Cloud</h1>
      {loading && <p>Chargement…</p>}
      {error && <p style={{ color: "crimson" }}>Erreur: {error}</p>}
      {!loading && !error && (
        <table
          cellPadding={8}
          style={{ borderCollapse: "collapse", marginTop: 12 }}
        >
          <thead>
            <tr>
              <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>
                Nom
              </th>
              <th
                style={{ borderBottom: "1px solid #ccc", textAlign: "right" }}
              >
                Prix
              </th>
              <th
                style={{ borderBottom: "1px solid #ccc", textAlign: "right" }}
              >
                24h
              </th>
              <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>
                Tendance
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td style={{ borderBottom: "1px solid #eee" }}>{r.name}</td>
                <td
                  style={{ borderBottom: "1px solid #eee", textAlign: "right" }}
                >
                  {r.price}
                </td>
                <td
                  style={{ borderBottom: "1px solid #eee", textAlign: "right" }}
                >
                  {r.change24h}%
                </td>
                <td style={{ borderBottom: "1px solid #eee" }}>{r.trend}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
