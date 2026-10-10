---
title: "ARP Spoofing & MitM Attacks"
date: 2026-10-05
category: research
tags: [arp, mitm, networking, kali, wireshark]
---

## 1. Overview
- ARP (Address Resolution Protocol) resides in Data Link Layer 
- Purpose: connects a logical network address (like an IPv4 address) to a permanent physical hardware address (a MAC address) so data can reach the right device
- ARP Cache: A temporary memory table where devices store these recently found IP-to-MAC pairings to speed up future communication. 
## 2. Shortcomings
- The biggest flaw of ARP is lack of authentication. Devices blindly trust ARP replies without verifying who sent them.
	- ARP Spoofing / Poisoning: An attacker sends fake ARP messages (**by gaining the IP address of the connection destination or through ARP Cache**) onto the local network to intercept and link the attacker's MAC address with the IP address of a legitimate target. **This can also happen mid conversation between the user and server too.** 
	- Man in the Middle (MitM) Attacks: By poisoning the ARP cache, an attacker forces all traffic between two devices to flow through their own machine (To the victim: The attacker acts as the router; To the router: the attacker acts as victim), allowing them to steal data or inject malicious payloads.
	- Denial of Service (DoS): An attacker can associate a critical IP address (like a server) with a fake or nonexistent MAC address, completely cutting off network communication for that device. This can also be called NetCut.
	- Session Hijacking: Attackers can intercept session tokens and cookies passing through the network, allowing them to impersonate users on web services.
## 3. ARP Spoofing is risky ?
- To intercept traffic, the attacker must broadcast fake ARP messages containing their actual MAC address. Because both attacker and victim have to be under the same local network, network admin can easily log this traffic and trace the MAC address back to attacker's device.
- MAC Spoofing technique (forging attacker's mac address into that of the victim) could be used to evade. However, this is still highly traceable because the WiFi Access Point or Switch can notice "MAC Duplication" on the network which could trigger system alerts making the attack highly noisy and trackable.
- Therefore, ARP Spoofing is often used in networks with many users (Exp: Cafe, places with public WiFi in general). This lays the foundation for MitM attacks, etc. 
## 4. NetCut 
- Unlike ARP spoofing this attack cuts the user entirely out of the network by setting up the same method of MitM but this time instead of using IP forwarding to send the data back to the victim, the attacker instead chooses not to. As a result, the data which was supposed to reach the user end up being dumped. 
## 5. ARP Spoofing, MitM methodology and demonstration
- There are many ways of commiting ARP Spoofing like writing arp spoofing script with Python using scapy, etc. But in this lab, the tool arpspoof will be used to demostrate.
![ARP Spoofing Lab Topology](/Personal-Blog/assets/images/arp-spoofing/lab-topology.png)
### 5.1. Setting up lab environment
- In the virtual hardware setting for all VMs, the Network Adapter segment must be switched to Custom: LAN Segment (or Host-only). DO NOT use the default NAT mode if you are practicing this on a public network (NAT mode can accidentally leak malicious ARP packets into your physical host network, disrupting internet connectivity for others or triggering Network Intrusion Detection/Prevention Systems (IDS/IPS)).
- Set up static IP:
	- Window:
		- IP Address: 192.168.100.2
		- Default Gateway: 192.168.100.1
	- Kali: 
		- IP Address: 192.168.100.3
![Kali Static IP Setup](/Personal-Blog/assets/images/arp-spoofing/kali-static-ip.png)

- Use these line to set up WiFi card eth0 and IP address for Kali VM
```bash
sudo ip link set eth0 up
sudo ifconfig eth0 192.168.100.3 netmask 255.255.255.0 up
```
![eth0 Network Setup](/Personal-Blog/assets/images/arp-spoofing/eth0-setup.png)

- Remember to turn on IP forwarding to prevent losing packet as MAC is used as the destination reference and if not the same address then it could result in packet being dumped (This could be called NetCut).
```bash
sudo sysctl -w net.ipv4.ip_forward=1 
cat /proc/sys/net/ipv4/ip_forward //Use this line to check if ip forwarding is on
```
### 5.2. Demonstration

- Use nmap to recon for active devices in the network
![Nmap Network Recon](/Personal-Blog/assets/images/arp-spoofing/nmap-recon.png)

- Turn on two terminal and use arpspoof to commit arp spoofing to route the traffic from you to the user and from you to the router, acting as the middle device. 
![Arpspoof MitM Terminals](/Personal-Blog/assets/images/arp-spoofing/arpspoof-mitm.png)
- Use wireshark to check for packets you captured
![Wireshark Packet Capture](/Personal-Blog/assets/images/arp-spoofing/wireshark-capture.png)
- Try to search for something on Window VM
![Victim Browsing on Windows VM](/Personal-Blog/assets/images/arp-spoofing/victim-browsing.png)
- On victim window vm, use arp -a to check for arp cache if there are two ips with the same mac which also occur when checking Wireshark
![ARP Cache Poisoned Check](/Personal-Blog/assets/images/arp-spoofing/arp-cache-check.png)

## 6. How to prevent ARP Spoofing or MitM attack ?
- **Mandatory Virtual Private Networks (VPN):** Require the use of a secure, enterprise-grade VPN. A VPN establishes an encrypted tunnel between the endpoint and the VPN gateway. Even if a MitM attack successfully intercepts the local network traffic, the attacker only acquires heavily encrypted data that cannot be read or modified
- **Host-Based Firewalls & Network Profiles:** Enable default operating system firewalls (e.g., Windows Defender Firewall or macOS Firewall). When connecting to unfamiliar networks, users must select the **"Public Network"** profile. This disables Network Discovery and Link-Local Multicast Name Resolution (LLMNR), minimizing the device's attack surface
- **Endpoint Detection and Response (EDR) & Antivirus ARP Protection:** Deploy endpoint security suites equipped with **Network Attack Blocker** or **ARP Protection** features. These tools continuously monitor the host's local ARP table and automatically block network adapters if anomalous MAC address changes or gateway spoofing patterns are detected.
- **Cellular Data Fallback (4G/5G):** For high-risk operations (e.g., financial transactions or accessing privileged company resources), users should completely disable Wi-Fi and utilize cellular data networks. Cellular architectures are inherently insulated from Layer 2 local network attacks like ARP Poisoning.
## 7. How ARP Spoofing, MitM has changed ?
- ARP spoofing has long been obsolete with the near-universal adoption of HTTPS/TLS. Even if ARP spoofing is commited successfully, the payload remains encrypted. 
- Even though ARP spoofing is still used in some cases where LAN is poorly secured, other methods like DNS spoofing, DHCP spoofing, etc have replaced ARP spoofing in modern MitM attack. 
