import * as React from "react";
import {
  LineChart as RLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  LineChart as LineChartIcon,
  RefreshCw,
  Moon,
  Sun,
  Search,
} from "lucide-react";

// --- shadcn/ui
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

type Row = {
  id: string;
  name: string;
  price: number;
  change24h: number;
  trend: string;
};
type Point = { time: string; price: number };

const BACKEND = import.meta.env.VITE_API_BASE_URL as string;

function ThemeToggle() {
  const [dark, setDark] = React.useState(() =>
    document.documentElement.classList.contains("dark")
  );
  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setDark((d) => !d)}
      aria-label="Toggle theme"
    >
      {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
}

export default function App() {
  const [rows, setRows] = React.useState<Row[]>([]);
  const [query, setQuery] = React.useState("");
  const [sel, setSel] = React.useState<string | null>(null);
  const [history, setHistory] = React.useState<Point[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [hLoading, setHLoading] = React.useState(false);
  const [hError, setHError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${BACKEND}/api/cryptos`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = (await res.json()) as Row[];
        if (!cancelled) setRows(json);
      } catch (err: any) {
        if (!cancelled) setError(String(err?.message ?? err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  React.useEffect(() => {
    if (!sel) return;
    let cancelled = false;
    (async () => {
      setHLoading(true);
      setHError(null);
      try {
        const res = await fetch(`${BACKEND}/api/history/${sel}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = (await res.json()) as { points: Point[] };
        if (!cancelled) setHistory(json.points);
      } catch (err: any) {
        if (!cancelled) setHError(String(err?.message ?? err));
      } finally {
        if (!cancelled) setHLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [sel]);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (r) => r.name.toLowerCase().includes(q) || r.id.toLowerCase().includes(q)
    );
  }, [query, rows]);

  const topGainer = React.useMemo(
    () =>
      rows.length
        ? rows.reduce((a, b) => (b.change24h > a.change24h ? b : a))
        : null,
    [rows]
  );
  const topLoser = React.useMemo(
    () =>
      rows.length
        ? rows.reduce((a, b) => (b.change24h < a.change24h ? b : a))
        : null,
    [rows]
  );

  const fmtPrice = (v: number) => {
    try {
      return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 2,
      }).format(v);
    } catch {
      return `$${v}`;
    }
  };
  const fmtPct = (v: number) => `${v >= 0 ? "+" : ""}${v.toFixed?.(2) ?? v}%`;

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="sticky top-0 z-10 border-b backdrop-blur bg-background/70">
        <div className="container mx-auto flex items-center justify-between gap-4 p-4">
          <div className="flex items-center gap-2">
            <LineChartIcon className="h-5 w-5" />
            <h1 className="text-lg font-semibold">Crypto Tracker Cloud</h1>
            <Badge variant="secondary" className="ml-2">
              dev
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => window.location.reload()}
              title="Rafraîchir"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-6">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Erreur</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="col-span-1">
            <CardHeader className="pb-2">
              <CardDescription>Top gagnant (24h)</CardDescription>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <TrendingUp className="h-5 w-5 text-emerald-500" />
                {topGainer ? topGainer.name : "—"}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              {topGainer ? (
                <div className="flex items-center justify-between">
                  <span>{fmtPrice(topGainer.price)}</span>
                  <Badge className="bg-emerald-600/20 text-emerald-400 border-emerald-700">
                    {fmtPct(topGainer.change24h)}
                  </Badge>
                </div>
              ) : (
                <Skeleton className="h-6 w-full" />
              )}
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardHeader className="pb-2">
              <CardDescription>Top perdant (24h)</CardDescription>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <TrendingDown className="h-5 w-5 text-red-500" />
                {topLoser ? topLoser.name : "—"}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              {topLoser ? (
                <div className="flex items-center justify-between">
                  <span>{fmtPrice(topLoser.price)}</span>
                  <Badge className="bg-red-600/20 text-red-400 border-red-700">
                    {fmtPct(topLoser.change24h)}
                  </Badge>
                </div>
              ) : (
                <Skeleton className="h-6 w-full" />
              )}
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardHeader className="pb-2">
              <CardDescription>Sélection</CardDescription>
              <CardTitle className="text-2xl">{sel ?? "Aucune"}</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              <p>Clique une ligne pour afficher l’historique 7j.</p>
            </CardContent>
          </Card>
        </div>

        <Separator className="my-6" />

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="order-2 lg:order-1">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <CardTitle>Top 10</CardTitle>
                  <CardDescription>Prix & variation sur 24h</CardDescription>
                </div>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    className="pl-8 w-[220px]"
                    placeholder="Rechercher…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-2">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <Skeleton key={i} className="h-10 w-full" />
                  ))}
                </div>
              ) : (
                <ScrollArea className="h-[420px] w-full">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nom</TableHead>
                        <TableHead className="text-right">Prix</TableHead>
                        <TableHead className="text-right">24h</TableHead>
                        <TableHead>Tendance</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filtered.map((r) => (
                        <TableRow
                          key={r.id}
                          onClick={() => setSel(r.id)}
                          className={`cursor-pointer ${
                            sel === r.id ? "bg-accent/40" : ""
                          }`}
                          title="Cliquer pour voir l'historique 7 jours"
                        >
                          <TableCell className="font-medium">
                            {r.name}
                          </TableCell>
                          <TableCell className="text-right tabular-nums">
                            {fmtPrice(r.price)}
                          </TableCell>
                          <TableCell className="text-right tabular-nums">
                            <Badge
                              className={
                                r.change24h >= 0
                                  ? "bg-emerald-600/20 text-emerald-400 border-emerald-700"
                                  : "bg-red-600/20 text-red-400 border-red-700"
                              }
                            >
                              {fmtPct(r.change24h)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {r.trend.includes("Hausse") ? (
                              <span className="text-emerald-400">
                                Hausse 🚀
                              </span>
                            ) : (
                              <span className="text-red-400">Baisse 📉</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                      {filtered.length === 0 && (
                        <TableRow>
                          <TableCell
                            colSpan={4}
                            className="text-center text-muted-foreground"
                          >
                            Aucune crypto ne correspond à “{query}”.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </ScrollArea>
              )}
            </CardContent>
          </Card>

          {/* Chart */}
          <Card className="order-1 lg:order-2">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <LineChartIcon className="h-5 w-5" />
                Historique 7 jours {sel ? `— ${sel}` : ""}
              </CardTitle>
              <CardDescription>
                {sel
                  ? "Prix en USD sur 7 jours."
                  : "Sélectionne une crypto dans le tableau."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {sel && hLoading && <Skeleton className="h-[360px] w-full" />}
              {sel && hError && (
                <Alert variant="destructive">
                  <AlertTitle>Erreur</AlertTitle>
                  <AlertDescription>{hError}</AlertDescription>
                </Alert>
              )}
              {sel && !hLoading && !hError && history.length > 0 && (
                <div className="w-full h-[360px]">
                  <ResponsiveContainer>
                    <RLineChart
                      data={history}
                      margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="time"
                        minTickGap={32}
                        tickFormatter={(t) => new Date(t).toLocaleDateString()}
                      />
                      <YAxis
                        width={72}
                        tickFormatter={(v) =>
                          new Intl.NumberFormat(undefined, {
                            style: "currency",
                            currency: "USD",
                            maximumFractionDigits: 0,
                          }).format(Number(v))
                        }
                      />
                      <Tooltip
                        formatter={(v: any) => [
                          new Intl.NumberFormat(undefined, {
                            style: "currency",
                            currency: "USD",
                          }).format(Number(v)),
                          "Prix",
                        ]}
                        labelFormatter={(t: any) =>
                          new Date(t).toLocaleString()
                        }
                      />
                      <Line
                        type="monotone"
                        dataKey="price"
                        dot={false}
                        strokeWidth={2}
                      />
                    </RLineChart>
                  </ResponsiveContainer>
                </div>
              )}
              {!sel && <Skeleton className="h-[360px] w-full" />}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
