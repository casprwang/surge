# Domain Blocklists

**Last Updated**: 2025-06-09 (479,459 domains)

A collection of curated domain blocklists automatically compiled from popular sources. These lists are updated daily and formatted for use with DNS filtering solutions, ad blockers, and network security tools.

## 📋 Available Blocklists

### Hagezi Pro Plus

- **Source**: [Hagezi DNS Blocklists Pro Plus](https://github.com/hagezi/dns-blocklists)
- **Raw URL**: `https://raw.githubusercontent.com/casprwang/surge/main/domain-set/hagezi-pro-plus.txt`
- **Description**: The most comprehensive Hagezi blocklist with additional blocking categories
- **Format**: Domain format (`.example.com`)

### Hagezi Pro

- **Source**: [Hagezi DNS Blocklists Pro](https://github.com/hagezi/dns-blocklists#pro)
- **Raw URL**: `https://raw.githubusercontent.com/casprwang/surge/main/domain-set/hagezi-pro.txt`
- **Description**: A comprehensive blocklist that blocks ads, tracking, malware, and phishing domains
- **Format**: Domain format (`.example.com`)

### StevenBlack

- **Source**: [StevenBlack Unified Hosts](https://github.com/StevenBlack/hosts)
- **Raw URL**: `https://raw.githubusercontent.com/casprwang/surge/main/domain-set/steven-black.txt`
- **Description**: A consolidated hosts file with base adware and malware blocking
- **Format**: Domain format (`.example.com`)

### OISD Big

- **Source**: [OISD Big Domain List](https://oisd.nl)
- **Raw URL**: `https://raw.githubusercontent.com/casprwang/surge/main/domain-set/oisd-big.txt`
- **Description**: One of the most comprehensive domain blocklists available, blocking ads, malware, tracking, and more
- **Format**: Domain format (`.example.com`)

### SKK Reject

- **Source**: [Sukka's Surge Ruleset](https://ruleset.skk.moe/)
- **Raw URL**: `https://raw.githubusercontent.com/casprwang/surge/main/domain-set/reject.conf`
- **Description**: High-quality reject list maintained by Sukka for blocking ads and trackers
- **Format**: Domain format (`.example.com`)

### SKK Reject Extra

- **Source**: [Sukka's Surge Ruleset Extra](https://ruleset.skk.moe/)
- **Raw URL**: `https://raw.githubusercontent.com/casprwang/surge/main/domain-set/reject_extra.conf`
- **Description**: Additional reject rules from Sukka's comprehensive ruleset collection
- **Format**: Domain format (`.example.com`)

### Anti-AD

- **Source**: [Privacy Protection Tools Anti-AD](https://github.com/privacy-protection-tools/anti-AD)
- **Raw URL**: `https://raw.githubusercontent.com/casprwang/surge/main/domain-set/anti-ad-surge2.txt`
- **Description**: Comprehensive Chinese and international ad blocking list
- **Format**: Domain format (`.example.com`)

### All Combined (Recommended)

- **Raw URL**: `https://raw.githubusercontent.com/casprwang/surge/main/domain-set/all.txt`
- **Description**: A consolidated list combining all sources above with duplicates removed for maximum coverage
- **Total Domains**: 479,459 unique entries
- **Format**: Domain format (`.example.com`)

## 🚀 Usage

### DNS Filtering (Pi-hole, AdGuard Home, etc.)

**Recommended**: Use the combined list for maximum coverage:
```
https://raw.githubusercontent.com/casprwang/surge/main/domain-set/all.txt
```

Or add individual lists:
```
https://raw.githubusercontent.com/casprwang/surge/main/domain-set/hagezi-pro-plus.txt
https://raw.githubusercontent.com/casprwang/surge/main/domain-set/hagezi-pro.txt
https://raw.githubusercontent.com/casprwang/surge/main/domain-set/steven-black.txt
https://raw.githubusercontent.com/casprwang/surge/main/domain-set/oisd-big.txt
https://raw.githubusercontent.com/casprwang/surge/main/domain-set/reject.conf
https://raw.githubusercontent.com/casprwang/surge/main/domain-set/reject_extra.conf
https://raw.githubusercontent.com/casprwang/surge/main/domain-set/anti-ad-surge2.txt
```

### Surge (iOS/macOS)

**Recommended**: Use the combined list:
```ini
[Rule]
RULE-SET,https://raw.githubusercontent.com/casprwang/surge/main/domain-set/all.txt,REJECT
```

Or add individual lists:
```ini
[Rule]
RULE-SET,https://raw.githubusercontent.com/casprwang/surge/main/domain-set/hagezi-pro-plus.txt,REJECT
RULE-SET,https://raw.githubusercontent.com/casprwang/surge/main/domain-set/hagezi-pro.txt,REJECT
RULE-SET,https://raw.githubusercontent.com/casprwang/surge/main/domain-set/steven-black.txt,REJECT
RULE-SET,https://raw.githubusercontent.com/casprwang/surge/main/domain-set/oisd-big.txt,REJECT
RULE-SET,https://raw.githubusercontent.com/casprwang/surge/main/domain-set/reject.conf,REJECT
RULE-SET,https://raw.githubusercontent.com/casprwang/surge/main/domain-set/reject_extra.conf,REJECT
RULE-SET,https://raw.githubusercontent.com/casprwang/surge/main/domain-set/anti-ad-surge2.txt,REJECT
```

### Clash

**Recommended**: Use the combined list:
```yaml
rule-providers:
  blocklist-all:
    type: http
    behavior: domain
    url: 'https://raw.githubusercontent.com/casprwang/surge/main/domain-set/all.txt'
    path: ./ruleset/blocklist-all.yaml
    interval: 86400

rules:
  - RULE-SET,blocklist-all,REJECT
```

Or add individual lists:
```yaml
rule-providers:
  hagezi-pro-plus:
    type: http
    behavior: domain
    url: 'https://raw.githubusercontent.com/casprwang/surge/main/domain-set/hagezi-pro-plus.txt'
    path: ./ruleset/hagezi-pro-plus.yaml
    interval: 86400

  hagezi-pro:
    type: http
    behavior: domain
    url: 'https://raw.githubusercontent.com/casprwang/surge/main/domain-set/hagezi-pro.txt'
    path: ./ruleset/hagezi-pro.yaml
    interval: 86400

  steven-black:
    type: http
    behavior: domain
    url: 'https://raw.githubusercontent.com/casprwang/surge/main/domain-set/steven-black.txt'
    path: ./ruleset/steven-black.yaml
    interval: 86400

  oisd-big:
    type: http
    behavior: domain
    url: 'https://raw.githubusercontent.com/casprwang/surge/main/domain-set/oisd-big.txt'
    path: ./ruleset/oisd-big.yaml
    interval: 86400

  skk-reject:
    type: http
    behavior: domain
    url: 'https://raw.githubusercontent.com/casprwang/surge/main/domain-set/reject.conf'
    path: ./ruleset/skk-reject.yaml
    interval: 86400

  skk-reject-extra:
    type: http
    behavior: domain
    url: 'https://raw.githubusercontent.com/casprwang/surge/main/domain-set/reject_extra.conf'
    path: ./ruleset/skk-reject-extra.yaml
    interval: 86400

  anti-ad:
    type: http
    behavior: domain
    url: 'https://raw.githubusercontent.com/casprwang/surge/main/domain-set/anti-ad-surge2.txt'
    path: ./ruleset/anti-ad.yaml
    interval: 86400

rules:
  - RULE-SET,hagezi-pro-plus,REJECT
  - RULE-SET,hagezi-pro,REJECT
  - RULE-SET,steven-black,REJECT
  - RULE-SET,oisd-big,REJECT
  - RULE-SET,skk-reject,REJECT
  - RULE-SET,skk-reject-extra,REJECT
  - RULE-SET,anti-ad,REJECT
```

## 🔄 Auto-Updates

This repository automatically updates daily at 2 AM UTC via GitHub Actions. The workflow:

1. Cleans the output directory to ensure fresh builds
2. Downloads remote blocklist files in parallel using efficient curl commands
3. Automatically removes comments and empty lines from downloaded files
4. Downloads and processes the latest source lists from upstream providers
5. Processes and deduplicates entries using efficient shell commands
6. Converts to domain format (`.example.com`)
7. Generates a consolidated `all.txt` file combining all sources with duplicates removed
8. Commits changes if updates are found

## 🛠️ Local Development

### Prerequisites

- Node.js 22+ (ES Modules support)
- npm

### Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd <your-repo-name>

# Install dependencies
npm install

# Generate blocklists
node script.js
```

### Adding New Sources

Edit `script.js` and add new configurations to the `configurations` array:

```javascript
{
  name: 'Your Blocklist Name',
  homepage: 'https://example.com',
  sources: [
    {
      source: 'https://example.com/blocklist.txt',
      type: 'hosts',
    },
  ],
  transformations: [
    'RemoveComments',
    'RemoveModifiers',
    'Compress',
    'Validate',
    'Deduplicate',
  ],
}
```

## 📊 Statistics

The lists are processed with the following transformations:

- Remote files downloaded in parallel for efficiency
- Comments and empty lines automatically removed using `grep` commands
- Duplicate entries removed using efficient shell commands (`sort -u`)
- Invalid entries filtered out
- Wildcard domains (containing `*`) are skipped for safety
- Compressed and optimized
- Converted to domain format (`.example.com`)
- All sources combined into a single deduplicated `all.txt` file

## ⚠️ Disclaimer

These blocklists are compiled from third-party sources. While every effort is made to ensure accuracy, we cannot guarantee that all blocked domains are malicious or that all malicious domains are blocked. Use at your own discretion.

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Credits

- [Hagezi](https://github.com/hagezi/dns-blocklists) for the Pro and Pro Plus blocklists
- [StevenBlack](https://github.com/StevenBlack/hosts) for the Unified Hosts list
- [OISD](https://oisd.nl) for the comprehensive Big domain list
- [Sukka](https://ruleset.skk.moe/) for the high-quality Surge rulesets
- [Privacy Protection Tools](https://github.com/privacy-protection-tools/anti-AD) for the Anti-AD project
- [AdGuard](https://github.com/AdguardTeam/HostlistCompiler) for the hostlist compiler

---
