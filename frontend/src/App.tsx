import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Row = {
  id: string;
  name: string;
  price: number;
  change24h: number;
  trend: string;
};
type Point = { time: string; price: number };

const BACKEND = import.meta.env.VITE_API_BASE_URL as string;

export default function App() {
  const [rows, setRows] = React.useState<Row[]>([]);
  const [sel, setSel] = React.useState<string | null>(null);
  const [history, setHistory] = React.useState<Point[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [hLoading, setHLoading] = React.useState(false);
  const [hError, setHError] = React.useState<string | null>(null);

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

  React.useEffect(() => {
    if (!sel) return;
    (async () => {
      setHLoading(true);
      setHError(null);
      try {
        const res = await fetch(`${BACKEND}/api/history/${sel}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = (await res.json()) as { points: Point[] };
        setHistory(json.points);
      } catch (err: any) {
        setHError(String(err?.message ?? err));
      } finally {
        setHLoading(false);
      }
    })();
  }, [sel]);

  return (
    <main style={{ padding: 24, fontFamily: "system-ui, sans-serif" }}>
      <h1>Crypto Tracker Cloud</h1>
      {loading && <p>Chargement…</p>}
      {error && <p style={{ color: "crimson" }}>Erreur: {error}</p>}

      {!loading && !error && (
        <>
          <table
            cellPadding={8}
            style={{
              borderCollapse: "collapse",
              marginTop: 12,
              width: "100%",
              maxWidth: 900,
            }}
          >
            <thead>
              <tr>
                <th
                  style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}
                >
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
                <th
                  style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}
                >
                  Tendance
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr
                  key={r.id}
                  onClick={() => setSel(r.id)}
                  style={{
                    borderBottom: "1px solid #eee",
                    cursor: "pointer",
                    background: sel === r.id ? "#f5f5f5" : "transparent",
                  }}
                  title="Cliquer pour voir l'historique 7 jours"
                >
                  <td>{r.name}</td>
                  <td style={{ textAlign: "right" }}>{r.price}</td>
                  <td style={{ textAlign: "right" }}>{r.change24h}%</td>
                  <td>{r.trend}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <section style={{ marginTop: 24 }}>
            <h2 style={{ marginBottom: 8 }}>
              Historique 7 jours {sel ? `— ${sel}` : ""}
            </h2>
            {!sel && <p>Sélectionne une crypto dans le tableau.</p>}
            {sel && hLoading && <p>Chargement du graphe…</p>}
            {sel && hError && (
              <p style={{ color: "crimson" }}>Erreur: {hError}</p>
            )}
            {sel && !hLoading && !hError && history.length > 0 && (
              <div style={{ width: "100%", height: 360, maxWidth: 900 }}>
                <ResponsiveContainer>
                  <LineChart
                    data={history}
                    margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="time"
                      tickFormatter={(t) => new Date(t).toLocaleDateString()}
                      minTickGap={32}
                    />
                    <YAxis tickFormatter={(v) => `$${v}`} width={72} />
                    <Tooltip
                      formatter={(v: any) => [
                        `$${Number(v).toLocaleString()}`,
                        "Prix",
                      ]}
                      labelFormatter={(t: any) => new Date(t).toLocaleString()}
                    />
                    <Line type="monotone" dataKey="price" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </section>
        </>
      )}
    </main>
  );
}
