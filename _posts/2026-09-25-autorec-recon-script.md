---
layout: post
title: "autorec.sh — Automated Initial Recon Script"
date: 2026-09-25 00:00:00 +0700
category: tools
tags: [bash, automation, recon, nmap, ffuf, enumeration]
description: "A bash script that automates initial enumeration — port scanning, service fingerprinting, and web fuzzing — for CTF and lab environments."
---

## What is autorec?

`autorec.sh` is a lightweight bash automation script for the initial enumeration phase of a pentest or CTF. It chains together `rustscan`, `nmap`, `ffuf`, and `nikto` into a single workflow so you can kick off recon and come back to structured results.

**GitHub:** [github.com/{{ site.author.github }}/autorec](https://github.com/{{ site.author.github }}/autorec)

---

## Features

- Fast port scan with `rustscan` → deep scan with `nmap`
- Automatic web enumeration (ffuf) when HTTP/HTTPS detected
- Nikto scan on web services
- Colour-coded terminal output
- All results saved to a timestamped output directory

---

## Usage

```bash
chmod +x autorec.sh
./autorec.sh <target-ip> [output-dir]
```

Example:

```bash
./autorec.sh 10.10.10.3 lame_recon
```

---

## Script

```bash
#!/usr/bin/env bash
# autorec.sh — automated initial recon
# Usage: ./autorec.sh <ip> [output-dir]

set -euo pipefail

# ── Colours ──────────────────────────────────────────────────
RED='\033[0;31m'   GREEN='\033[0;32m'
YELLOW='\033[1;33m' CYAN='\033[0;36m'
NC='\033[0m'

# ── Args ─────────────────────────────────────────────────────
TARGET="${1:?Usage: $0 <ip> [output-dir]}"
OUTDIR="${2:-recon_$(date +%Y%m%d_%H%M%S)}"
mkdir -p "$OUTDIR"

log()  { echo -e "${CYAN}[*]${NC} $*"; }
ok()   { echo -e "${GREEN}[+]${NC} $*"; }
warn() { echo -e "${YELLOW}[!]${NC} $*"; }

# ── 1. Quick port scan ───────────────────────────────────────
log "Running rustscan on $TARGET ..."
OPEN_PORTS=$(rustscan -a "$TARGET" --ulimit 5000 -b 500 --no-config 2>/dev/null \
  | grep "^Open" | awk -F: '{print $2}' | tr '\n' ',' | sed 's/,$//')

ok "Open ports: $OPEN_PORTS"

# ── 2. Deep nmap ─────────────────────────────────────────────
log "Running nmap service/script scan ..."
nmap -sV -sC -p "$OPEN_PORTS" "$TARGET" \
  -oN "$OUTDIR/nmap_deep.txt" \
  -oX "$OUTDIR/nmap_deep.xml" \
  --open --reason -T4

ok "Nmap results saved to $OUTDIR/nmap_deep.txt"

# ── 3. Web enumeration ───────────────────────────────────────
WEB_PORTS=$(echo "$OPEN_PORTS" | tr ',' '\n' | grep -E '^(80|443|8080|8443|8000|8888)$' || true)

for PORT in $WEB_PORTS; do
  PROTO="http"
  [[ "$PORT" == "443" || "$PORT" == "8443" ]] && PROTO="https"
  URL="${PROTO}://${TARGET}:${PORT}"

  log "Found web service at $URL — running ffuf ..."
  ffuf -u "${URL}/FUZZ" \
    -w /usr/share/seclists/Discovery/Web-Content/raft-medium-directories.txt \
    -mc 200,204,301,302,307,401,403 \
    -o "$OUTDIR/ffuf_${PORT}.json" \
    -of json \
    -t 40 -fs 0 2>/dev/null

  ok "ffuf results → $OUTDIR/ffuf_${PORT}.json"

  log "Running nikto on $URL ..."
  nikto -h "$URL" -output "$OUTDIR/nikto_${PORT}.txt" -Format txt 2>/dev/null || true
  ok "Nikto results → $OUTDIR/nikto_${PORT}.txt"
done

# ── Done ─────────────────────────────────────────────────────
echo ""
ok "Recon complete! Results in: $OUTDIR/"
ls -lh "$OUTDIR/"
```

---

## Output Structure

```
lame_recon/
├── nmap_deep.txt       # Human-readable nmap output
├── nmap_deep.xml       # Machine-readable for import
├── ffuf_80.json        # Directory fuzzing results (port 80)
└── nikto_80.txt        # Nikto web vulnerability scan
```

---

## Dependencies

```bash
sudo apt install -y nmap nikto ffuf
# rustscan: https://github.com/RustScan/RustScan
cargo install rustscan
```

---

## Planned Features

- [ ] SMB enumeration integration (`enum4linux-ng`)
- [ ] SNMP check
- [ ] Automatic report generation (Markdown)
- [ ] Docker wrapper for portability
