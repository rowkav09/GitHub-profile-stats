import CardPreview from "@/components/CardPreview";

const PARAMS = [
  {
    name: "username",
    type: "string",
    default: "required",
    desc: "GitHub username to fetch stats for",
  },
  {
    name: "theme",
    type: "string",
    default: '"default"',
    desc: "Theme preset name (see Themes below)",
  },
  {
    name: "bg",
    type: "hex",
    default: "—",
    desc: "Custom background color (without #)",
  },
  {
    name: "text",
    type: "hex",
    default: "—",
    desc: "Custom text color (without #)",
  },
  {
    name: "title_color",
    type: "hex",
    default: "—",
    desc: "Custom title color (without #)",
  },
  {
    name: "icon_color",
    type: "hex",
    default: "—",
    desc: "Custom icon color (without #)",
  },
  {
    name: "border_color",
    type: "hex",
    default: "—",
    desc: "Custom border color (without #)",
  },
  {
    name: "hide_border",
    type: "boolean",
    default: "false",
    desc: 'Set to "true" to remove the border',
  },
  {
    name: "hide_title",
    type: "boolean",
    default: "false",
    desc: 'Set to "true" to remove the title',
  },
  {
    name: "show_icons",
    type: "boolean",
    default: "true",
    desc: 'Set to "false" to hide stat icons',
  },
  {
    name: "show_ring",
    type: "boolean",
    default: "true",
    desc: 'Set to "false" to hide the activity ring',
  },
  {
    name: "hide",
    type: "string",
    default: "—",
    desc: "Comma-separated stat keys to hide",
  },
  {
    name: "border_radius",
    type: "number",
    default: "4.5",
    desc: "Card corner radius (0–50)",
  },
  {
    name: "custom_title",
    type: "string",
    default: "—",
    desc: "Override the card title text",
  },
];

const HIDE_KEYS = [
  { key: "stars", desc: "Total Stars Earned" },
  { key: "commits", desc: "Total Commits (year)" },
  { key: "prs", desc: "Pull Requests" },
  { key: "issues", desc: "Issues Opened" },
  { key: "streak", desc: "Current Streak" },
  { key: "week", desc: "Commits This Week" },
  { key: "trend", desc: "Monthly Trend (+/-)" },
  { key: "avg", desc: "Avg Commits Per Day" },
  { key: "active_day", desc: "Most Active Day" },
  { key: "grade", desc: "Activity Grade" },
  { key: "contributions", desc: "Contributions This Year" },
  { key: "repos", desc: "Public Repos" },
  { key: "followers", desc: "Followers" },
];

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* ─── Header ─── */}
      <header className="border-b border-[#21262d] bg-[#010409]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="text-lg font-bold tracking-tight">
            <span className="text-[#58a6ff]">GitHub</span> Profile Stats
          </span>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[#8b949e] hover:text-[#c9d1d9] transition-colors"
          >
            GitHub →
          </a>
        </div>
      </header>

      {/* ─── Hero ─── */}
      <section className="border-b border-[#21262d] bg-gradient-to-b from-[#010409] to-[#0d1117]">
        <div className="mx-auto max-w-6xl px-6 py-20 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl animate-slide-up">
            Beautiful GitHub Stats Cards
          </h1>
          <p className="mt-4 text-lg text-[#8b949e] max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '80ms' }}>
            Dynamically generated stats cards for your GitHub README.
            <br />
            Just swap in your username — no build step, no config files.
          </p>
          <div className="mt-8 flex justify-center gap-4 animate-slide-up" style={{ animationDelay: '160ms' }}>
            <a
              href="#try"
              className="rounded-lg bg-[#238636] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#2ea043] transition-all duration-200 hover:shadow-lg hover:shadow-[#238636]/20"
            >
              Try It Out
            </a>
            <a
              href="#params"
              className="rounded-lg border border-[#30363d] px-5 py-2.5 text-sm font-medium text-[#c9d1d9] hover:border-[#8b949e] transition-all duration-200"
            >
              Documentation
            </a>
          </div>
          <div className="mt-12 animate-slide-up" style={{ animationDelay: '240ms' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/api/card?username=octocat&theme=default"
              alt="Example stats card"
              className="mx-auto max-w-full rounded-xl shadow-2xl shadow-black/50"
            />
          </div>
        </div>
      </section>

      {/* ─── Quick Start ─── */}
      <section className="border-b border-[#21262d]">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="text-2xl font-bold">Quick Start</h2>
          <p className="mt-3 text-[#8b949e]">
            Add this line to your GitHub README and replace{" "}
            <code className="rounded bg-[#161b22] px-1.5 py-0.5 text-sm text-[#79c0ff]">
              YOUR_USERNAME
            </code>{" "}
            with your GitHub username:
          </p>
          <pre className="mt-4 overflow-x-auto rounded-lg border border-[#30363d] bg-[#161b22] px-5 py-4 text-sm text-[#c9d1d9]">
            {`![GitHub Stats](https://your-deploy.vercel.app/api/card?username=YOUR_USERNAME)`}
          </pre>
          <p className="mt-3 text-sm text-[#484f58]">
            Replace <code className="text-[#79c0ff]">your-deploy.vercel.app</code> with your
            actual deployment URL after deploying.
          </p>
        </div>
      </section>

      {/* ─── Interactive Preview ─── */}
      <section id="try" className="border-b border-[#21262d]">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="text-2xl font-bold mb-2">Try It Out</h2>
          <p className="text-[#8b949e] mb-8">
            Customise your card below and copy the embed code.
          </p>
          <CardPreview />
        </div>
      </section>

      {/* ─── Parameters ─── */}
      <section id="params" className="border-b border-[#21262d]">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="text-2xl font-bold mb-6">Parameters</h2>
          <div className="overflow-x-auto rounded-lg border border-[#30363d]">
            <table className="w-full text-sm">
              <thead className="bg-[#161b22] text-left text-[#8b949e]">
                <tr>
                  <th className="px-4 py-3 font-medium">Parameter</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Default</th>
                  <th className="px-4 py-3 font-medium">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#21262d]">
                {PARAMS.map((p) => (
                  <tr key={p.name} className="hover:bg-[#161b22]/50">
                    <td className="px-4 py-3">
                      <code className="rounded bg-[#161b22] px-1.5 py-0.5 text-xs text-[#79c0ff]">
                        {p.name}
                      </code>
                    </td>
                    <td className="px-4 py-3 text-[#8b949e]">{p.type}</td>
                    <td className="px-4 py-3 text-[#8b949e]">
                      <code className="text-xs">{p.default}</code>
                    </td>
                    <td className="px-4 py-3 text-[#c9d1d9]">{p.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Hideable Stats */}
          <h3 className="text-xl font-semibold mt-10 mb-4">
            Stats You Can Hide
          </h3>
          <p className="text-[#8b949e] mb-4">
            Pass a comma-separated list of keys to the{" "}
            <code className="rounded bg-[#161b22] px-1.5 py-0.5 text-sm text-[#79c0ff]">
              hide
            </code>{" "}
            parameter:
          </p>
          <pre className="overflow-x-auto rounded-lg border border-[#30363d] bg-[#161b22] px-5 py-3 text-sm text-[#c9d1d9] mb-4">
            ?hide=stars,issues,followers
          </pre>
          <div className="overflow-x-auto rounded-lg border border-[#30363d]">
            <table className="w-full text-sm">
              <thead className="bg-[#161b22] text-left text-[#8b949e]">
                <tr>
                  <th className="px-4 py-3 font-medium">Key</th>
                  <th className="px-4 py-3 font-medium">Stat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#21262d]">
                {HIDE_KEYS.map((h) => (
                  <tr key={h.key} className="hover:bg-[#161b22]/50">
                    <td className="px-4 py-3">
                      <code className="rounded bg-[#161b22] px-1.5 py-0.5 text-xs text-[#79c0ff]">
                        {h.key}
                      </code>
                    </td>
                    <td className="px-4 py-3 text-[#c9d1d9]">{h.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>



      {/* ─── Footer ─── */}
      <footer className="bg-[#010409]">
        <div className="mx-auto max-w-6xl px-6 py-8 text-center text-sm text-[#484f58]">
          GitHub Profile Stats — open source and free to use.
        </div>
      </footer>
    </main>
  );
}
