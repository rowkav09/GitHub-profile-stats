"use client";

import { useState } from "react";

const REPO_URL = "https://github.com/rowkavdev/GitHub-profile-stats";

export default function LinkedEmbed({ label, imageUrl }: { label: string; imageUrl: string }) {
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "failed">("idle");
  const absolute = imageUrl.startsWith("http") ? imageUrl : `https://ghstats.dev${imageUrl}`;
  const markdown = `[![${label}](${absolute})](${REPO_URL})`;
  return (
    <div className="mt-5 rounded-lg border border-[#30363d] bg-[#0d1117] p-4">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#8b949e]">Linked markdown embed</span>
        <button type="button" className="copy-btn" onClick={() => navigator.clipboard.writeText(markdown).then(() => { setCopyStatus("copied"); window.setTimeout(() => setCopyStatus("idle"), 1400); }).catch(() => { setCopyStatus("failed"); window.setTimeout(() => setCopyStatus("idle"), 1800); })}>{copyStatus === "copied" ? "Copied" : copyStatus === "failed" ? "Copy failed" : "Copy"}</button>
      </div>
      <pre className="mt-3 overflow-x-auto whitespace-pre-wrap break-all text-xs leading-6 text-[#79c0ff]">{markdown}</pre>
    </div>
  );
}
