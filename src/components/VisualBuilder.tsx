"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import CardPreview from "./CardPreview";

// ─── Constants ───────────────────────────────────────────────────────────────

const THEMES = [
  { key: "default", name: "Default" },
  { key: "light", name: "Light" },
  { key: "radical", name: "Radical" },
  { key: "tokyonight", name: "Tokyo Night" },
  { key: "dracula", name: "Dracula" },
  { key: "nord", name: "Nord" },
  { key: "gruvbox", name: "Gruvbox" },
  { key: "catppuccin", name: "Catppuccin" },
  { key: "ocean", name: "Ocean" },
  { key: "sunset", name: "Sunset" },
  { key: "forest", name: "Forest" },
  { key: "midnight", name: "Midnight" },
];

const ALL_STATS = [
  { key: "stars", label: "Total Stars Earned" },
  { key: "commits", label: "Total Commits (Year)" },
  { key: "prs", label: "Pull Requests" },
  { key: "issues", label: "Issues Opened" },
  { key: "streak", label: "Current Streak" },
  { key: "week", label: "Commits This Week" },
  { key: "trend", label: "Weekly Trend" },
  { key: "avg", label: "Avg Commits / Day" },
  { key: "active_day", label: "Most Active Day" },
  { key: "grade", label: "Activity Grade" },
  { key: "contributions", label: "Contributions (Year)" },
  { key: "repos", label: "Public Repos" },
  { key: "followers", label: "Followers" },
];

// ─── Types ───────────────────────────────────────────────────────────────────

interface StatConfig {
  key: string;
  label: string;
  enabled: boolean;
}

type LayoutMode = "list" | "compact";
type EditorTab = "visual" | "classic";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function extractCardUrl(raw: string): string | null {
  const mdMatch = raw.match(/!\[.*?\]\((https?:\/\/[^)]+\/api\/(?:card|langs)[^)]*?)\)/);
  if (mdMatch) return mdMatch[1];
  const htmlMatch = raw.match(/src=["'](https?:\/\/[^"']+\/api\/(?:card|langs)[^"']*?)["']/);
  if (htmlMatch) return htmlMatch[1];
  const trimmed = raw.trim();
  if (/https?:\/\/.+\/api\/(card|langs)/.test(trimmed)) return trimmed;
  return null;
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-xs font-semibold uppercase tracking-widest text-[#484f58] mb-2">
      {children}
    </h3>
  );
}

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer select-none group">
      <span
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-5 w-9 flex-shrink-0 rounded-full border-2 transition-colors duration-200 cursor-pointer ${
          checked ? "bg-[#238636] border-[#238636]" : "bg-[#21262d] border-[#30363d]"
        }`}
      >
        <span
          className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform duration-200 mt-px ${
            checked ? "translate-x-4" : "translate-x-0.5"
          }`}
        />
      </span>
      <span className="text-sm text-[#c9d1d9] group-hover:text-white transition-colors">{label}</span>
    </label>
  );
}

function CopyButton({
  text,
  label,
  fieldKey,
  copiedField,
  onCopy,
}: {
  text: string;
  label: string;
  fieldKey: string;
  copiedField: string | null;
  onCopy: (text: string, field: string) => void;
}) {
  const copied = copiedField === fieldKey;
  return (
    <button
      onClick={() => onCopy(text, fieldKey)}
      disabled={!text}
      className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed ${
        copied
          ? "bg-[#238636] text-white"
          : "bg-[#21262d] border border-[#30363d] text-[#c9d1d9] hover:border-[#58a6ff] hover:text-white"
      }`}
    >
      {copied ? (
        <>
          <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
            <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0z" />
          </svg>
          Copied!
        </>
      ) : (
        <>
          <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
            <path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z" />
            <path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z" />
          </svg>
          {label}
        </>
      )}
    </button>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function VisualBuilder() {
  const [activeTab, setActiveTab] = useState<EditorTab>("visual");

  // Config state
  const [username, setUsername] = useState("octocat");
  const [theme, setTheme] = useState("default");
  const [stats, setStats] = useState<StatConfig[]>(
    ALL_STATS.map((s) => ({ ...s, enabled: true })),
  );
  const [showLanguages, setShowLanguages] = useState(false);
  const [layout, setLayout] = useState<LayoutMode>("list");
  const [gridCols, setGridCols] = useState<3 | 4 | 6>(6);
  const [hideBorder, setHideBorder] = useState(false);
  const [hideTitle, setHideTitle] = useState(false);
  const [showRing, setShowRing] = useState(true);
  const [showIcons, setShowIcons] = useState(true);
  const [customTitle, setCustomTitle] = useState("");
  const [borderRadius, setBorderRadius] = useState("4.5");
  const [showEmoji, setShowEmoji] = useState(false);
  const [embedWidth, setEmbedWidth] = useState(495);
  const [maxLangs, setMaxLangs] = useState(8);

  // Preview state
  const [cardImgUrl, setCardImgUrl] = useState("");
  const [langsImgUrl, setLangsImgUrl] = useState("");
  const [cardLoading, setCardLoading] = useState(false);
  const [origin, setOrigin] = useState("https://ghstats.dev");

  // Drag state
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const dragNode = useRef<HTMLDivElement | null>(null);

  // Import/export state
  const [importOpen, setImportOpen] = useState(false);
  const [importInput, setImportInput] = useState("");
  const [importStatus, setImportStatus] = useState<{
    ok: boolean;
    msg: string;
  } | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  // ─── URL builders ──────────────────────────────────────────────────────────

  const buildCardUrl = useCallback(
    (base: string) => {
      if (!username.trim()) return "";
      const p = new URLSearchParams();
      p.set("username", username.trim());
      if (theme !== "default") p.set("theme", theme);
      if (!showIcons) p.set("show_icons", "false");
      if (hideBorder) p.set("hide_border", "true");
      if (hideTitle) p.set("hide_title", "true");
      if (!showRing && layout !== "compact") p.set("show_ring", "false");

      const disabledKeys = stats.filter((s) => !s.enabled).map((s) => s.key);
      if (disabledKeys.length > 0) p.set("hide", disabledKeys.join(","));

      const enabledOrder = stats.filter((s) => s.enabled).map((s) => s.key);
      const defaultOrder = ALL_STATS.map((s) => s.key);
      const isReordered = enabledOrder.some(
        (k, i) => k !== defaultOrder.filter((dk) => !disabledKeys.includes(dk))[i],
      );
      if (isReordered) p.set("order", enabledOrder.join(","));

      if (customTitle.trim()) p.set("custom_title", customTitle.trim());
      if (borderRadius !== "4.5") p.set("border_radius", borderRadius);

      if (layout === "compact") {
        p.set("size", "compact");
        if (gridCols !== 6) p.set("compact_count", String(gridCols));
        if (showEmoji) p.set("show_emoji", "true");
      }
      return `${base}/api/card?${p.toString()}`;
    },
    [username, theme, showIcons, hideBorder, hideTitle, showRing, stats, customTitle, borderRadius, layout, gridCols, showEmoji],
  );

  const buildLangsUrl = useCallback(
    (base: string) => {
      if (!username.trim()) return "";
      const p = new URLSearchParams();
      p.set("username", username.trim());
      if (theme !== "default") p.set("theme", theme);
      if (hideBorder) p.set("hide_border", "true");
      if (borderRadius !== "4.5") p.set("border_radius", borderRadius);
      if (maxLangs !== 8) p.set("max_langs", String(maxLangs));
      return `${base}/api/langs?${p.toString()}`;
    },
    [username, theme, hideBorder, borderRadius, maxLangs],
  );

  // ─── Debounced preview ─────────────────────────────────────────────────────

  useEffect(() => {
    if (!username.trim()) {
      setCardImgUrl("");
      setLangsImgUrl("");
      return;
    }
    setCardLoading(true);
    const timer = setTimeout(() => {
      setCardImgUrl(buildCardUrl(""));
      setLangsImgUrl(showLanguages ? buildLangsUrl("") : "");
    }, 600);
    return () => clearTimeout(timer);
  }, [buildCardUrl, buildLangsUrl, username, showLanguages]);

  // ─── Drag & Drop ───────────────────────────────────────────────────────────

  function handleDragStart(e: React.DragEvent, index: number) {
    setDragIndex(index);
    e.dataTransfer.effectAllowed = "move";
    // Firefox requires setData
    e.dataTransfer.setData("text/plain", String(index));
  }

  function handleDragOver(e: React.DragEvent, index: number) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (index !== dragOverIndex) setDragOverIndex(index);
  }

  function handleDrop(e: React.DragEvent, index: number) {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) {
      setDragIndex(null);
      setDragOverIndex(null);
      return;
    }
    const newStats = [...stats];
    const [removed] = newStats.splice(dragIndex, 1);
    newStats.splice(index, 0, removed);
    setStats(newStats);
    setDragIndex(null);
    setDragOverIndex(null);
  }

  function handleDragEnd() {
    setDragIndex(null);
    setDragOverIndex(null);
  }

  function toggleStat(key: string) {
    if (layout === "compact") {
      setStats((prev) => {
        const target = prev.find((s) => s.key === key);
        if (!target) return prev;
        if (target.enabled) {
          return prev.map((s) => (s.key === key ? { ...s, enabled: false } : s));
        }
        const enabledCount = prev.filter((s) => s.enabled).length;
        if (enabledCount >= gridCols) return prev;
        return prev.map((s) => (s.key === key ? { ...s, enabled: true } : s));
      });
    } else {
      setStats((prev) =>
        prev.map((s) => (s.key === key ? { ...s, enabled: !s.enabled } : s)),
      );
    }
  }

  function handleSetGridCols(n: 3 | 4 | 6) {
    setGridCols(n);
    setStats((prev) => {
      const result = [...prev];
      let enabledCount = result.filter((s) => s.enabled).length;
      if (enabledCount > n) {
        let toDisable = enabledCount - n;
        for (let i = result.length - 1; i >= 0 && toDisable > 0; i--) {
          if (result[i].enabled) {
            result[i] = { ...result[i], enabled: false };
            toDisable--;
          }
        }
      } else if (enabledCount < n) {
        let toEnable = n - enabledCount;
        for (let i = 0; i < result.length && toEnable > 0; i++) {
          if (!result[i].enabled) {
            result[i] = { ...result[i], enabled: true };
            toEnable--;
          }
        }
      }
      return result;
    });
  }

  function handleSetLayout(mode: LayoutMode) {
    setLayout(mode);
    if (mode === "compact") {
      setStats((prev) => {
        const result = [...prev];
        let enabledCount = result.filter((s) => s.enabled).length;
        if (enabledCount > gridCols) {
          let toDisable = enabledCount - gridCols;
          for (let i = result.length - 1; i >= 0 && toDisable > 0; i--) {
            if (result[i].enabled) {
              result[i] = { ...result[i], enabled: false };
              toDisable--;
            }
          }
        } else if (enabledCount < gridCols) {
          let toEnable = gridCols - enabledCount;
          for (let i = 0; i < result.length && toEnable > 0; i++) {
            if (!result[i].enabled) {
              result[i] = { ...result[i], enabled: true };
              toEnable--;
            }
          }
        }
        return result;
      });
    }
  }

  function moveStatUp(index: number) {
    if (index === 0) return;
    const newStats = [...stats];
    [newStats[index - 1], newStats[index]] = [newStats[index], newStats[index - 1]];
    setStats(newStats);
  }

  function moveStatDown(index: number) {
    if (index === stats.length - 1) return;
    const newStats = [...stats];
    [newStats[index], newStats[index + 1]] = [newStats[index + 1], newStats[index]];
    setStats(newStats);
  }

  // ─── Start from scratch ────────────────────────────────────────────────────

  function resetToScratch() {
    setUsername("");
    setStats(ALL_STATS.map((s) => ({ ...s, enabled: false })));
    setTheme("default");
    setShowLanguages(false);
    setLayout("list");
    setGridCols(6);
    setHideBorder(false);
    setHideTitle(false);
    setShowRing(true);
    setShowIcons(true);
    setCustomTitle("");
    setBorderRadius("4.5");
    setShowEmoji(false);
    setEmbedWidth(495);
    setMaxLangs(8);
    setCardImgUrl("");
    setLangsImgUrl("");
  }

  // ─── Import ────────────────────────────────────────────────────────────────

  function handleImport() {
    const url = extractCardUrl(importInput);
    if (!url) {
      setImportStatus({ ok: false, msg: "Couldn't find a card URL in that embed code." });
      return;
    }
    try {
      const p = new URL(url).searchParams;
      const u = p.get("username");
      if (!u) {
        setImportStatus({ ok: false, msg: "No username found in the card URL." });
        return;
      }
      setUsername(u);
      setTheme(p.get("theme") ?? "default");
      setShowIcons(p.get("show_icons") !== "false");
      setHideBorder(p.get("hide_border") === "true");
      setHideTitle(p.get("hide_title") === "true");
      setShowRing(p.get("show_ring") !== "false");
      const hideStr = p.get("hide");
      const hiddenKeys = hideStr ? hideStr.split(",").map((s) => s.trim()).filter(Boolean) : [];
      const orderStr = p.get("order");
      const orderKeys = orderStr ? orderStr.split(",").map((s) => s.trim()).filter(Boolean) : null;
      setCustomTitle(p.get("custom_title") ?? "");
      setBorderRadius(p.get("border_radius") ?? "4.5");
      setLayout(p.get("size") === "compact" ? "compact" : "list");
      const cc = parseInt(p.get("compact_count") ?? "");
      setGridCols(([3, 4, 6].includes(cc) ? cc : 6) as 3 | 4 | 6);
      setShowEmoji(p.get("show_emoji") === "true");

      // Reconstruct stats from order + hide
      let newStats = ALL_STATS.map((s) => ({ ...s, enabled: !hiddenKeys.includes(s.key) }));
      if (orderKeys && orderKeys.length > 0) {
        const orderedEnabled = orderKeys
          .map((k) => newStats.find((s) => s.key === k))
          .filter(Boolean) as StatConfig[];
        const remaining = newStats.filter(
          (s) => !orderKeys.includes(s.key),
        );
        newStats = [...orderedEnabled, ...remaining];
      }
      setStats(newStats);

      setImportStatus({ ok: true, msg: `Loaded settings for @${u}` });
      setImportInput("");
      setTimeout(() => {
        setImportOpen(false);
        setImportStatus(null);
      }, 1800);
    } catch {
      setImportStatus({ ok: false, msg: "Invalid URL in embed code." });
    }
  }

  // ─── Copy ──────────────────────────────────────────────────────────────────

  async function copyToClipboard(text: string, field: string) {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  }

  // ─── Embed code generation ─────────────────────────────────────────────────

  const embedCardUrl = buildCardUrl(origin);
  const embedLangsUrl = showLanguages ? buildLangsUrl(origin) : "";
  const repoUrl = "https://github.com/rowkav09/GitHub-profile-stats";
  const widthAttr = embedWidth !== 495 ? ` width="${embedWidth}"` : "";

  const markdownCard = embedCardUrl
    ? `[![GitHub Stats](${embedCardUrl})](${repoUrl})`
    : "";
  const markdownLangs = embedLangsUrl
    ? `[![Top Languages](${embedLangsUrl})](${repoUrl})`
    : "";
  const fullMarkdown = [markdownCard, markdownLangs].filter(Boolean).join("\n\n");

  const htmlCard = embedCardUrl
    ? `<a href="${repoUrl}"><img src="${embedCardUrl}" alt="GitHub Stats"${widthAttr} /></a>`
    : "";
  const htmlLangs = embedLangsUrl
    ? `<a href="${repoUrl}"><img src="${embedLangsUrl}" alt="Top Languages"${widthAttr} /></a>`
    : "";
  const fullHtml = [htmlCard, htmlLangs].filter(Boolean).join("\n");

  // ─── Render ────────────────────────────────────────────────────────────────

  const compactLimitReached =
    layout === "compact" && stats.filter((s) => s.enabled).length >= gridCols;

  return (
    <div className="space-y-0">
      {/* ─── Tab switcher ─── */}
      <div className="flex gap-1 p-1 bg-[#161b22] rounded-xl border border-[#30363d] w-fit mb-6">
        {(["visual", "classic"] as EditorTab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === tab
                ? "bg-[#0d1117] text-white shadow-sm"
                : "text-[#8b949e] hover:text-[#c9d1d9]"
            }`}
          >
            {tab === "visual" ? "✦ Visual Builder" : "⚙ Classic Editor"}
          </button>
        ))}
      </div>

      {/* ─── Classic Editor (existing CardPreview) ─── */}
      {activeTab === "classic" && <CardPreview />}

      {/* ─── Visual Builder ─── */}
      {activeTab === "visual" && (
        <div className="space-y-6">
          {/* Top action bar */}
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex-1 min-w-48">
              <label className="block text-xs font-medium text-[#8b949e] mb-1.5 uppercase tracking-wider">
                GitHub Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="octocat"
                className="input-field w-full"
              />
            </div>
            <div className="min-w-44">
              <label className="block text-xs font-medium text-[#8b949e] mb-1.5 uppercase tracking-wider">
                Theme
              </label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="input-field w-full"
              >
                {THEMES.map((t) => (
                  <option key={t.key} value={t.key}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setImportOpen((o) => !o);
                  setImportStatus(null);
                }}
                className="flex items-center gap-1.5 rounded-lg border border-[#30363d] px-3.5 py-2 text-sm text-[#c9d1d9] hover:border-[#58a6ff] hover:text-white transition-all duration-200"
              >
                <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M2.75 14A1.75 1.75 0 0 1 1 12.25v-2.5a.75.75 0 0 1 1.5 0v2.5c0 .138.112.25.25.25h10.5a.25.25 0 0 0 .25-.25v-2.5a.75.75 0 0 1 1.5 0v2.5A1.75 1.75 0 0 1 13.25 14Z" />
                  <path d="M7.25 7.689V2a.75.75 0 0 1 1.5 0v5.689l1.97-1.97a.749.749 0 1 1 1.06 1.06l-3.25 3.25a.749.749 0 0 1-1.06 0L4.22 6.779a.749.749 0 1 1 1.06-1.06l1.97 1.97z" />
                </svg>
                Import
              </button>
              <button
                onClick={resetToScratch}
                className="flex items-center gap-1.5 rounded-lg border border-[#30363d] px-3.5 py-2 text-sm text-[#8b949e] hover:border-[#f85149] hover:text-[#f85149] transition-all duration-200"
              >
                <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.749.749 0 0 1 1.042.018.749.749 0 0 1 .018 1.042L9.06 8l3.22 3.22a.749.749 0 0 1-.018 1.042.749.749 0 0 1-1.042.018L8 9.06l-3.22 3.22a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06z" />
                </svg>
                Start from Scratch
              </button>
            </div>
          </div>

          {/* Import panel */}
          {importOpen && (
            <div className="rounded-xl border border-[#30363d] bg-[#0d1117] p-4 space-y-3">
              <p className="text-xs text-[#8b949e]">
                Paste your existing Markdown, HTML, or raw card URL — all settings will load into the builder.
              </p>
              <textarea
                value={importInput}
                onChange={(e) => {
                  setImportInput(e.target.value);
                  setImportStatus(null);
                }}
                placeholder={`[![GitHub Stats](https://ghstats.dev/api/card?username=octocat&theme=tokyonight)](https://github.com/...)`}
                rows={3}
                className="w-full rounded-lg border border-[#30363d] bg-[#161b22] px-4 py-2.5 text-xs text-[#c9d1d9] placeholder-[#484f58] font-mono resize-none focus:border-[#58a6ff] focus:outline-none focus:ring-1 focus:ring-[#58a6ff]/40 transition-all duration-200"
              />
              <div className="flex items-center gap-3">
                <button
                  onClick={handleImport}
                  disabled={!importInput.trim()}
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-[#58a6ff] text-[#0d1117] hover:bg-[#79c0ff] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
                >
                  Load into builder
                </button>
                {importStatus && (
                  <span
                    className={`text-xs font-medium ${
                      importStatus.ok ? "text-[#3fb950]" : "text-[#f85149]"
                    }`}
                  >
                    {importStatus.msg}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* ─── Main 3-column layout ─── */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr_260px]">
            {/* ── Left: Stats list ── */}
            <div className="space-y-4">
              <div className="rounded-xl border border-[#30363d] bg-[#0d1117] overflow-hidden">
                <div className="px-4 py-3 bg-[#161b22] border-b border-[#30363d] flex items-center justify-between">
                  <SectionHeader>Stats</SectionHeader>
                  <div className="flex gap-1">
                    <button
                    onClick={() => {
                      if (layout === "compact") {
                        setStats((prev) => {
                          let count = 0;
                          return prev.map((s) => ({ ...s, enabled: count++ < gridCols }));
                        });
                      } else {
                        setStats((prev) => prev.map((s) => ({ ...s, enabled: true })));
                      }
                    }}
                    className="text-xs text-[#58a6ff] hover:text-[#79c0ff] transition-colors"
                  >
                    All
                  </button>
                    <span className="text-[#30363d]">/</span>
                    <button
                      onClick={() => setStats((prev) => prev.map((s) => ({ ...s, enabled: false })))}
                      className="text-xs text-[#8b949e] hover:text-[#c9d1d9] transition-colors"
                    >
                      None
                    </button>
                  </div>
                </div>
                <div className="p-2 space-y-0.5">
                  <p className="px-2 pb-2 text-xs text-[#484f58]">
                    Drag rows to reorder · toggle to show/hide
                  </p>
                  {stats.map((stat, i) => (
                    <div
                      key={stat.key}
                      draggable
                      onDragStart={(e) => handleDragStart(e, i)}
                      onDragOver={(e) => handleDragOver(e, i)}
                      onDrop={(e) => handleDrop(e, i)}
                      onDragEnd={handleDragEnd}
                      ref={dragIndex === i ? dragNode : undefined}
                      className={`flex items-center gap-2 rounded-lg px-2 py-1.5 cursor-grab active:cursor-grabbing transition-all duration-150 select-none ${
                        dragIndex === i
                          ? "opacity-40 scale-95"
                          : dragOverIndex === i
                          ? "border-t-2 border-[#58a6ff]"
                          : "hover:bg-[#161b22]"
                      } ${!stat.enabled ? "opacity-50" : ""} ${compactLimitReached && !stat.enabled ? "opacity-30" : ""}`}
                    >
                      {/* Drag handle */}
                      <svg
                        width="10"
                        height="14"
                        viewBox="0 0 10 14"
                        fill="currentColor"
                        className="text-[#484f58] flex-shrink-0"
                      >
                        <circle cx="2" cy="2" r="1.2" />
                        <circle cx="8" cy="2" r="1.2" />
                        <circle cx="2" cy="7" r="1.2" />
                        <circle cx="8" cy="7" r="1.2" />
                        <circle cx="2" cy="12" r="1.2" />
                        <circle cx="8" cy="12" r="1.2" />
                      </svg>
                      {/* Checkbox toggle */}
                      <input
                        type="checkbox"
                        checked={stat.enabled}
                        onChange={() => toggleStat(stat.key)}
                        disabled={compactLimitReached && !stat.enabled}
                        className={`accent-[#238636] ${compactLimitReached && !stat.enabled ? "cursor-not-allowed opacity-40" : "cursor-pointer"}`}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <span className="text-xs text-[#c9d1d9] flex-1 truncate">
                        {stat.label}
                      </span>
                      {/* Up/down buttons */}
                      <div className="flex flex-col gap-0 opacity-0 group-hover:opacity-100 hover:opacity-100">
                        <button
                          onClick={() => moveStatUp(i)}
                          disabled={i === 0}
                          className="text-[#484f58] hover:text-[#8b949e] disabled:opacity-20 transition-colors leading-none"
                          title="Move up"
                        >
                          ▲
                        </button>
                        <button
                          onClick={() => moveStatDown(i)}
                          disabled={i === stats.length - 1}
                          className="text-[#484f58] hover:text-[#8b949e] disabled:opacity-20 transition-colors leading-none"
                          title="Move down"
                        >
                          ▼
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Language chart toggle */}
              <div className="rounded-xl border border-[#30363d] bg-[#0d1117] overflow-hidden">
                <div className="px-4 py-3 bg-[#161b22] border-b border-[#30363d]">
                  <SectionHeader>Language Chart</SectionHeader>
                </div>
                <div className="p-4 space-y-3">
                  <Toggle
                    checked={showLanguages}
                    onChange={setShowLanguages}
                    label="Show language breakdown"
                  />
                  {showLanguages && (
                    <div>
                      <label className="text-xs text-[#8b949e] block mb-1.5">
                        Max languages:{" "}
                        <span className="text-[#58a6ff] font-semibold">{maxLangs}</span>
                      </label>
                      <input
                        type="range"
                        min="3"
                        max="12"
                        value={maxLangs}
                        onChange={(e) => setMaxLangs(parseInt(e.target.value))}
                        className="w-full accent-[#58a6ff]"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ── Center: Canvas preview ── */}
            <div className="flex flex-col items-center gap-4">
              <div className="w-full rounded-xl border border-[#30363d] bg-[#010409] p-4 flex flex-col items-center gap-4 min-h-64">
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="text-xs text-[#484f58] uppercase tracking-wider">
                    Live Preview
                  </span>
                  {cardLoading && cardImgUrl && (
                    <span className="text-xs text-[#58a6ff] animate-pulse">Updating…</span>
                  )}
                </div>
                {cardImgUrl ? (
                  <div className="w-full flex flex-col items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      key={cardImgUrl}
                      src={cardImgUrl}
                      alt="Card preview"
                      style={{ maxWidth: Math.min(embedWidth, 495) }}
                      className="rounded-lg w-full transition-opacity duration-300"
                      onLoad={() => setCardLoading(false)}
                      onError={() => setCardLoading(false)}
                    />
                    {langsImgUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        key={langsImgUrl}
                        src={langsImgUrl}
                        alt="Languages"
                        style={{ maxWidth: Math.min(embedWidth, 495) }}
                        className="rounded-lg transition-opacity duration-300"
                        onLoad={() => setCardLoading(false)}
                      />
                    )}
                  </div>
                ) : (
                  <div className="flex-1 w-full flex flex-col items-center justify-center gap-3 py-16 text-center">
                    <svg
                      width="40"
                      height="40"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      className="text-[#30363d]"
                    >
                      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                    </svg>
                    <p className="text-sm text-[#484f58]">
                      Enter a username above to see a live preview
                    </p>
                  </div>
                )}
              </div>

              {/* Grid snap visualizer (compact mode) */}
              {layout === "compact" && (
                <div className="w-full rounded-xl border border-[#30363d] bg-[#0d1117] p-4">
                  <SectionHeader>Grid Layout ({gridCols} columns)</SectionHeader>
                  <div
                    className="grid gap-1.5 mt-2"
                    style={{ gridTemplateColumns: `repeat(${gridCols === 4 ? 2 : 3}, 1fr)` }}
                  >
                    {stats
                      .filter((s) => s.enabled)
                      .slice(0, gridCols)
                      .map((stat) => (
                        <div
                          key={stat.key}
                          className="rounded-lg border border-[#30363d] bg-[#161b22] px-3 py-2 text-center"
                        >
                          <div className="text-xs text-[#8b949e] truncate">{stat.label}</div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>

            {/* ── Right: Settings panel ── */}
            <div className="space-y-4">
              <div className="rounded-xl border border-[#30363d] bg-[#0d1117] overflow-hidden">
                <div className="px-4 py-3 bg-[#161b22] border-b border-[#30363d]">
                  <SectionHeader>Layout</SectionHeader>
                </div>
                <div className="p-4 space-y-3">
                  <div className="space-y-1.5">
                    {(["list", "compact"] as LayoutMode[]).map((mode) => (
                      <label
                        key={mode}
                        className="flex items-center gap-2.5 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="layout"
                          value={mode}
                          checked={layout === mode}
                          onChange={() => handleSetLayout(mode)}
                          className="accent-[#238636]"
                        />
                        <span className="text-sm text-[#c9d1d9]">
                          {mode === "list" ? "List (default)" : "Compact Grid"}
                        </span>
                      </label>
                    ))}
                  </div>

                  {layout === "compact" && (
                    <div className="pt-2 border-t border-[#21262d]">
                      <p className="text-xs text-[#8b949e] mb-2">Stat slots</p>
                      <div className="flex gap-1.5">
                        {([3, 4, 6] as const).map((n) => (
                          <button
                            key={n}
                            onClick={() => handleSetGridCols(n)}
                            className={`flex-1 rounded-lg py-1.5 text-sm font-semibold transition-all duration-150 ${
                              gridCols === n
                                ? "bg-[#238636] text-white"
                                : "bg-[#21262d] text-[#8b949e] hover:text-white border border-[#30363d]"
                            }`}
                          >
                            {n}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-xl border border-[#30363d] bg-[#0d1117] overflow-hidden">
                <div className="px-4 py-3 bg-[#161b22] border-b border-[#30363d]">
                  <SectionHeader>Embed Width</SectionHeader>
                </div>
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#8b949e]">Image width attribute</span>
                    <span className="text-xs font-semibold text-[#58a6ff]">{embedWidth}px</span>
                  </div>
                  <input
                    type="range"
                    min="200"
                    max="600"
                    step="5"
                    value={embedWidth}
                    onChange={(e) => setEmbedWidth(parseInt(e.target.value))}
                    className="w-full accent-[#58a6ff]"
                  />
                  <p className="text-xs text-[#484f58]">
                    Sets the <code className="text-[#79c0ff]">width</code> attribute on the embed image tag.
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-[#30363d] bg-[#0d1117] overflow-hidden">
                <div className="px-4 py-3 bg-[#161b22] border-b border-[#30363d]">
                  <SectionHeader>Appearance</SectionHeader>
                </div>
                <div className="p-4 space-y-3">
                  <Toggle checked={!hideBorder} onChange={(v) => setHideBorder(!v)} label="Show border" />
                  <Toggle checked={!hideTitle} onChange={(v) => setHideTitle(!v)} label="Show title" />
                  <Toggle checked={showRing && layout !== "compact"} onChange={setShowRing} label="Activity ring" />
                  {layout !== "compact" && (
                    <Toggle checked={showIcons} onChange={setShowIcons} label="Icons" />
                  )}
                  {layout === "compact" && (
                    <Toggle checked={showEmoji} onChange={setShowEmoji} label="Emoji icons" />
                  )}
                  <div className="pt-1 border-t border-[#21262d]">
                    <label className="text-xs text-[#8b949e] block mb-1.5">
                      Corner radius: <span className="text-[#58a6ff] font-semibold">{borderRadius}</span>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="50"
                      step="0.5"
                      value={borderRadius}
                      onChange={(e) => setBorderRadius(e.target.value)}
                      className="w-full accent-[#58a6ff]"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-[#8b949e] block mb-1.5">Custom title</label>
                    <input
                      type="text"
                      value={customTitle}
                      onChange={(e) => setCustomTitle(e.target.value)}
                      placeholder="Leave blank for default"
                      className="input-field w-full text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ─── Embed code panel ─── */}
          <div className="rounded-xl border border-[#30363d] bg-[#0d1117] overflow-hidden">
            <div className="px-5 py-3.5 bg-[#161b22] border-b border-[#30363d] flex items-center justify-between">
              <SectionHeader>Embed Code</SectionHeader>
              {!embedCardUrl && (
                <span className="text-xs text-[#484f58]">Enter a username to generate your embed</span>
              )}
            </div>
            {embedCardUrl ? (
              <div className="p-5 space-y-4">
                {/* Card URL row */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-[#8b949e]">
                      Stats Card
                      {embedWidth !== 495 && (
                        <span className="ml-2 text-[#484f58]">(img width={embedWidth}px)</span>
                      )}
                    </span>
                    <div className="flex gap-2">
                      <CopyButton
                        text={markdownCard}
                        label="Markdown"
                        fieldKey="md-card"
                        copiedField={copiedField}
                        onCopy={copyToClipboard}
                      />
                      <CopyButton
                        text={htmlCard}
                        label="HTML"
                        fieldKey="html-card"
                        copiedField={copiedField}
                        onCopy={copyToClipboard}
                      />
                    </div>
                  </div>
                  <pre className="overflow-x-auto rounded-lg border border-[#30363d] bg-[#161b22] px-4 py-3 text-xs text-[#c9d1d9] font-mono whitespace-pre-wrap break-all">
                    {markdownCard}
                  </pre>
                </div>

                {/* Language card URL row */}
                {embedLangsUrl && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-[#8b949e]">Languages Chart</span>
                      <div className="flex gap-2">
                        <CopyButton
                          text={markdownLangs}
                          label="Markdown"
                          fieldKey="md-langs"
                          copiedField={copiedField}
                          onCopy={copyToClipboard}
                        />
                        <CopyButton
                          text={htmlLangs}
                          label="HTML"
                          fieldKey="html-langs"
                          copiedField={copiedField}
                          onCopy={copyToClipboard}
                        />
                      </div>
                    </div>
                    <pre className="overflow-x-auto rounded-lg border border-[#30363d] bg-[#161b22] px-4 py-3 text-xs text-[#c9d1d9] font-mono whitespace-pre-wrap break-all">
                      {markdownLangs}
                    </pre>
                  </div>
                )}

                {/* Combined copy */}
                <div className="pt-2 border-t border-[#21262d] flex items-center justify-between">
                  <span className="text-xs text-[#484f58]">
                    {embedLangsUrl ? "Copy both embeds together:" : "Or copy the raw URL:"}
                  </span>
                  <div className="flex gap-2">
                    {embedLangsUrl ? (
                      <CopyButton
                        text={fullMarkdown}
                        label="Copy All (Markdown)"
                        fieldKey="all-md"
                        copiedField={copiedField}
                        onCopy={copyToClipboard}
                      />
                    ) : (
                      <CopyButton
                        text={embedCardUrl}
                        label="Copy Raw URL"
                        fieldKey="raw-url"
                        copiedField={copiedField}
                        onCopy={copyToClipboard}
                      />
                    )}
                    <CopyButton
                      text={fullHtml}
                      label="Copy All (HTML)"
                      fieldKey="all-html"
                      copiedField={copiedField}
                      onCopy={copyToClipboard}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="px-5 py-8 text-center text-sm text-[#484f58]">
                Your embed code will appear here once you enter a username.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
