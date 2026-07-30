# Contributing to GitHub Profile Stats

Contributions of all kinds are welcome — whether you want to add a new colour scheme, expose an extra stat, fix a bug, or improve the docs. Here's how to get started and where each type of change lives.

## Getting Started

```bash
git clone https://github.com/rowkav09/GitHub-profile-stats.git
cd GitHub-profile-stats
npm install
cp .env.example .env.local   # add your GITHUB_TOKEN, GH_TOKEN, or GITHUB_ACCESS_TOKEN
npm run dev                  # http://localhost:3000
```

1. Fork the repo
2. Create a feature branch: `git checkout -b feat/my-feature`
3. Make your changes (see guides below)
4. Open a PR against `main` with a short description of what you changed and why

For anything larger (new layouts, breaking API changes) it's worth [opening an issue](https://github.com/rowkav09/GitHub-profile-stats/issues) first to discuss the approach before writing code.

---

## Adding a Colour Scheme

All themes live in a single source of truth: **`THEME_DEFINITIONS`** in **`src/lib/themes.ts`**. Everything else (`themes`, `THEMES`, `HERO_THEMES`) is derived from it automatically, so adding a theme is one edit in one file.

**1. Add the theme to `THEME_DEFINITIONS` in `src/lib/themes.ts`:**

```ts
{
  key: "yourtheme",
  showIn: ["builder", "hero"],  // Appeares in both CardPreview and HeroCard
  name: "Your Theme",   // display name shown in the editor
  bg: "#000000",        // card background
  text: "#ffffff",      // stat labels & values
  title: "#ff6b6b",     // title & ring colour
  icon: "#ffa07a",      // stat icon colour
  border: "#333333",    // border & ring track colour
},
```

That's it — no other changes needed.

---

## Adding a New Stat

Stats are pulled from the GitHub GraphQL API, stored in `GitHubStats`, then rendered in the SVG card.

**1. Fetch the data — `src/lib/github.ts`**

Add any new fields to the GraphQL `QUERY` string, then populate them in the `GitHubStats` object returned at the bottom of `fetchGitHubStats`.

**2. Declare the type — `src/lib/types.ts`**

Add the new field to the `GitHubStats` interface and, if it should be hideable, add a key to the `StatKey` union.

**3. Render it — `src/lib/svg.ts`**

In `getVisibleStats`, add a new entry to the `all` array. Pick an existing Octicon path from the `ICONS` map (or add a new one at the top of the file):

```ts
{
  key: "mystat",
  label: "My Stat (Long Label)",  // shown in standard layout
  short: "My Stat",               // shown in compact layout
  value: formatNumber(stats.myField),
  icon: "star",                   // key from the ICONS map
},
```

**4. Make it hideable — `src/components/CardPreview.tsx`**

Add the key and a short display name to the `STAT_OPTIONS` array so it appears as a toggleable pill in the visual editor:

```ts
{ key: "mystat", label: "My Stat" },
```

**5. Document it** — add the key and description to the "Stats You Can Hide" table in `README.md`.

---

## Adding a Badge Style

Badge styles control the visual appearance of `/api/mini`, `/api/badge`, and `/api/visits` output. Five styles are supported: `flat`, `flat-square`, `for-the-badge`, `plastic`, and `minimal`.

**1. Add your style to STYLE_DEFS - `src/lib/svg/badge/configs/styleConfig.ts`**

```ts
{
  key: "mystyle",
  label: "My Style",
  desc: "Description shown in the docs table.",
  overrides: {
    rx: 0,               // only include fields that differ from BASE_CONFIG
    gradient: "none",
    clipId: "r_my",
    gradientId: "s_my",
  },
},
```

**2. Update the BadgeStyle union type - `src/lib/svg/badge/types/index.ts`**

```ts
export type BadgeStyle =
  | "flat"
  | "flat-square"
  | "for-the-badge"
  | "plastic"
  | "minimal"
  | "mystyle"; // Your new style key should be added here.
```

## **3. Document it** — add a row to the badge styles table in `README.md`.

## Adding a New Language Layout Style

To add a new language chart layout style:

**1. Add the layout style to `src/lib/types.ts`**

- Add the new style entry to the `LANG_CHART_LAYOUTS` constant. This acts as the **single source of truth** for all supported language chart layouts.

```ts
export const LANG_CHART_LAYOUTS = [
  "donut",
  "donut_vertical",
  "compact",
  "bar",
  "stacked",
  "horizontal_list",
  "vertical_list",
  "grid",
  "pie_chart", // Newly added style
] as const;
```

**2. Implement the renderer in `src/lib/svg.ts`**

- Add the renderer function for the new layout.

```ts
function renderPieLanguageChart() {
  // your Renderer implementation
}
```

**3. Register the new layout**

- Add the layout handler inside `renderLanguageChart()`.

```ts
export function renderLanguageChart() {
  // Existing code

  if (options.layout === "pie_chart") {
    return renderPieLanguageChart();
  }
}
```

## Other Ways to Contribute

| Area                       | Where to look                                                                                                         |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Bug fixes                  | [Open an issue](https://github.com/rowkav09/GitHub-profile-stats/issues) first so we can confirm it, then submit a PR |
| New card layouts           | `src/lib/svg.ts` — add a new render function and wire it up via `options.size`                                        |
| Badge styles               | `src/app/api/badge/badge-svg.ts` — add a config entry and update the page picker                                      |
| Visual editor improvements | `src/components/CardPreview.tsx` and `src/components/VisualBuilder.tsx`                                               |
| Homepage / hero section    | `src/components/HeroCard.tsx` and `src/app/page.tsx`                                                                  |
| API / caching              | `src/app/api/`                                                                                                        |
| Docs                       | Edit `README.md` directly                                                                                             |
