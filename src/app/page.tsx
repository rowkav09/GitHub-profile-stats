import CardPreview from "@/components/CardPreview";
import HeroCard from "@/components/HeroCard";

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
            href="https://github.com/rowkav09/GitHub-profile-stats"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm text-[#8b949e] hover:text-[#c9d1d9] transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
            View on GitHub
          </a>
        </div>
      </header>

      {/* ─── Hero ─── */}
      <section className="border-b border-[#21262d] bg-gradient-to-b from-[#010409] to-[#0d1117]">
        <div className="mx-auto max-w-6xl px-6 py-20 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl animate-slide-up">
            GitHub Stats for Your README
          </h1>
          <p className="mt-4 text-lg text-[#8b949e] max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '80ms' }}>
            One line in your README — that&apos;s it. Your stats card stays up to date automatically.
            Pick a theme, hide what you don&apos;t need, and you&apos;re done.
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
            <HeroCard />
          </div>
        </div>
      </section>

      {/* ─── Quick Start ─── */}
      <section className="border-b border-[#21262d]">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="text-2xl font-bold">Quick Start</h2>

          {/* Step 1 */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-[#c9d1d9] flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#238636] text-xs font-bold text-white">1</span>
              Create your profile README
            </h3>
            <p className="mt-2 text-sm text-[#8b949e] ml-8">
              GitHub displays a special README on your profile when you create a repo with the same name as your username.
            </p>
            <ol className="mt-2 ml-8 text-sm text-[#8b949e] list-decimal list-inside space-y-1">
              <li>Go to{" "}
                <a href="https://github.com/new" target="_blank" rel="noopener noreferrer" className="text-[#58a6ff] hover:underline">github.com/new</a>
              </li>
              <li>Set the repo name to <strong className="text-[#c9d1d9]">your exact username</strong></li>
              <li>Make it <strong className="text-[#c9d1d9]">public</strong> and check <strong className="text-[#c9d1d9]">&quot;Add a README file&quot;</strong></li>
              <li>Click <strong className="text-[#c9d1d9]">Create repository</strong></li>
            </ol>
            <p className="mt-2 text-xs text-[#484f58] ml-8">
              Already have a profile README? Skip to step 2.
            </p>
          </div>

          {/* Step 2 */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-[#c9d1d9] flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#238636] text-xs font-bold text-white">2</span>
              Add your stats card
            </h3>
            <p className="mt-2 text-sm text-[#8b949e] ml-8">
              Edit the <code className="rounded bg-[#161b22] px-1.5 py-0.5 text-[#79c0ff]">README.md</code> in your profile repo and paste:
            </p>
            <pre className="mt-3 ml-8 overflow-x-auto rounded-lg border border-[#30363d] bg-[#161b22] px-5 py-4 text-sm text-[#c9d1d9]">
              {`![GitHub Stats](https://ghstats.dev/api/card?username=YOUR_USERNAME)`}
            </pre>
            <p className="mt-3 ml-8 text-sm text-[#8b949e]">
              Want a different look? Add{" "}
              <code className="rounded bg-[#161b22] px-1.5 py-0.5 text-[#79c0ff]">{'&theme=tokyonight'}</code>{" "}
              or use the editor below to customise everything.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Interactive Preview ─── */}
      <section id="try" className="border-b border-[#21262d]">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="text-2xl font-bold mb-2">Try It Out</h2>
          <p className="text-[#8b949e] mb-8">
            Customise your card and copy the embed code.
          </p>
          <CardPreview />
        </div>
      </section>

      {/* ─── Parameters ─── */}
      <section id="params" className="border-b border-[#21262d]">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="text-2xl font-bold mb-2">All Parameters</h2>
          <p className="text-[#8b949e] mb-6">
            Everything you can pass as a URL query parameter.
          </p>
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
      <footer className="border-t border-[#21262d] bg-[#010409]">
        <div className="mx-auto max-w-6xl px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-[#484f58]">
          <span>GitHub Profile Stats — open source and free to use.</span>
          <a
            href="https://github.com/rowkav09/GitHub-profile-stats"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[#8b949e] hover:text-[#c9d1d9] transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
            rowkav09/GitHub-profile-stats
          </a>
        </div>
      </footer>
    </main>
  );
}
