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
  { key: "trend", label: "Weekly Trend" },
  { key: "avg", label: "Avg/Day" },
  { key: "active_day", label: "Active Day" },
  { key: "grade", label: "Grade" },
  { key: "contributions", label: "Contributions" },
  { key: "repos", label: "Repos" },
  { key: "followers", label: "Followers" },
];

type EmbedType = "card" | "langs" | "mini" | "sparkline";

const EMBED_LABELS: Record<EmbedType, string> = {
  card: "GitHub Stats",
  langs: "Top Languages",
  mini: "GitHub Badge",
  sparkline: "GitHub Activity",
};

export default function CardPreview() {
  const [embedType, setEmbedType] = useState<EmbedType>("card");
  const [username, setUsername] = useState("octocat");
  const [theme, setTheme] = useState("default");
  const [showIcons, setShowIcons] = useState(true);
  const [hideBorder, setHideBorder] = useState(false);
  const [hideTitle, setHideTitle] = useState(false);
  const [showRing, setShowRing] = useState(true);
  const [hiddenStats, setHiddenStats] = useState<string[]>([]);
  const [customTitle, setCustomTitle] = useState("");
  const [borderRadius, setBorderRadius] = useState("4.5");
  const [size, setSize] = useState<"default" | "compact">("default");
  const [compactCount, setCompactCount] = useState<3 | 4 | 6>(6);
  const [showEmoji, setShowEmoji] = useState(false);
  const [langLayout, setLangLayout] = useState<"bar" | "stacked">("bar");
  const [maxLangs, setMaxLangs] = useState(8);
  const [miniMetric, setMiniMetric] = useState("stars");
  const [miniLabel, setMiniLabel] = useState("");
  const [miniColor, setMiniColor] = useState("");
  const [sparkDays, setSparkDays] = useState("30");
  const [sparkWidth, setSparkWidth] = useState("320");
  const [sparkHeight, setSparkHeight] = useState("80");
  const [sparkLineColor, setSparkLineColor] = useState("");
  const [sparkFillColor, setSparkFillColor] = useState("");
  const [sparkTitle, setSparkTitle] = useState("");
  const [sparkHideBorder, setSparkHideBorder] = useState(false);
  const [sparkBorderRadius, setSparkBorderRadius] = useState("6");
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [imgUrl, setImgUrl] = useState("");
  const [origin, setOrigin] = useState("https://ghstats.dev");
  const [loading, setLoading] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [importInput, setImportInput] = useState("");
  const [importStatus, setImportStatus] = useState<{ ok: boolean; msg: string } | null>(null);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const buildUrl = useCallback(
    (base: string) => {
      if (!username.trim()) return "";

      if (embedType === "card") {
        const p = new URLSearchParams();
        p.set("username", username.trim());
        if (theme !== "default") p.set("theme", theme);
        if (!showIcons) p.set("show_icons", "false");
        if (hideBorder) p.set("hide_border", "true");
        if (hideTitle) p.set("hide_title", "true");
        if (!showRing) p.set("show_ring", "false");
        if (hiddenStats.length) p.set("hide", hiddenStats.join(","));
        if (customTitle.trim()) p.set("custom_title", customTitle.trim());
        if (borderRadius !== "4.5") p.set("border_radius", borderRadius);
        if (size !== "default") p.set("size", size);
        if (size === "compact" && compactCount !== 6) p.set("compact_count", String(compactCount));
        if (size === "compact" && showEmoji) p.set("show_emoji", "true");
        return `${base}/api/card?${p.toString()}`;
      }

      if (embedType === "langs") {
        const p = new URLSearchParams();
        p.set("username", username.trim());
        if (theme !== "default") p.set("theme", theme);
        if (hideBorder) p.set("hide_border", "true");
        if (hideTitle) p.set("hide_title", "true");
        if (customTitle.trim()) p.set("custom_title", customTitle.trim());
        if (borderRadius !== "4.5") p.set("border_radius", borderRadius);
        if (maxLangs !== 8) p.set("max_langs", String(maxLangs));
        if (langLayout !== "bar") p.set("layout", langLayout);
        return `${base}/api/langs?${p.toString()}`;
      }

      if (embedType === "mini") {
        const p = new URLSearchParams();
        p.set("username", username.trim());
        p.set("metric", miniMetric);
        if (theme !== "default") p.set("theme", theme);
        if (miniLabel.trim()) p.set("label", miniLabel.trim());
        if (miniColor.trim()) p.set("color", miniColor.replace(/^#/, ""));
        return `${base}/api/mini?${p.toString()}`;
      }

      // sparkline
      const p = new URLSearchParams();
      p.set("username", username.trim());
      if (sparkDays !== "30") p.set("days", sparkDays);
      if (sparkWidth !== "320") p.set("width", sparkWidth);
      if (sparkHeight !== "80") p.set("height", sparkHeight);
      if (sparkLineColor.trim()) p.set("line_color", sparkLineColor.replace(/^#/, ""));
      if (sparkFillColor.trim()) p.set("fill_color", sparkFillColor.replace(/^#/, ""));
      if (sparkTitle.trim()) p.set("title", sparkTitle.trim());
      if (sparkHideBorder) p.set("hide_border", "true");
      if (sparkBorderRadius !== "6") p.set("border_radius", sparkBorderRadius);
      if (theme !== "default") p.set("theme", theme);
      return `${base}/api/sparkline?${p.toString()}`;
    },
    [username, embedType, theme, showIcons, hideBorder, hideTitle, showRing, hiddenStats, customTitle, borderRadius, size, compactCount, showEmoji, maxLangs, langLayout, miniMetric, miniLabel, miniColor, sparkDays, sparkWidth, sparkHeight, sparkLineColor, sparkFillColor, sparkTitle, sparkHideBorder, sparkBorderRadius],
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
  const repoUrl = "https://github.com/rowkav09/GitHub-profile-stats";
  const embedLabel = EMBED_LABELS[embedType];
  const markdownCode = embedUrl
    ? `[![${embedLabel}](${embedUrl})](${repoUrl})`
    : "Add a username to generate embed code.";
  const htmlCode = embedUrl
    ? `<a href="${repoUrl}"><img src="${embedUrl}" alt="${embedLabel}" /></a>`
    : "Add a username to generate embed code.";

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

  function extractEmbedUrl(raw: string): { url: string; type: EmbedType } | null {
    const patterns = [
      /!\[.*?\]\((https?:\/\/[^)]+\/api\/(card|langs|mini|sparkline)[^)]*?)\)/,
      /src=["'](https?:\/\/[^"']+\/api\/(card|langs|mini|sparkline)[^"']*?)["']/,
      /(https?:\/\/\S*?\/api\/(card|langs|mini|sparkline)[^\s"')>]*)/,
    ];
    for (const r of patterns) {
      const match = raw.match(r);
      if (match) {
        return { url: match[1], type: match[2] as EmbedType };
      }
    }
    return null;
  }

  function handleImport() {
    const found = extractEmbedUrl(importInput);
    if (!found) {
      setImportStatus({ ok: false, msg: "Couldn't find an embed URL in that code." });
      return;
    }
    const { url, type } = found;
    try {
      const p = new URL(url).searchParams;
      const u = p.get("username");
      if (!u) {
        setImportStatus({ ok: false, msg: "No username found in the embed URL." });
        return;
      }
      setEmbedType(type);
      setUsername(u);
      setTheme(p.get("theme") ?? "default");
      if (type === "card") {
        setShowIcons(p.get("show_icons") !== "false");
        setHideBorder(p.get("hide_border") === "true");
        setHideTitle(p.get("hide_title") === "true");
        setShowRing(p.get("show_ring") !== "false");
        const hideStr = p.get("hide");
        setHiddenStats(hideStr ? hideStr.split(",").map((s) => s.trim()).filter(Boolean) : []);
        setCustomTitle(p.get("custom_title") ?? "");
        setBorderRadius(p.get("border_radius") ?? "4.5");
        setSize(p.get("size") === "compact" ? "compact" : "default");
        const cc = parseInt(p.get("compact_count") ?? "");
        setCompactCount(([3, 4, 6].includes(cc) ? cc : 6) as 3 | 4 | 6);
        setShowEmoji(p.get("show_emoji") === "true");
      } else if (type === "langs") {
        setHideBorder(p.get("hide_border") === "true");
        setHideTitle(p.get("hide_title") === "true");
        setCustomTitle(p.get("custom_title") ?? "");
        setBorderRadius(p.get("border_radius") ?? "4.5");
        setLangLayout(p.get("layout") === "stacked" ? "stacked" : "bar");
        const ml = parseInt(p.get("max_langs") ?? "", 10);
        setMaxLangs(Number.isFinite(ml) ? ml : 8);
      } else if (type === "mini") {
        setMiniMetric(p.get("metric") ?? "stars");
        setMiniLabel(p.get("label") ?? "");
        setMiniColor(p.get("color") ?? "");
      } else {
        setSparkDays(p.get("days") ?? "30");
        setSparkWidth(p.get("width") ?? "320");
        setSparkHeight(p.get("height") ?? "80");
        setSparkLineColor(p.get("line_color") ?? "");
        setSparkFillColor(p.get("fill_color") ?? "");
        setSparkTitle(p.get("title") ?? "");
        setSparkHideBorder(p.get("hide_border") === "true");
        setSparkBorderRadius(p.get("border_radius") ?? "6");
      }
      setImportStatus({ ok: true, msg: `Loaded ${type} settings for @${u}` });
      setImportInput("");
      setTimeout(() => { setImportOpen(false); setImportStatus(null); }, 1800);
    } catch {
      setImportStatus({ ok: false, msg: "Invalid URL in embed code." });
    }
  }

  return (
    <div className="space-y-10">
      {/* ─── Import existing embed ─── */}
      <div className="rounded-xl border border-[#30363d] overflow-hidden animate-slide-up">
        <button
          onClick={() => { setImportOpen((o) => !o); setImportStatus(null); }}
          className="w-full flex items-center justify-between px-5 py-3.5 bg-[#161b22] text-sm text-[#c9d1d9] hover:text-white transition-colors duration-200"
        >
          <span className="flex items-center gap-2.5 font-medium">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" className="text-[#58a6ff]">
              <path d="M8.75 1.75a.75.75 0 0 0-1.5 0V8H4.81l1.97-1.97a.75.75 0 0 0-1.06-1.06L2.47 8.22a.75.75 0 0 0 0 1.06l3.25 3.25a.75.75 0 0 0 1.06-1.06L4.81 9.5H7.25A.75.75 0 0 0 8 10.25V8h2.44l-1.97 1.97a.75.75 0 1 0 1.06 1.06l3.25-3.25a.75.75 0 0 0 0-1.06L9.53 4.47a.75.75 0 0 0-1.06 1.06L10.44 7.5H8.75V1.75z"/>
            </svg>
            Edit an existing embed
          </span>
          <svg
            width="12"
            height="12"
            viewBox="0 0 16 16"
            fill="currentColor"
            className={`text-[#8b949e] transition-transform duration-200 ${importOpen ? "rotate-180" : ""}`}
          >
            <path d="M4.427 7.427l3.396 3.396a.25.25 0 0 0 .354 0l3.396-3.396A.25.25 0 0 0 11.396 7H4.604a.25.25 0 0 0-.177.427z"/>
          </svg>
        </button>
        {importOpen && (
          <div className="px-5 py-4 bg-[#0d1117] border-t border-[#30363d] space-y-3">
            <p className="text-xs text-[#8b949e]">
              Paste any existing Markdown, HTML, or raw embed URL (card, languages, mini badge, or sparkline) and your settings will be loaded into the editor.
            </p>
            <textarea
              value={importInput}
              onChange={(e) => { setImportInput(e.target.value); setImportStatus(null); }}
              placeholder={`![GitHub Stats](https://ghstats.dev/api/card?username=octocat&theme=tokyonight)`}
              rows={3}
              className="w-full rounded-lg border border-[#30363d] bg-[#161b22] px-4 py-2.5 text-xs text-[#c9d1d9] placeholder-[#484f58] font-mono resize-none focus:border-[#58a6ff] focus:outline-none focus:ring-1 focus:ring-[#58a6ff]/40 transition-all duration-200"
            />
            <div className="flex items-center gap-3">
              <button
                onClick={handleImport}
                disabled={!importInput.trim()}
                className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-[#58a6ff] text-[#0d1117] hover:bg-[#79c0ff] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
              >
                Load into editor
              </button>
              {importStatus && (
                <span className={`text-xs font-medium ${
                  importStatus.ok ? "text-[#3fb950]" : "text-[#f85149]"
                }`}>
                  {importStatus.msg}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ─── Top: Preview + Controls side-by-side ─── */}
      <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
        {/* Left: inputs */}
        <div className="space-y-5 animate-slide-up">
          <div>
            <label className="label-text">Embed Type</label>
            <div className="mt-2 inline-flex rounded-xl border border-[#30363d] bg-[#0d1117] p-[3px] flex-wrap">
              {([
                { key: "card", label: "Stats Card" },
                { key: "langs", label: "Languages" },
                { key: "mini", label: "Mini Badge" },
                { key: "sparkline", label: "Sparkline" },
              ] as const).map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => setEmbedType(opt.key)}
                  className={`px-4 py-1.5 rounded-[9px] text-xs font-semibold tracking-wide transition-all duration-200 ease-out m-[2px] ${
                    embedType === opt.key
                      ? "bg-[#21262d] text-white shadow-sm border border-[#30363d]"
                      : "text-[#8b949e] hover:text-[#c9d1d9]"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

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

          {(embedType === "card" || embedType === "langs") && (
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
          )}

          {(embedType === "card" || embedType === "langs") && (
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
          )}

          {embedType === "card" && (
            <>
              <div>
                <label className="label-text">Layout</label>
                <div className="mt-2 inline-flex rounded-xl border border-[#30363d] bg-[#0d1117] p-[3px]">
                  {(["default", "compact"] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      className={`px-5 py-1.5 rounded-[9px] text-xs font-semibold tracking-wide transition-all duration-200 ease-out ${
                        size === s
                          ? "bg-[#21262d] text-white shadow-sm border border-[#30363d]"
                          : "text-[#8b949e] hover:text-[#c9d1d9]"
                      }`}
                    >
                      {s === "default" ? "Standard" : "Compact"}
                    </button>
                  ))}
                </div>
              </div>

              {size === "compact" && (
                <div className="space-y-4 rounded-xl border border-[#30363d]/60 bg-[#0d1117] px-4 py-4">
                  <div>
                    <label className="label-text">Stats to show</label>
                    <div className="mt-2 inline-flex rounded-xl border border-[#30363d] bg-[#161b22] p-[3px]">
                      {([3, 4, 6] as const).map((n) => (
                        <button
                          key={n}
                          onClick={() => setCompactCount(n)}
                          className={`px-4 py-1.5 rounded-[9px] text-xs font-semibold tracking-wide transition-all duration-200 ease-out ${
                            compactCount === n
                              ? "bg-[#21262d] text-white shadow-sm border border-[#30363d]"
                              : "text-[#8b949e] hover:text-[#c9d1d9]"
                          }`}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                    <p className="mt-1.5 text-[11px] text-[#484f58]">Shows the first {compactCount} visible stats in order</p>
                  </div>
                  <label className="toggle-label">
                    <input
                      type="checkbox"
                      checked={showEmoji}
                      onChange={(e) => setShowEmoji(e.target.checked)}
                      className="accent-[#58a6ff] w-4 h-4 rounded"
                    />
                    Use emojis instead of icons
                  </label>
                </div>
              )}

              <div className="flex flex-wrap gap-x-5 gap-y-2">
                {[{ label: "Show Icons", checked: showIcons, set: setShowIcons },
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
            </>
          )}

          {embedType === "langs" && (
            <div className="space-y-4 rounded-xl border border-[#30363d]/60 bg-[#0d1117] px-4 py-4">
              <div>
                <label className="label-text">Layout</label>
                <div className="mt-2 inline-flex rounded-xl border border-[#30363d] bg-[#161b22] p-[3px]">
                  {(["bar", "stacked"] as const).map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setLangLayout(opt)}
                      className={`px-4 py-1.5 rounded-[9px] text-xs font-semibold tracking-wide transition-all duration-200 ease-out ${
                        langLayout === opt
                          ? "bg-[#21262d] text-white shadow-sm border border-[#30363d]"
                          : "text-[#8b949e] hover:text-[#c9d1d9]"
                      }`}
                    >
                      {opt === "bar" ? "Bar" : "Stacked"}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="label-text">
                  Max languages: <span className="text-[#58a6ff] font-semibold">{maxLangs}</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="12"
                  value={maxLangs}
                  onChange={(e) => setMaxLangs(Number(e.target.value))}
                  className="w-full accent-[#58a6ff] mt-1"
                />
              </div>
              <div className="flex flex-wrap gap-x-5 gap-y-2">
                {[{ label: "Hide Border", checked: hideBorder, set: setHideBorder },
                  { label: "Hide Title", checked: hideTitle, set: setHideTitle }].map((t) => (
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
            </div>
          )}

          {embedType === "mini" && (
            <div className="space-y-4 rounded-xl border border-[#30363d]/60 bg-[#0d1117] px-4 py-4">
              <div>
                <label className="label-text">Metric</label>
                <select
                  value={miniMetric}
                  onChange={(e) => setMiniMetric(e.target.value)}
                  className="input-field"
                >
                  {["stars","commits","prs","issues","streak","week","followers","repos","contributions"].map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label-text">Custom Label (optional)</label>
                <input
                  type="text"
                  value={miniLabel}
                  onChange={(e) => setMiniLabel(e.target.value)}
                  placeholder="Stars"
                  className="input-field"
                />
              </div>
              <div>
                <label className="label-text">Accent Colour (hex, no #)</label>
                <input
                  type="text"
                  value={miniColor}
                  onChange={(e) => setMiniColor(e.target.value)}
                  placeholder="f59e0b"
                  className="input-field"
                />
              </div>
            </div>
          )}

          {embedType === "sparkline" && (
            <div className="space-y-4 rounded-xl border border-[#30363d]/60 bg-[#0d1117] px-4 py-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label-text">Days (7-90)</label>
                  <input
                    type="number"
                    min={7}
                    max={90}
                    value={sparkDays}
                    onChange={(e) => setSparkDays(e.target.value)}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="label-text">Width</label>
                  <input
                    type="number"
                    min={180}
                    max={800}
                    value={sparkWidth}
                    onChange={(e) => setSparkWidth(e.target.value)}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="label-text">Height</label>
                  <input
                    type="number"
                    min={40}
                    max={240}
                    value={sparkHeight}
                    onChange={(e) => setSparkHeight(e.target.value)}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="label-text">Title (optional)</label>
                  <input
                    type="text"
                    value={sparkTitle}
                    onChange={(e) => setSparkTitle(e.target.value)}
                    placeholder="Last 30 days"
                    className="input-field"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label-text">Line Colour (hex)</label>
                  <input
                    type="text"
                    value={sparkLineColor}
                    onChange={(e) => setSparkLineColor(e.target.value)}
                    placeholder="58a6ff"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="label-text">Fill Colour (hex)</label>
                  <input
                    type="text"
                    value={sparkFillColor}
                    onChange={(e) => setSparkFillColor(e.target.value)}
                    placeholder="58a6ff"
                    className="input-field"
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-x-5 gap-y-2 items-center">
                <label className="toggle-label">
                  <input
                    type="checkbox"
                    checked={sparkHideBorder}
                    onChange={(e) => setSparkHideBorder(e.target.checked)}
                    className="accent-[#58a6ff] w-4 h-4 rounded"
                  />
                  Hide Border
                </label>
                <div className="flex items-center gap-3">
                  <label className="label-text">Border Radius</label>
                  <input
                    type="number"
                    min={0}
                    max={50}
                    step={0.5}
                    value={sparkBorderRadius}
                    onChange={(e) => setSparkBorderRadius(e.target.value)}
                    className="w-24 rounded border border-[#30363d] bg-[#161b22] px-3 py-1 text-sm text-[#c9d1d9]"
                  />
                </div>
              </div>
            </div>
          )}

          {embedType === "card" && (
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
          )}
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
                  alt={`${embedLabel} preview`}
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
                disabled={!embedUrl}
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
