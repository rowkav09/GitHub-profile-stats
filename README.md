![Users](https://ghstats.dev/api/badge)
![Repo Views](https://ghstats.dev/api/visits?username=rowkav09&repo=GitHub-profile-stats)

# GitHub Profile Stats — stats cards, badges, streaks & heatmaps

Free, real-time GitHub stat cards, badges, and charts — drop a URL into your README and you're done. No tokens, no setup.

**[ghstats.dev](https://ghstats.dev)**

---

## Copy-paste gallery

**Standard card**

[![](https://ghstats.dev/api/card?username=rowkav09&theme=tokyonight)](https://github.com/rowkav09/GitHub-profile-stats)
```
![GitHub Stats](https://ghstats.dev/api/card?username=YOUR_USERNAME&theme=tokyonight)
```

**Compact grids (3 / 4 / 6)**

[![](https://ghstats.dev/api/card?username=rowkav09&theme=radical&size=compact&compact_count=3)](https://github.com/rowkav09/GitHub-profile-stats)
[![](https://ghstats.dev/api/card?username=rowkav09&theme=catppuccin&size=compact&compact_count=4)](https://github.com/rowkav09/GitHub-profile-stats)
[![](https://ghstats.dev/api/card?username=rowkav09&theme=forest&size=compact&compact_count=6)](https://github.com/rowkav09/GitHub-profile-stats)
```
https://ghstats.dev/api/card?username=YOUR_USERNAME&size=compact&compact_count=3
https://ghstats.dev/api/card?username=YOUR_USERNAME&size=compact&compact_count=4
https://ghstats.dev/api/card?username=YOUR_USERNAME&size=compact&compact_count=6
```

**Languages (bar + stacked)**

[![](https://ghstats.dev/api/langs?username=rowkav09&theme=dracula&layout=bar)](https://github.com/rowkav09/GitHub-profile-stats)
[![](https://ghstats.dev/api/langs?username=rowkav09&theme=ocean&layout=stacked)](https://github.com/rowkav09/GitHub-profile-stats)
```
![Top Languages](https://ghstats.dev/api/langs?username=YOUR_USERNAME&layout=bar)
![Top Languages](https://ghstats.dev/api/langs?username=YOUR_USERNAME&layout=stacked)
```

**Streak card** ✨ new

[![](https://ghstats.dev/api/streak?username=rowkav09&theme=tokyonight)](https://github.com/rowkav09/GitHub-profile-stats)
```
![Streak](https://ghstats.dev/api/streak?username=YOUR_USERNAME&theme=tokyonight)
```

**Top repositories card** ✨ new

[![](https://ghstats.dev/api/repos?username=rowkav09&theme=dracula&repo_count=3)](https://github.com/rowkav09/GitHub-profile-stats)
```
![Top Repos](https://ghstats.dev/api/repos?username=YOUR_USERNAME&repo_count=3)
```

**Contribution heatmap** ✨ new

[![](https://ghstats.dev/api/heatmap?username=rowkav09&weeks=16)](https://github.com/rowkav09/GitHub-profile-stats)
```
![Heatmap](https://ghstats.dev/api/heatmap?username=YOUR_USERNAME&weeks=16)
![Heatmap](https://ghstats.dev/api/heatmap?username=YOUR_USERNAME&weeks=52&color_scheme=halloween)
```

**Mini badges (drop anywhere)**

[![](https://ghstats.dev/api/mini?username=rowkav09&metric=stars)](https://github.com/rowkav09/GitHub-profile-stats)
[![](https://ghstats.dev/api/mini?username=rowkav09&metric=commits&color=0ea5e9)](https://github.com/rowkav09/GitHub-profile-stats)
[![](https://ghstats.dev/api/mini?username=rowkav09&metric=streak&color=f97316)](https://github.com/rowkav09/GitHub-profile-stats)
```
https://ghstats.dev/api/mini?username=YOUR_USERNAME&metric=stars
https://ghstats.dev/api/mini?username=YOUR_USERNAME&metric=commits&color=0ea5e9
https://ghstats.dev/api/mini?username=YOUR_USERNAME&metric=streak
```

**Activity sparkline (7–90 days)**

[![](https://ghstats.dev/api/sparkline?username=rowkav09&days=30&width=420)](https://github.com/rowkav09/GitHub-profile-stats)
```
![Activity Sparkline](https://ghstats.dev/api/sparkline?username=YOUR_USERNAME&days=30&width=420)
```

**Quick color override**
```
https://ghstats.dev/api/card?username=YOUR_USERNAME&bg=0f0f23&text=cccccc&title_color=ffff66&icon_color=ff6644
```

---

## 30-second setup

1) Create a public repo named **your-username** on GitHub and add a `README.md`.
2) Paste an embed from the gallery above. Done.

Need tweaks? Use the on-page editor to toggle stats, themes, borders, titles, and copy Markdown/HTML instantly.

---

## Options cheat sheet

**Card ( /api/card )**
- `username` (required)
- `theme` default `default`
- Layout: `size=default|compact`, `compact_count=3|4|6`, `show_emoji=true`
- Visibility: `hide=stars,issues,...`, `show_ring`, `show_icons`, `hide_title`, `hide_border`
- Styling: `bg`, `text`, `title_color`, `icon_color`, `border_color`, `border_radius`, `custom_title`, `order`

**Languages ( /api/langs )**
- `layout=bar|stacked`, `max_langs` (1–12)
- `hide_border`, `hide_title`, `custom_title`, `border_radius`, theme overrides as above

**Streak ( /api/streak )** ✨ new
- `show_ring` (default true) — show activity grade ring
- `hide_border`, `hide_title`, `custom_title`, `border_radius`, theme overrides as above

**Top Repos ( /api/repos )** ✨ new
- `repo_count` (1–6, default 3) — number of repos to display
- `hide_border`, `hide_title`, `custom_title`, `border_radius`, theme overrides as above

**Contribution Heatmap ( /api/heatmap )** ✨ new
- `weeks` (4–52, default 16) — number of weeks to display
- `color_scheme=default|halloween|winter|pink` — cell color palette
- `hide_border`, `hide_title`, `custom_title`, `border_radius`, theme overrides as above

**Mini badges ( /api/mini )**
- `metric=stars|commits|prs|issues|streak|week|followers|repos|contributions`
- `label` (override text), `color` (value side), `theme` (for errors)

**Sparkline ( /api/sparkline )**
- `days` (7–90), `width` (180–800), `height` (40–240), `line_color`, `fill_color`, `title`, `hide_border`, `border_radius`

---

## Themes

Default, Light, Radical, Tokyo Night, Dracula, Nord, Gruvbox, Catppuccin, Ocean, Sunset, Forest, Midnight.

All theme names work on every endpoint via the `theme=` parameter.

---

## Why ghstats.dev?

| Feature | ghstats.dev | Alternatives |
|---|---|---|
| No token required | ✅ | ❌ most require a PAT |
| Streak card | ✅ `/api/streak` | Limited |
| Top repos card | ✅ `/api/repos` | Few |
| Contribution heatmap | ✅ `/api/heatmap` | Very few |
| Mini inline badges | ✅ `/api/mini` | Rare |
| Activity sparkline | ✅ `/api/sparkline` | Rare |
| Profile view counter | ✅ `/api/visits` | Rare |
| Visual drag-and-drop editor | ✅ on ghstats.dev | Rare |
| MIT licensed & self-hostable | ✅ | Varies |

---

## FAQ

- **Token needed?** No — public GraphQL only.
- **Refresh rate?** Cached ~30 minutes at the edge.
- **Free?** Yes. MIT licensed.
- **Where to tweak without URLs?** [ghstats.dev/builder](https://ghstats.dev/builder).
- **New user with no data?** Cards degrade gracefully and show a helpful message.

---

## Contributing & support

- PRs welcome — see [CONTRIBUTING.md](CONTRIBUTING.md).
- Like it? Drop a ⭐ on the repo: [GitHub](https://github.com/rowkav09/GitHub-profile-stats).

---

## License

MIT
