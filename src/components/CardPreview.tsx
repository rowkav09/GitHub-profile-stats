"use client";

import { useState, useEffect, useCallback } from "react";

const THEMES: Record<
  string,
  { name: string; bg: string; title: string; icon: string; text: string; border: string }
> = {
  default: { name: "Default", bg: "#0d1117", title: "#58a6ff", icon: "#58a6ff", text: "#c9d1d9", border: "#30363d" },
  light: { name: "Light", bg: "#ffffff", title: "#0969da", icon: "#0969da", text: "#24292f", border: "#d0d7de" },
  radical: { name: "Radical", bg: "#141321", title: "#fe428e", icon: "#f8d847", text: "#a9fef7", border: "#fe428e" },
  tokyonight: { name: "Tokyo Night", bg: "#1a1b27", title: "#bf91f3", icon: "#38bdae", text: "#70a5fd", border: "#70a5fd" },
  dracula: { name: "Dracula", bg: "#282a36", title: "#ff79c6", icon: "#bd93f9", text: "#f8f8f2", border: "#6272a4" },
  nord: { name: "Nord", bg: "#2e3440", title: "#88c0d0", icon: "#88c0d0", text: "#d8dee9", border: "#4c566a" },
  gruvbox: { name: "Gruvbox", bg: "#282828", title: "#fabd2f", icon: "#fe8019", text: "#ebdbb2", border: "#3c3836" },
  catppuccin: { name: "Catppuccin", bg: "#1e1e2e", title: "#cba6f7", icon: "#f5c2e7", text: "#cdd6f4", border: "#313244" },
  ocean: { name: "Ocean", bg: "#0b1929", title: "#00bfff", icon: "#00e5ff", text: "#a3c4e0", border: "#1a3a5c" },
  sunset: { name: "Sunset", bg: "#1a1025", title: "#ff6b6b", icon: "#ffa07a", text: "#e8d5c4", border: "#4a2040" },
  forest: { name: "Forest", bg: "#0d1f0d", title: "#4ec9b0", icon: "#6a9955", text: "#b5cea8", border: "#1e3a1e" },
  midnight: { name: "Midnight", bg: "#020024", title: "#00d4ff", icon: "#0099ff", text: "#eaeaea", border: "#090979" },
};

const STAT_OPTIONS = [
  { key: "stars", label: "Stars" },
  { key: "commits", label: "Commits" },
  { key: "prs", label: "PRs" },
  { key: "issues", label: "Issues" },
  { key: "streak", label: "Streak" },
  { key: "week", label: "This Week" },
  { key: "trend", label: "Monthly Trend" },
  { key: "avg", label: "Avg/Day" },
  { key: "active_day", label: "Active Day" },
  { key: "grade", label: "Grade" },
  { key: "contributions", label: "Contributions" },
  { key: "repos", label: "Repos" },
  { key: "followers", label: "Followers" },
];

export default function CardPreview() {
  const [username, setUsername] = useState("octocat");
  const [theme, setTheme] = useState("default");
  const [showIcons, setShowIcons] = useState(true);
  const [hideBorder, setHideBorder] = useState(false);
  const [hideTitle, setHideTitle] = useState(false);
  const [showRing, setShowRing] = useState(true);
  const [hiddenStats, setHiddenStats] = useState<string[]>([]);
  const [customTitle, setCustomTitle] = useState("");
  const [borderRadius, setBorderRadius] = useState("4.5");
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [imgUrl, setImgUrl] = useState("");
  const [origin, setOrigin] = useState("https://ghstats.dev");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const buildUrl = useCallback(
    (base: string) => {
      const p = new URLSearchParams();
      p.set("username", username);
      if (theme !== "default") p.set("theme", theme);
      if (!showIcons) p.set("show_icons", "false");
      if (hideBorder) p.set("hide_border", "true");
      if (hideTitle) p.set("hide_title", "true");
      if (!showRing) p.set("show_ring", "false");
      if (hiddenStats.length) p.set("hide", hiddenStats.join(","));
      if (customTitle.trim()) p.set("custom_title", customTitle.trim());
      if (borderRadius !== "4.5") p.set("border_radius", borderRadius);
      return `${base}/api/card?${p.toString()}`;
    },
    [username, theme, showIcons, hideBorder, hideTitle, showRing, hiddenStats, customTitle, borderRadius],
  );

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      if (username.trim()) {
        setImgUrl(buildUrl(""));
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [username, buildUrl]);

  const embedUrl = buildUrl(origin);
  const markdownCode = `![GitHub Stats](${embedUrl})`;
  const htmlCode = `<img src="${embedUrl}" alt="GitHub Stats" />`;

  function toggleStat(key: string) {
    setHiddenStats((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  }

  async function copyToClipboard(text: string, field: string) {
    await navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  }

  return (
    <div className="space-y-10">
      {/* ─── Top: Preview + Controls side-by-side ─── */}
      <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
        {/* Left: inputs */}
        <div className="space-y-5 animate-slide-up">
          <div>
            <label className="label-text">GitHub Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="octocat"
              className="input-field"
            />
          </div>

          <div>
            <label className="label-text">
              Custom Title <span className="text-[#484f58] font-normal">(optional)</span>
            </label>
            <input
              type="text"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              placeholder="My Awesome Stats"
              className="input-field"
            />
          </div>

          <div>
            <label className="label-text">
              Border Radius: <span className="text-[#58a6ff] font-semibold">{borderRadius}</span>
            </label>
            <input
              type="range"
              min="0"
              max="50"
              step="0.5"
              value={borderRadius}
              onChange={(e) => setBorderRadius(e.target.value)}
              className="w-full accent-[#58a6ff] mt-1"
            />
          </div>

          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {[
              { label: "Show Icons", checked: showIcons, set: setShowIcons },
              { label: "Show Ring", checked: showRing, set: setShowRing },
              { label: "Hide Border", checked: hideBorder, set: setHideBorder },
              { label: "Hide Title", checked: hideTitle, set: setHideTitle },
            ].map((t) => (
              <label key={t.label} className="toggle-label">
                <input
                  type="checkbox"
                  checked={t.checked}
                  onChange={(e) => t.set(e.target.checked)}
                  className="accent-[#58a6ff] w-4 h-4 rounded"
                />
                {t.label}
              </label>
            ))}
          </div>

          <div>
            <label className="label-text">Hide Stats</label>
            <div className="flex flex-wrap gap-2 mt-1.5">
              {STAT_OPTIONS.map((stat) => (
                <button
                  key={stat.key}
                  onClick={() => toggleStat(stat.key)}
                  className={`stat-pill ${
                    hiddenStats.includes(stat.key)
                      ? "stat-pill-hidden"
                      : "stat-pill-visible"
                  }`}
                >
                  {stat.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Live Preview */}
        <div className="animate-slide-up" style={{ animationDelay: "80ms" }}>
          <label className="label-text">Live Preview</label>
          <div className="preview-box">
            {imgUrl ? (
              <div className="relative w-full flex items-center justify-center">
                {loading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-[#161b22]/60 rounded-lg z-10">
                    <div className="w-5 h-5 border-2 border-[#58a6ff] border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  key={imgUrl}
                  src={imgUrl}
                  alt="Stats card preview"
                  className="max-w-full transition-opacity duration-500 ease-out"
                  style={{ opacity: loading ? 0.4 : 1 }}
                  onLoad={() => setLoading(false)}
                  onError={() => setLoading(false)}
                />
              </div>
            ) : (
              <p className="text-[#484f58] text-sm">
                Enter a username to see the preview
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ─── Theme Grid ─── */}
      <div className="animate-slide-up" style={{ animationDelay: "160ms" }}>
        <label className="label-text mb-3 block">Theme</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {Object.entries(THEMES).map(([key, t]) => {
            const isActive = theme === key;
            return (
              <button
                key={key}
                onClick={() => setTheme(key)}
                className="theme-card group"
                style={{
                  borderColor: isActive ? t.title : "transparent",
                  boxShadow: isActive ? `0 0 16px ${t.title}25` : "none",
                }}
              >
                <div
                  className="rounded-lg p-3 transition-all duration-300 ease-out"
                  style={{ backgroundColor: t.bg }}
                >
                  <div
                    className="text-xs font-semibold mb-2 truncate transition-colors duration-300"
                    style={{ color: t.title }}
                  >
                    {t.name}
                  </div>
                  <div className="flex gap-1.5">
                    {[t.title, t.icon, t.text, t.border].map((c, i) => (
                      <div
                        key={i}
                        className="h-4 w-4 rounded-full border border-white/10 transition-transform duration-300 ease-out group-hover:scale-110"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
                <div
                  className="mt-1 text-[10px] text-center truncate transition-colors duration-300"
                  style={{ color: isActive ? t.title : "#6e7681" }}
                >
                  {key}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── Embed Code ─── */}
      <div className="grid gap-4 sm:grid-cols-2 animate-slide-up" style={{ animationDelay: "240ms" }}>
        {[
          { label: "Markdown", code: markdownCode, id: "md" },
          { label: "HTML", code: htmlCode, id: "html" },
        ].map((block) => (
          <div key={block.id} className="embed-block">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-semibold text-[#8b949e] uppercase tracking-widest">
                {block.label}
              </span>
              <button
                onClick={() => copyToClipboard(block.code, block.id)}
                className="copy-btn"
              >
                {copiedField === block.id ? (
                  <span className="text-[#3fb950] transition-colors duration-200">Copied!</span>
                ) : (
                  "Copy"
                )}
              </button>
            </div>
            <pre className="text-xs text-[#c9d1d9] whitespace-pre-wrap break-all leading-relaxed">
              {block.code}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
}
