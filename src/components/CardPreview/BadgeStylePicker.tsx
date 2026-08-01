import { BADGE_STYLES } from "@/lib/svg/badge/configs/registry";
import { renderBadge } from "@/lib/svg/badge";

export default function BadgeStylePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (s: string) => void;
}) {
  return (
    <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2">
      {BADGE_STYLES.map((opt) => {
        const isActive = value === opt.key;
        const svg = renderBadge("STYLE", "preview", "58a6ff", opt.key);
        return (
          <button
            key={opt.key}
            type="button"
            onClick={() => onChange(opt.key)}
            aria-pressed={isActive}
            className={`group flex flex-col items-center gap-1.5 rounded-lg border p-2.5 transition-all duration-150 ${
              isActive
                ? "border-[#58a6ff] bg-[#58a6ff]/10 shadow-[0_0_0_1px_rgba(88,166,255,0.25)]"
                : "border-[#30363d] bg-[#161b22] hover:border-[#484f58]"
            }`}
          >
            <span
              aria-hidden
              className="flex h-7 items-center"
              dangerouslySetInnerHTML={{ __html: svg }}
            />
            <span
              className={`text-[10px] font-semibold uppercase tracking-wider transition-colors ${
                isActive
                  ? "text-[#58a6ff]"
                  : "text-[#8b949e] group-hover:text-[#c9d1d9]"
              }`}
            >
              {opt.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
