![Users](https://ghstats.dev/api/badge)
![Repo Views](https://ghstats.dev/api/visits?username=rowkav09&repo=GitHub-profile-stats)

# GitHub Profile Stats — now with mini badges & sparklines

Free, real-time GitHub stat cards, badges, and charts — drop a URL into your README and you're done. No tokens, no setup.

**[ghstats.dev](https://ghstats.dev) • [Visual Builder](https://ghstats.dev/builder)**

---

## Copy-paste gallery

**Standard card**

[![](https://ghstats.dev/api/card?username=octocat&theme=tokyonight)](https://github.com/rowkav09/GitHub-profile-stats)
```
![GitHub Stats](https://ghstats.dev/api/card?username=YOUR_USERNAME&theme=tokyonight)
```

**Compact grids (3 / 4 / 6)**

[![](https://ghstats.dev/api/card?username=octocat&theme=radical&size=compact&compact_count=3)](https://github.com/rowkav09/GitHub-profile-stats)
[![](https://ghstats.dev/api/card?username=octocat&theme=catppuccin&size=compact&compact_count=4)](https://github.com/rowkav09/GitHub-profile-stats)
[![](https://ghstats.dev/api/card?username=octocat&theme=forest&size=compact&compact_count=6)](https://github.com/rowkav09/GitHub-profile-stats)
```
https://ghstats.dev/api/card?username=YOUR_USERNAME&size=compact&compact_count=3
https://ghstats.dev/api/card?username=YOUR_USERNAME&size=compact&compact_count=4
https://ghstats.dev/api/card?username=YOUR_USERNAME&size=compact&compact_count=6
```

**Languages (bar + stacked)**

[![](https://ghstats.dev/api/langs?username=octocat&theme=dracula&layout=bar)](https://github.com/rowkav09/GitHub-profile-stats)
[![](https://ghstats.dev/api/langs?username=octocat&theme=ocean&layout=stacked)](https://github.com/rowkav09/GitHub-profile-stats)
```
![Top Languages](https://ghstats.dev/api/langs?username=YOUR_USERNAME&layout=bar)
![Top Languages](https://ghstats.dev/api/langs?username=YOUR_USERNAME&layout=stacked)
```

**Mini badges (drop anywhere)**

[![](https://ghstats.dev/api/mini?username=octocat&metric=stars)](https://github.com/rowkav09/GitHub-profile-stats)
[![](https://ghstats.dev/api/mini?username=octocat&metric=commits&color=0ea5e9)](https://github.com/rowkav09/GitHub-profile-stats)
[![](https://ghstats.dev/api/mini?username=octocat&metric=streak&color=f97316)](https://github.com/rowkav09/GitHub-profile-stats)
```
https://ghstats.dev/api/mini?username=YOUR_USERNAME&metric=stars
https://ghstats.dev/api/mini?username=YOUR_USERNAME&metric=commits&color=0ea5e9
https://ghstats.dev/api/mini?username=YOUR_USERNAME&metric=streak
```

**Activity sparkline (7–90 days)**

[![](https://ghstats.dev/api/sparkline?username=octocat&days=30&width=420)](https://github.com/rowkav09/GitHub-profile-stats)
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

Need tweaks? Use the Visual Builder to toggle stats, themes, borders, titles, and copy Markdown/HTML instantly.

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

**Mini badges ( /api/mini )**
- `metric=stars|commits|prs|issues|streak|week|followers|repos|contributions`
- `label` (override text), `color` (value side), `theme` (for errors)

**Sparkline ( /api/sparkline )**
- `days` (7–90), `width` (180–800), `height` (40–240), `line_color`, `fill_color`, `title`, `hide_border`, `border_radius`

---

## Themes

Default, Light, Radical, Tokyo Night, Dracula, Nord, Gruvbox, Catppuccin, Ocean, Sunset, Forest, Midnight.

---

## FAQ

- **Token needed?** No — public GraphQL only.
- **Refresh rate?** Cached ~30 minutes at the edge.
- **Free?** Yes. MIT licensed.
- **Where to tweak without URLs?** [ghstats.dev/builder](https://ghstats.dev/builder).

---

## Contributing & support

- PRs welcome — see [CONTRIBUTING.md](CONTRIBUTING.md).
- Like it? Drop a ⭐ on the repo: [GitHub](https://github.com/rowkav09/GitHub-profile-stats).

---

## License

MIT
