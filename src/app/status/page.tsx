import Link from "next/link";
import {
  collectStatusReport,
  formatMilliseconds,
  formatPercentage,
  getStatusCopy,
} from "@/lib/status";
import { SITE } from "@/lib/site";

export const dynamic = "force-dynamic";

function statusTone(status: string): string {
  switch (status) {
    case "operational":
      return "text-[#3fb950]";
    case "degraded":
      return "text-[#d29922]";
    case "down":
      return "text-[#f85149]";
    default:
      return "text-[#8b949e]";
  }
}

function statusDot(status: string): string {
  switch (status) {
    case "operational":
      return "bg-[#3fb950] shadow-[0_0_20px_rgba(63,185,80,0.35)]";
    case "degraded":
      return "bg-[#d29922] shadow-[0_0_20px_rgba(210,153,34,0.25)]";
    case "down":
      return "bg-[#f85149] shadow-[0_0_20px_rgba(248,81,73,0.25)]";
    default:
      return "bg-[#8b949e]";
  }
}

function responseTone(ms: number | null): string {
  if (ms === null) return "text-[#8b949e]";
  if (ms < 600) return "text-[#3fb950]";
  if (ms < 1500) return "text-[#d29922]";
  return "text-[#f85149]";
}

export default async function StatusPage() {
  const report = await collectStatusReport();
  const copy = getStatusCopy(report.overall.status);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(88,166,255,0.12),_transparent_38%),linear-gradient(180deg,#010409_0%,#0d1117_100%)] text-[#c9d1d9]">
      <section className="mx-auto max-w-6xl px-6 py-10 sm:py-14">
        <div className="mb-8 flex items-center justify-between gap-4 border-b border-[#21262d] pb-6">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-[#8b949e]">
              Service status
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              {SITE.name} status
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#8b949e] sm:text-base">
              Live uptime and response-time checks for the main site and public
              endpoints. This is based on recent probe samples, not a separate
              hosted monitoring vendor.
            </p>
          </div>
          <Link
            href="/"
            className="rounded-full border border-[#30363d] px-4 py-2 text-sm text-[#c9d1d9] transition-colors hover:border-[#58a6ff] hover:text-white"
          >
            Back home
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <article className="rounded-2xl border border-[#30363d] bg-[#0d1117]/80 p-5 shadow-2xl shadow-black/20 backdrop-blur">
            <div className="flex items-center gap-3">
              <span className={`h-3 w-3 rounded-full ${statusDot(report.overall.status)}`} />
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-[#8b949e]">
                  Current status
                </p>
                <h2 className={`mt-1 text-2xl font-semibold ${statusTone(report.overall.status)}`}>
                  {copy.label}
                </h2>
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-[#8b949e]">
              {copy.description}
            </p>
          </article>

          <article className="rounded-2xl border border-[#30363d] bg-[#0d1117]/80 p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-[#8b949e]">
              24h uptime
            </p>
            <p className="mt-3 text-3xl font-bold text-white">
              {formatPercentage(report.overall.uptime24h)}
            </p>
            <p className="mt-2 text-sm text-[#8b949e]">Recent probe samples</p>
          </article>

          <article className="rounded-2xl border border-[#30363d] bg-[#0d1117]/80 p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-[#8b949e]">
              7d uptime
            </p>
            <p className="mt-3 text-3xl font-bold text-white">
              {formatPercentage(report.overall.uptime7d)}
            </p>
            <p className="mt-2 text-sm text-[#8b949e]">Rolling availability</p>
          </article>

          <article className="rounded-2xl border border-[#30363d] bg-[#0d1117]/80 p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-[#8b949e]">
              Avg response
            </p>
            <p className="mt-3 text-3xl font-bold text-white">
              {formatMilliseconds(report.overall.averageResponseMs)}
            </p>
            <p className="mt-2 text-sm text-[#8b949e]">
              {report.overall.healthyCount}/{report.overall.totalCount} checked up
            </p>
          </article>
        </div>

        <section className="mt-8 rounded-3xl border border-[#30363d] bg-[#0d1117]/80 p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3 border-b border-[#21262d] pb-4">
            <div>
              <h2 className="text-xl font-semibold text-white">Endpoints</h2>
              <p className="mt-1 text-sm text-[#8b949e]">
                Response status, observed uptime, and latency for each public
                route.
              </p>
            </div>
            <p className="text-xs uppercase tracking-[0.24em] text-[#8b949e]">
              Checked {new Date(report.checkedAt).toLocaleString()}
            </p>
          </div>

          <div className="mt-5 overflow-hidden rounded-2xl border border-[#21262d]">
            <div className="grid grid-cols-12 gap-3 border-b border-[#21262d] bg-[#161b22] px-4 py-3 text-xs uppercase tracking-[0.2em] text-[#8b949e]">
              <div className="col-span-4 sm:col-span-3">Endpoint</div>
              <div className="col-span-3 sm:col-span-3">Status</div>
              <div className="col-span-2 sm:col-span-2">Uptime</div>
              <div className="col-span-2 sm:col-span-2">Response</div>
              <div className="col-span-1 sm:col-span-2">Link</div>
            </div>
            {report.endpoints.map((endpoint) => (
              <div
                key={endpoint.key}
                className="grid grid-cols-12 gap-3 border-b border-[#21262d] px-4 py-4 last:border-b-0"
              >
                <div className="col-span-4 sm:col-span-3">
                  <p className="font-medium text-white">{endpoint.label}</p>
                  <p className="mt-1 break-all text-xs text-[#8b949e]">
                    {endpoint.path}
                  </p>
                </div>
                <div className="col-span-3 sm:col-span-3">
                  <span
                    className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${statusTone(endpoint.ok ? "operational" : "down")}`}
                  >
                    {endpoint.ok ? `Up ${endpoint.status ?? ""}` : "Down"}
                  </span>
                  {endpoint.error ? (
                    <p className="mt-2 text-xs text-[#8b949e]">{endpoint.error}</p>
                  ) : null}
                </div>
                <div className="col-span-2 sm:col-span-2 text-sm text-white">
                  {formatPercentage(endpoint.uptime24h)}
                </div>
                <div className={`col-span-2 sm:col-span-2 text-sm font-medium ${responseTone(endpoint.responseTimeMs)}`}>
                  {formatMilliseconds(endpoint.responseTimeMs)}
                </div>
                <div className="col-span-1 sm:col-span-2">
                  <a
                    href={endpoint.url}
                    className="text-sm text-[#58a6ff] transition-colors hover:text-[#79c0ff]"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        <p className="mt-6 text-xs text-[#8b949e]">
          Observed uptime is computed from recent probe samples stored in the
          app&apos;s Redis cache when available.
        </p>
      </section>
    </main>
  );
}
