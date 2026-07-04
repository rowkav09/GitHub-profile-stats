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

All themes live in **`src/lib/themes.ts`** as entries in the `themes` object, and in **`src/components/CardPreview.tsx`** as entries in the `THEMES` constant (used by the visual editor).

**1. Add the theme to `src/lib/themes.ts`:**

```ts
yourtheme: {
  name: "Your Theme",   // display name shown in the editor
  bg: "#000000",        // card background
  text: "#ffffff",      // stat labels & values
  title: "#ff6b6b",     // title & ring colour
  icon: "#ffa07a",      // stat icon colour
  border: "#333333",    // border & ring track colour
},
```

**2. Add the same theme to `src/components/CardPreview.tsx`** (the `THEMES` constant at the top of the file) so it appears in the visual editor:

```ts
yourtheme: {
  name: "Your Theme",
  bg: "#000000", title: "#ff6b6b", icon: "#ffa07a",
  text: "#ffffff", border: "#333333",
},
```

**3. Add it to `src/components/HeroCard.tsx`** (`HERO_THEMES` array) if you'd like it to appear in the homepage demo carousel.

**4. Add it to `src/components/VisualBuilder.tsx`** (`THEMES` constant) so it appears in the on-page visual editor dropdown.

**5. Add it to the themes table** in `README.md`.

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

**1. Define the style config — `src/app/api/badge/badge-svg.ts`**

Add a new entry to the `STYLE_CONFIGS` object with the shape configuration:

```ts
mystyle: {
  height: 20,        // badge height in px
  charWidth: 6.6,    // estimated width per character
  pad: 10,           // horizontal padding
  rx: 3,             // corner radius (0 for sharp corners)
  fontSize: 11,      // font size
  fontWeight: 400,   // font weight
  letterSpacing: 0,  // letter spacing
  textY: 14,         // vertical text position
  uppercase: false,  // uppercase all text
  transparent: false, // transparent background
  gradient: "shields", // "shields" | "plastic" | "none"
  clipId: "r_my",    // unique clip-path ID
  gradientId: "s_my", // unique gradient ID
},
```

**2. Add preview data — `src/app/page.tsx`**

Add an entry to the `BADGE_STYLES` array at the top of the file so it appears in the Badge Styles section on the landing page:

```ts
{ key: "mystyle", label: "My Style", desc: "Description shown in the docs table." },
```

**3. Add picker option — `src/components/CardPreview.tsx`**

Add an entry to the `BADGE_STYLES` array so it appears in the visual editor badge picker:

```ts
{ key: "mystyle", label: "My Style" },
```

**4. Document it** — add a row to the badge styles table in `README.md`.

---

## Other Ways to Contribute

| Area | Where to look |
|---|---|
| Bug fixes | [Open an issue](https://github.com/rowkav09/GitHub-profile-stats/issues) first so we can confirm it, then submit a PR |
| New card layouts | `src/lib/svg.ts` — add a new render function and wire it up via `options.size` |
| Badge styles | `src/app/api/badge/badge-svg.ts` — add a config entry and update the page picker |
| Visual editor improvements | `src/components/CardPreview.tsx` and `src/components/VisualBuilder.tsx` |
| Homepage / hero section | `src/components/HeroCard.tsx` and `src/app/page.tsx` |
| API / caching | `src/app/api/` |
| Docs | Edit `README.md` directly |
