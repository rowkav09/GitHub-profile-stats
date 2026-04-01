import VisualBuilder from "@/components/VisualBuilder";
import Link from "next/link";

export const metadata = {
  title: "Visual Builder — GitHub Profile Stats",
  description:
    "Drag, resize, and arrange your GitHub stats embed with the visual builder. Add a language chart, choose layouts, and generate your perfect embed code.",
};

export default function BuilderPage() {
  return (
    <main className="min-h-screen">
      {/* ─── Header ─── */}
      <header className="border-b border-[#21262d] bg-[#010409]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-lg font-bold tracking-tight hover:opacity-80 transition-opacity"
            >
              <span className="text-[#58a6ff]">GitHub</span>{" "}
              <span className="text-[#c9d1d9]">Profile Stats</span>
            </Link>
            <span className="text-[#30363d]">/</span>
            <span className="flex items-center gap-1.5 text-sm font-medium text-[#c9d1d9]">
              <svg
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="text-[#58a6ff]"
              >
                <path d="M14.064 0h.186C15.216 0 16 .784 16 1.75v.186a8.752 8.752 0 0 1-2.564 6.186l-.458.459c-.314.314-.641.616-.979.904v3.207l-2.209 3.322a.75.75 0 0 1-1.243-.833l1.952-2.932v-.993a8.72 8.72 0 0 1-.49-.292L7.786 13.8a.75.75 0 1 1-1.072-1.05l2.725-2.775a8.59 8.59 0 0 1-.697-.743H5.785l-2.93 1.952a.75.75 0 0 1-.833-1.243L5.344 7.73V4.578a14.56 14.56 0 0 1-.904-.979l-.459-.458A8.752 8.752 0 0 1 1.75 0C.784 0 0 .784 0 1.75v.186a8.752 8.752 0 0 0 2.564 6.186l.458.459c.314.314.641.616.979.904v3.025l2.209 3.322a.75.75 0 0 0 1.243-.833l-1.952-2.932V9.883c.162.1.326.193.49.28l1.764 2.768a.75.75 0 1 0 1.312-.737L7.2 10l.03-.028A8.59 8.59 0 0 0 8 10.71l.03.028-1.08 1.697c.05.032.1.064.15.097a.75.75 0 0 0 1.051-.258l1.765-2.768c.337-.155.666-.33.98-.525V5.754c.338-.288.665-.59.979-.904l.459-.458A8.752 8.752 0 0 0 14.25 1.75v-.186C14.25.784 14.216 0 14.064 0z" />
              </svg>
              Visual Builder
            </span>
            <span className="rounded-full bg-[#238636]/20 border border-[#238636]/40 px-2 py-0.5 text-xs font-medium text-[#3fb950]">
              preview
            </span>
          </div>
          <a
            href="https://github.com/rowkav09/GitHub-profile-stats"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm text-[#8b949e] hover:text-[#c9d1d9] transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
            </svg>
            GitHub
          </a>
        </div>
      </header>

      {/* ─── Page intro ─── */}
      <section className="border-b border-[#21262d] bg-gradient-to-b from-[#010409] to-[#0d1117]">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-3">
            <h1 className="text-3xl font-bold tracking-tight">Visual Builder</h1>
            <p className="text-[#8b949e] text-sm pb-0.5">
              Drag stats to reorder · toggle to show/hide · pick a layout · add a language chart
            </p>
          </div>
          <div className="flex flex-wrap gap-3 text-xs text-[#484f58]">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#238636]" />
              Drag &amp; drop reordering
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#58a6ff]" />
              List or compact grid layout
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#bf91f3]" />
              Language breakdown chart
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ffa657]" />
              Live preview with instant updates
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f0883e]" />
              Import &amp; edit any existing embed
            </span>
          </div>
        </div>
      </section>

      {/* ─── Visual Builder (drag & drop card editor) ─── */}
      <section>
        <div className="mx-auto max-w-6xl px-6 py-10">
          <VisualBuilder />
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-[#21262d] bg-[#010409] mt-10">
        <div className="mx-auto max-w-6xl px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-[#484f58]">
          <span>GitHub Profile Stats — Visual Builder (preview branch)</span>
          <Link
            href="/"
            className="text-[#8b949e] hover:text-[#c9d1d9] transition-colors"
          >
            ← Back to main site
          </Link>
        </div>
      </footer>
    </main>
  );
}
