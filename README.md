# W@rtz.io — Penetration Tester Blog

Personal security research blog built with Jekyll for GitHub Pages.  
Dark terminal aesthetic inspired by [beneisner.io](https://www.beneisner.io/).

## 🚀 Quick Start

### Prerequisites
```bash
# Ruby + Bundler
gem install bundler jekyll
```

### Local Development
```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO
bundle install
bundle exec jekyll serve --livereload
# → open http://localhost:4000
```

## 📁 Structure

```
w@rtz-blog/
├── _config.yml          # Site config — update author info here!
├── _layouts/
│   ├── default.html     # Base layout
│   ├── home.html        # Home page
│   ├── post.html        # Individual post
│   ├── posts.html       # Post listing
│   └── about.html       # About/portfolio
├── _includes/
│   ├── nav.html         # Navigation bar
│   ├── footer.html      # Footer
│   └── post-list.html   # Reusable post list component
├── _posts/              # ← Your posts go here!
├── assets/
│   ├── css/main.css     # All styles (Gruvbox dark theme)
│   └── js/main.js       # Filter tabs, copy buttons, progress bar
├── index.html           # Home page
├── posts/index.html     # /posts listing
└── about/index.html     # /about portfolio
```

## ✍️ Writing Posts

Create a new file in `_posts/` with the format `YYYY-MM-DD-title.md`:

```markdown
---
layout: post
title: "HTB — Machine Name"
date: 2026-09-29 00:00:00 +0700
category: writeups          # writeups | research | tools
platform: "HackTheBox"      # (optional) for writeups
difficulty: "Medium"        # (optional)
tags: [htb, linux, web, sqli]
description: "Short description shown on listing pages."
---

Your content here...
```

### Categories

| Category | Use for |
|----------|---------|
| `writeups` | HTB/THM/VulnHub machine writeups, CTF solutions |
| `research` | Methodology notes, vulnerability research, techniques |
| `tools` | Custom scripts, tool reviews, automation |

## ⚙️ Configuration

Edit `_config.yml` to set your info:

```yaml
author:
  name: "W@rtz"
  alias: "phtun"
  email: "your@email.com"
  github: "your-github-username"
  twitter: ""
  linkedin: ""
```

## 🌐 Deploy to GitHub Pages

1. Push to a GitHub repo named `<username>.github.io`
2. Go to **Settings → Pages**
3. Set source to **Deploy from branch → main → / (root)**
4. Your blog will be live at `https://<username>.github.io`

Or use a custom domain by adding a `CNAME` file:

```
w@rtz.io
```

## 📜 Content License

All **blog content** (writeups, research notes, tools, and posts) is licensed under
**[CC BY-NC-ND 4.0](https://creativecommons.org/licenses/by-nc-nd/4.0/)**.

You are free to:
- ✅ Read and learn from any post
- ✅ Share a link to the original post
- ✅ Reference or cite with proper attribution

You may **not**:
- ❌ Copy or republish posts elsewhere
- ❌ Use content for commercial purposes
- ❌ Modify and redistribute the content

> The information shared here reflects personal research and may not always be accurate.
> **Constructive feedback is always welcome** — if you spot an error or have something
> to add, feel free to open an issue or reach out directly.

## 📄 Template License

MIT License

The design and visual aesthetic of this blog is inspired by
[beneisner.io](https://www.beneisner.io/) by Ben Eisner, licensed under the MIT License:

```
Copyright (c) 2025 Backuardo Labs LLC

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

Copyright (c) 2026 W@rtz (Modified work)

All blog content — including research notes, writeups, and tools — is original work
and does not fall under the above license.
