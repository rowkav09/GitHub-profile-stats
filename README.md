# GitHub Profile Stats

Beautiful, dynamically generated stats cards for your GitHub profile README. Just paste one line and your stats are always up to date — no setup, no tokens, no deployment needed.

**[ghstats.dev](https://ghstats.dev)**

![Example Card](https://ghstats.dev/api/card?username=octocat&theme=tokyonight)

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

### Customise with the Visual Editor

Visit **[ghstats.dev](https://ghstats.dev)** to customise your card with the interactive editor. Pick a theme, toggle stats on and off, and copy the embed code when you're done.

## Examples

**Default:**
```
https://ghstats.dev/api/card?username=octocat
```

**Tokyo Night theme, hiding issues and followers:**
```
https://ghstats.dev/api/card?username=octocat&theme=tokyonight&hide=issues,followers
```

**Custom colours:**
```
https://ghstats.dev/api/card?username=octocat&bg=000000&text=ffffff&title_color=ff6b6b&icon_color=ffa07a
```

**Hide the activity ring:**
```
https://ghstats.dev/api/card?username=octocat&show_ring=false
```

## Features

- **13 stats** — stars, commits, PRs, issues, streak, weekly activity, monthly trend, avg commits/day, most active day, activity grade, contributions, repos, followers
- **Activity ring** — circular progress indicator showing your activity level and grade
- **Monthly trend** — shows how your commits this month compare to last month (+/- %)
- **12 built-in themes** — Default, Light, Radical, Tokyo Night, Dracula, Nord, Gruvbox, Catppuccin, Ocean, Sunset, Forest, Midnight
- **Fully customisable** — override any colour, hide individual stats, change title and border radius
- **SVG output** — crisp at any size, works everywhere Markdown or HTML images are supported
- **Fast** — edge-cached and refreshed every 30 minutes

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
| `trend` | Monthly Trend (+/-) |
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

## License

MIT
