![Users](https://ghstats.dev/api/badge)
![Repo Views](https://ghstats.dev/api/visits?username=rowkav09&repo=GitHub-profile-stats)

# GitHub Profile Stats

> 🚀 Free, open-source GitHub stats card generator — embed beautiful, real-time stats in your profile README with a single line of Markdown. No tokens needed.

Beautiful, dynamically generated stats cards for your GitHub profile README. Just paste one line and your stats are always up to date — no setup, no tokens, no deployment needed.

**[ghstats.dev](https://ghstats.dev)**

[![Example Card](https://ghstats.dev/api/card?username=octocat&theme=tokyonight)](https://github.com/rowkav09/GitHub-profile-stats)

## Why GitHub Profile Stats?

- ✅ **Free & open source** — no cost, no hidden limits, MIT licensed
- 🔑 **No GitHub token required** — just your username
- 📊 **13 live stats** — stars, commits, PRs, issues, streak, weekly activity, and more
- 🎨 **12 built-in themes** — Default, Tokyo Night, Dracula, Nord, and more
- 🖼️ **SVG output** — crisp at any size, works everywhere Markdown or HTML images are supported
- ⚡ **Edge-cached** — fast responses refreshed every 30 minutes
- 🛠️ **Fully customisable** — override colours, hide stats, change border radius
- 🌍 **Works anywhere** — GitHub, GitLab, Notion, any Markdown-supported platform

## How to Use

### 1. Create your profile README (if you don't have one)

GitHub shows a special README on your profile page when you create a repo that matches your username:

1. Go to [github.com/new](https://github.com/new)
2. Set the repository name to **your exact username** (e.g. `rowkav09`)
3. Make it **public**
4. Check **"Add a README file"**
5. Click **Create repository**

You'll now see the contents of that `README.md` on your profile page.

### 2. Add your stats card

Edit the `README.md` in your new profile repo and add:

```markdown
![GitHub Stats](https://ghstats.dev/api/card?username=YOUR_USERNAME)
```

Replace `YOUR_USERNAME` with your GitHub username. That's it — your card will always show your latest stats.

### Customise with the Visual Builder

Visit **[ghstats.dev/builder](https://ghstats.dev/builder)** to build your card without touching a URL.

- **Drag & drop** to reorder stats
- **Toggle** each stat on/off
- **Live preview** updates as you change settings
- **Import** an existing embed URL or Markdown snippet to load your current settings
- **Language chart** — add a top-languages bar below your stats card
- **Compact grid** — pick 3, 4, or 6 stat slots; the builder auto-selects the right stats
- Choose theme, border radius, custom title, and more
- Copy finished embed code as **Markdown** or **HTML** in one click

The Classic Editor (theme picker + URL preview) is still available on the same page via the tab switcher.

## Language Chart

Add a top-languages bar beneath your stats card. It shows a proportional colour bar and a per-language name + percentage breakdown.

[![Top Languages](https://ghstats.dev/api/langs?username=octocat&theme=tokyonight)](https://github.com/rowkav09/GitHub-profile-stats)

```markdown
![Top Languages](https://ghstats.dev/api/langs?username=YOUR_USERNAME)
```

**Language chart parameters:**

| Parameter | Type | Default | Description |
|---|---|---|---|
| `username` | string | **required** | GitHub username |
| `theme` | string | `default` | Theme preset (same options as the stats card) |
| `max_langs` | number | `8` | Max languages to show (`1`–`12`) |
| `hide_border` | boolean | `false` | Remove the card border |
| `hide_title` | boolean | `false` | Remove the "Top Languages" title |
| `custom_title` | string | — | Override the title text |
| `border_radius` | number | `4.5` | Corner radius (`0`–`50`) |

## Card Layouts

### Standard
The default layout — all stats in a single column with a circular activity ring on the right.

[![Standard Card](https://ghstats.dev/api/card?username=octocat&theme=dracula)](https://github.com/rowkav09/GitHub-profile-stats)

```markdown
![GitHub Stats](https://ghstats.dev/api/card?username=YOUR_USERNAME&theme=dracula)
```

### Compact — 3 stats
A tight single row of 3 key stats. The smallest card — great for a subtle badge-style addition.

[![Compact 3](https://ghstats.dev/api/card?username=octocat&theme=radical&size=compact&compact_count=3)](https://github.com/rowkav09/GitHub-profile-stats)

```markdown
![GitHub Stats](https://ghstats.dev/api/card?username=YOUR_USERNAME&theme=radical&size=compact&compact_count=3)
```

### Compact — 4 stats
A 2×2 grid — slightly more info while staying compact and square.

[![Compact 4](https://ghstats.dev/api/card?username=octocat&theme=catppuccin&size=compact&compact_count=4)](https://github.com/rowkav09/GitHub-profile-stats)

```markdown
![GitHub Stats](https://ghstats.dev/api/card?username=YOUR_USERNAME&theme=catppuccin&size=compact&compact_count=4)
```

### Compact — 6 stats
A 3×2 grid — the default compact layout, showing 6 stats at a glance. Roughly half the height of the standard card.

[![Compact 6](https://ghstats.dev/api/card?username=octocat&theme=tokyonight&size=compact&compact_count=6)](https://github.com/rowkav09/GitHub-profile-stats)

```markdown
![GitHub Stats](https://ghstats.dev/api/card?username=YOUR_USERNAME&theme=tokyonight&size=compact&compact_count=6)
```

### Compact with emojis
Swap SVG icons for emojis — works everywhere, including platforms that don't render SVG fonts cleanly.

[![Compact Emoji](https://ghstats.dev/api/card?username=octocat&theme=nord&size=compact&compact_count=6&show_emoji=true)](https://github.com/rowkav09/GitHub-profile-stats)

```markdown
![GitHub Stats](https://ghstats.dev/api/card?username=YOUR_USERNAME&theme=nord&size=compact&compact_count=6&show_emoji=true)
```

Use the `hide` parameter to choose which stats fill the grid slots, e.g. `&hide=trend,avg,active_day,repos,followers` to keep only stars, commits, PRs, issues, streak, and week.

## Examples

**Standard — Gruvbox theme:**

[![](https://ghstats.dev/api/card?username=octocat&theme=gruvbox)](https://github.com/rowkav09/GitHub-profile-stats)
```
https://ghstats.dev/api/card?username=octocat&theme=gruvbox
```

**Standard — Ocean theme, no border:**

[![](https://ghstats.dev/api/card?username=octocat&theme=ocean&hide_border=true)](https://github.com/rowkav09/GitHub-profile-stats)
```
https://ghstats.dev/api/card?username=octocat&theme=ocean&hide_border=true
```

**Standard — Sunset theme, hiding ring and a few stats:**

[![](https://ghstats.dev/api/card?username=octocat&theme=sunset&show_ring=false&hide=trend,avg,active_day)](https://github.com/rowkav09/GitHub-profile-stats)
```
https://ghstats.dev/api/card?username=octocat&theme=sunset&show_ring=false&hide=trend,avg,active_day
```

**Compact 6 — Forest theme:**

[![](https://ghstats.dev/api/card?username=octocat&theme=forest&size=compact&compact_count=6)](https://github.com/rowkav09/GitHub-profile-stats)
```
https://ghstats.dev/api/card?username=octocat&theme=forest&size=compact&compact_count=6
```

**Compact 3 — Midnight theme, emojis:**

[![](https://ghstats.dev/api/card?username=octocat&theme=midnight&size=compact&compact_count=3&show_emoji=true)](https://github.com/rowkav09/GitHub-profile-stats)
```
https://ghstats.dev/api/card?username=octocat&theme=midnight&size=compact&compact_count=3&show_emoji=true
```

**Custom colours:**
```
https://ghstats.dev/api/card?username=octocat&bg=0f0f23&text=cccccc&title_color=ffff66&icon_color=ff6644
```

## Features

- **13 stats** — stars, commits, PRs, issues, streak, weekly activity, weekly trend, avg commits/day, most active day, activity grade, contributions, repos, followers
- **Two layouts** — standard (list + activity ring) and compact (centered grid, 3 / 4 / 6 stats)
- **Activity ring** — circular progress indicator showing your weekly activity level and grade (standard layout only)
- **Weekly trend** — shows how your commits this week compare to last week (+/- %)
- **12 built-in themes** — Default, Light, Radical, Tokyo Night, Dracula, Nord, Gruvbox, Catppuccin, Ocean, Sunset, Forest, Midnight
- **Emoji mode** — swap SVG icons for emojis in compact layout
- **Fully customisable** — override any colour, hide individual stats, change title and border radius
- **SVG output** — crisp at any size, works everywhere Markdown or HTML images are supported
- **Fast** — edge-cached and refreshed every 30 minutes
- **Language chart** — a separate `/api/langs` endpoint renders a proportional top-languages bar (up to 12 languages)
- **Visual Builder** — full drag-and-drop editor at `/builder` with live preview, import/export, and one-click embed code

## Parameters

All parameters are passed as URL query strings.

| Parameter | Type | Default | Description |
|---|---|---|---|
| `username` | string | **required** | GitHub username |
| `theme` | string | `default` | Theme preset name |
| `bg` | hex | — | Background colour (without `#`) |
| `text` | hex | — | Text colour |
| `title_color` | hex | — | Title colour |
| `icon_color` | hex | — | Icon colour |
| `border_color` | hex | — | Border colour |
| `hide_border` | boolean | `false` | Remove the card border |
| `hide_title` | boolean | `false` | Remove the title |
| `show_icons` | boolean | `true` | Show stat icons |
| `show_ring` | boolean | `true` | Show the activity ring |
| `hide` | string | — | Comma-separated stat keys to hide |
| `border_radius` | number | `4.5` | Corner radius (`0`–`50`) |
| `custom_title` | string | — | Override the title text |
| `size` | string | `default` | Layout: `default` (list + ring) or `compact` (2-column grid) |
| `compact_count` | number | `6` | Compact only: number of stats to show — `3`, `4`, or `6` |
| `show_emoji` | boolean | `false` | Compact only: use emojis instead of SVG icons |
| `order` | string | — | Comma-separated stat keys defining display order (enabled stats only) |

### Stats You Can Hide

Pass a comma-separated list of keys to the `hide` parameter, e.g. `?hide=stars,issues,followers`

| Key | Stat |
|---|---|
| `stars` | Total Stars Earned |
| `commits` | Total Commits (year) |
| `prs` | Pull Requests |
| `issues` | Issues Opened |
| `streak` | Current Streak |
| `week` | Commits This Week |
| `trend` | Weekly Trend (+/-) |
| `avg` | Avg Commits Per Day |
| `active_day` | Most Active Day |
| `grade` | Activity Grade |
| `contributions` | Contributions This Year |
| `repos` | Public Repos |
| `followers` | Followers |

## Themes

| Theme | Style |
|---|---|
| `default` | Dark GitHub |
| `light` | Light GitHub |
| `radical` | Neon pink / cyan |
| `tokyonight` | Purple / blue night |
| `dracula` | Classic Dracula |
| `nord` | Arctic blue-grey |
| `gruvbox` | Warm retro |
| `catppuccin` | Pastel mocha |
| `ocean` | Deep blue |
| `sunset` | Warm reds / oranges |
| `forest` | Greens |
| `midnight` | Ultra-dark blue |


## FAQ

**How do I add stats to my GitHub profile?**
Create a public repo named after your GitHub username, add a `README.md`, and paste `![GitHub Stats](https://ghstats.dev/api/card?username=YOUR_USERNAME)` into it. Your stats card will appear on your profile instantly.

**Do I need a GitHub token?**
No. GitHub Profile Stats uses the public GitHub GraphQL API without any token. Just provide your username.

**How often do stats update?**
Cards are edge-cached and refresh every 30 minutes, so your stats are always near real-time.

**Can I customize the colors?**
Yes! Use URL parameters like `bg`, `text`, `title_color`, `icon_color`, and `border_color` to override any colour, or choose from 12 built-in themes.

**Is this free?**
Completely free and open source under the MIT license. No sign-up, no API key, no cost.

## Contributing

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guides on adding themes, stats, layouts, and more.

## Support

If you find this project useful, please consider giving it a ⭐ on [GitHub](https://github.com/rowkav09/GitHub-profile-stats) — it helps others discover it!

## License

MIT
