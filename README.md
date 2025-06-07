# Domain Blocklists

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

### All Combined (Recommended)

- **Raw URL**: `https://raw.githubusercontent.com/casprwang/surge/main/domain-set/all.txt`
- **Description**: A consolidated list combining all sources above with duplicates removed for maximum coverage
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

rules:
  - RULE-SET,hagezi-pro-plus,REJECT
  - RULE-SET,hagezi-pro,REJECT
  - RULE-SET,steven-black,REJECT
  - RULE-SET,oisd-big,REJECT
```

## 🔄 Auto-Updates

This repository automatically updates daily at 2 AM UTC via GitHub Actions. The workflow:

1. Downloads the latest source lists
2. Processes and deduplicates entries
3. Converts to domain format
4. Commits changes if updates are found

## 🛠️ Local Development

### Prerequisites

- Node.js 18+
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

- Comments removed
- Duplicate entries removed
- Invalid entries filtered out
- Compressed and optimized
- Converted to domain format (`.example.com`)

## ⚠️ Disclaimer

These blocklists are compiled from third-party sources. While every effort is made to ensure accuracy, we cannot guarantee that all blocked domains are malicious or that all malicious domains are blocked. Use at your own discretion.

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Credits

- [Hagezi](https://github.com/hagezi/dns-blocklists) for the Pro blocklist
- [StevenBlack](https://github.com/StevenBlack/hosts) for the Unified Hosts list
- [AdGuard](https://github.com/AdguardTeam/HostlistCompiler) for the hostlist compiler

---

**Last Updated**: Auto-updated daily via GitHub Actions
