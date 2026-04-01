"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { themes } from "@/lib/themes";

const STAT_OPTIONS = [
  { key: "stars", label: "Stars" },
  { key: "commits", label: "Commits" },
  { key: "prs", label: "PRs" },
  { key: "issues", label: "Issues" },
  { key: "streak", label: "Streak" },
  { key: "week", label: "This Week" },
  { key: "trend", label: "Trend" },
  { key: "avg", label: "Avg / Day" },
  { key: "active_day", label: "Active Day" },
  { key: "grade", label: "Grade" },
  { key: "contributions", label: "Contributions" },
  { key: "repos", label: "Repos" },
  { key: "followers", label: "Followers" },
];

type EmbedType = "card" | "langs" | "mini" | "sparkline";

const EMBED_LABELS: Record<EmbedType, string> = {
  card: "GitHub Stats Card",
  langs: "Top Languages",
  mini: "GitHub Mini Badge",
  sparkline: "Contribution Sparkline",
};

export default function CardPreview() {
  const [embedType, setEmbedType] = useState<EmbedType>("card");
  const [username, setUsername] = useState("octocat");
  const [theme, setTheme] = useState("default");
  const [advancedMode, setAdvancedMode] = useState(false);

  // Card options
  const [showIcons, setShowIcons] = useState(true);
  const [showRing, setShowRing] = useState(true);
  const [hideBorder, setHideBorder] = useState(false);
  const [hideTitle, setHideTitle] = useState(false);
  const [borderRadius, setBorderRadius] = useState("4.5");
  const [customTitle, setCustomTitle] = useState("");
  const [size, setSize] = useState<"default" | "compact">("default");
  const [compactCount, setCompactCount] = useState<3 | 4 | 6>(6);
  const [showEmoji, setShowEmoji] = useState(false);
  const [hiddenStats, setHiddenStats] = useState<string[]>([]);

  // Languages options
  const [langLayout, setLangLayout] = useState<"bar" | "stacked">("bar");
  const [maxLangs, setMaxLangs] = useState(8);

  // Mini badge options
  const [miniMetric, setMiniMetric] = useState("stars");
  const [miniLabel, setMiniLabel] = useState("");
  const [miniColor, setMiniColor] = useState("");

  // Sparkline options
  const [sparkDays, setSparkDays] = useState("30");
  const [sparkWidth, setSparkWidth] = useState("320");
  const [sparkHeight, setSparkHeight] = useState("80");
  const [sparkTitle, setSparkTitle] = useState("");
  const [sparkLineColor, setSparkLineColor] = useState("");
  const [sparkFillColor, setSparkFillColor] = useState("");
  const [sparkHideBorder, setSparkHideBorder] = useState(false);
  const [sparkBorderRadius, setSparkBorderRadius] = useState("6");

  // Preview + embed code
  const [embedUrl, setEmbedUrl] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [embedLabel, setEmbedLabel] = useState(EMBED_LABELS.card);
  const [markdownCode, setMarkdownCode] = useState("");
  const [htmlCode, setHtmlCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [origin, setOrigin] = useState("https://ghstats.dev");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  const toggleStat = useCallback((key: string) => {
    setHiddenStats((prev) =>
      prev.includes(key) ? prev.filter((s) => s !== key) : [...prev, key],
    );
  }, []);

  const buildEmbedUrl = useCallback(() => {
    if (!username.trim()) return "";

    const base = `${origin}/api/${embedType}`;
    const p = new URLSearchParams();
    p.set("username", username.trim());
    if (theme !== "default") p.set("theme", theme);

    if (embedType === "card") {
      if (!showIcons) p.set("show_icons", "false");
      if (!showRing) p.set("show_ring", "false");
      if (hideBorder) p.set("hide_border", "true");
      if (hideTitle) p.set("hide_title", "true");
      if (borderRadius !== "4.5") p.set("border_radius", borderRadius);
      if (customTitle.trim()) p.set("custom_title", customTitle.trim());
      if (size === "compact") p.set("size", "compact");
      if (size === "compact" && compactCount !== 6) p.set("compact_count", String(compactCount));
      if (size === "compact" && showEmoji) p.set("show_emoji", "true");
      if (hiddenStats.length > 0) p.set("hide", hiddenStats.join(","));
    }

    if (embedType === "langs") {
      if (hideBorder) p.set("hide_border", "true");
      if (hideTitle) p.set("hide_title", "true");
      if (borderRadius !== "4.5") p.set("border_radius", borderRadius);
      if (customTitle.trim()) p.set("custom_title", customTitle.trim());
      if (maxLangs !== 8) p.set("max_langs", String(maxLangs));
      if (langLayout !== "bar") p.set("layout", langLayout);
    }

    if (embedType === "mini") {
      if (miniMetric !== "stars") p.set("metric", miniMetric);
      if (miniLabel.trim()) p.set("label", miniLabel.trim());
      if (miniColor.trim()) p.set("color", miniColor.trim());
    }

    if (embedType === "sparkline") {
      p.set("days", sparkDays || "30");
      p.set("width", sparkWidth || "320");
      p.set("height", sparkHeight || "80");
      if (sparkHideBorder) p.set("hide_border", "true");
      if (sparkBorderRadius !== "6") p.set("border_radius", sparkBorderRadius);
      if (sparkLineColor.trim()) p.set("line_color", sparkLineColor.trim());
      if (sparkFillColor.trim()) p.set("fill_color", sparkFillColor.trim());
      if (sparkTitle.trim()) p.set("title", sparkTitle.trim());
    }

    return `${base}?${p.toString()}`;
  }, [borderRadius, compactCount, customTitle, embedType, hideBorder, hideTitle, hiddenStats, langLayout, maxLangs, miniColor, miniLabel, miniMetric, origin, showEmoji, showIcons, showRing, size, sparkBorderRadius, sparkDays, sparkFillColor, sparkHeight, sparkHideBorder, sparkLineColor, sparkTitle, sparkWidth, theme, username]);

  useEffect(() => {
    const url = buildEmbedUrl();
    setEmbedUrl(url);
    setEmbedLabel(EMBED_LABELS[embedType]);

    if (!url) {
      setImgUrl("");
      setMarkdownCode("");
      setHtmlCode("");
      return;
    }

    const sep = url.includes("?") ? "&" : "?";
    setLoading(true);
    setImgUrl(`${url}${sep}cache=${Date.now()}`);
    setMarkdownCode(`![${EMBED_LABELS[embedType]}](${url})`);
    setHtmlCode(`<img src="${url}" alt="${EMBED_LABELS[embedType]}" />`);
  }, [buildEmbedUrl, embedType]);

  const copyToClipboard = useCallback((text: string, field: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 1200);
    });
  }, []);

  const themeEntries = useMemo(() => Object.entries(themes), []);

  return (
    <section id="try" className="border-b border-[#21262d] bg-[#0d1117]">
      <div className="mx-auto max-w-6xl px-6 py-16 space-y-10">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-2xl font-bold">Try it out</h2>
            <p className="text-sm text-[#8b949e]">Generate your embed, preview it, then copy a single line.</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#8b949e] bg-[#0b1117] border border-[#30363d] rounded-lg px-3 py-1.5">
            <span className="h-2 w-2 rounded-full bg-[#238636]" />
            Live preview refreshes automatically
          </div>
        </div>

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

            <div className="flex items-center gap-3">
              <label className="label-text mb-0">Advanced Options</label>
              <button
                type="button"
                onClick={() => setAdvancedMode((v) => !v)}
                className={`rounded-lg px-3 py-1 text-xs font-semibold border transition-all duration-200 ${
                  advancedMode
                    ? "bg-[#21262d] border-[#58a6ff]/50 text-white"
                    : "bg-transparent border-[#30363d] text-[#8b949e] hover:text-[#c9d1d9]"
                }`}
              >
                {advancedMode ? "Hide advanced" : "Show advanced"}
              </button>
            </div>

            {advancedMode && (
              <>
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
                        <label className="label-text">Fill Colour (hex)
                        </label>
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
              </>
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
            {themeEntries.map(([key, t]) => {
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
    </section>
  );
}
