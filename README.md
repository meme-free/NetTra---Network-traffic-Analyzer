# NetTra - Network Traffic Analyzer

Desktop application for monitoring and analyzing network traffic in real-time.

## Download

### Pre-built Installers

| File                                            | Size  | Download  |
| ----------------------------------------------- | ----- | --------- |
| **NetTra_1.0.0_x64-setup.exe** (NSIS Installer) | ~2 MB | [Link](#) |
| **NetTra_1.0.0_x64_en-US.msi** (MSI Installer)  | ~3 MB | [Link](#) |
| **nettra.exe** (Portable)                       | ~9 MB | [Link](#) |

### Build from Source

Requirements:

- Node.js 18+
- Rust 1.70+
- Windows 10/11

```bash
# Clone repository
git clone https://gitlab.com/locdt3543/nettra-network-traffic-analyzer.git
cd nettra-network-traffic-analyzer

# Install dependencies
npm install

# Build desktop app
npm run tauri build
```

Output: `src-tauri/target/release/nettra.exe`

---

## Features

### Dashboard

- **Bandwidth Chart**: Real-time download/upload visualization
- **Protocol Distribution**: Pie chart showing TCP/UDP/ICMP/DNS/HTTPS
- **Top IPs**: Most active source IP addresses
- **Metrics Cards**: Bandwidth, packets, active IPs

### Live Monitor

- Filter packets by protocol or IP
- Protocol badges with color coding
- Packet details (source, destination, size, info)

### Traffic Generator

- Generate random network traffic for testing
- Parabolic + burst pattern for realistic data
- Start/Stop/Reset controls

### Threat Intel

- Real-time threat alert generation
- Severity levels: Critical, High, Medium, Low
- Attack types: Port Scan, DDoS, Brute Force, SQL Injection

### Settings

- Theme: Light/Dark toggle
- Notifications: Toggle alerts on/off

---

## Usage

1. **Run the app**
   - Double-click `nettra.exe` or
   - Install via `NetTra_1.0.0_x64-setup.exe`

2. **Start traffic generator**
   - Go to **Traffic Generator** tab
   - Click **Start Generation**
   - Watch real-time data on Dashboard

3. **View packets**
   - Go to **Live Monitor** tab
   - See incoming packets in real-time

4. **Check threats**
   - Go to **Threat Intel** tab
   - View generated alerts

---

## System Requirements

- **OS**: Windows 10/11 (64-bit)
- **RAM**: 4 GB minimum
- **Storage**: 100 MB

---

## License

MIT License

---

## Tech Stack

- **Frontend**: React 19 + Vite + TypeScript
- **UI**: shadcn/ui + Tailwind CSS + Recharts
- **Desktop**: Tauri 2.x (Rust)
- **Icons**: Lucide React
