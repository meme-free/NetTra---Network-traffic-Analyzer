import { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search } from "lucide-react";
import { useTrafficDataContext } from "@/hooks/useTrafficData";

const protocolBadgeColors: Record<string, { bg: string; text: string }> = {
  TCP: { bg: "rgba(0,120,212,0.2)", text: "#a3c9ff" },
  UDP: { bg: "rgba(108,203,95,0.2)", text: "#6ccb5f" },
  ICMP: { bg: "rgba(255,182,137,0.2)", text: "#ffb689" },
  ARP: { bg: "rgba(163,201,255,0.2)", text: "#a3c9ff" },
  DNS: { bg: "rgba(192,168,255,0.2)", text: "#c0c7d4" },
  HTTPS: { bg: "rgba(0,120,212,0.2)", text: "#a3c9ff" },
};

export function LiveMonitor() {
  const { theme } = useTheme();
  const { packets } = useTrafficDataContext();
  const [filterText, setFilterText] = useState("");
  const [selectedPacket, setSelectedPacket] = useState<{
    source_ip: string;
    source_port: number;
    dest_ip: string;
    dest_port: number;
    protocol: string;
    length: number;
    info: string;
  } | null>(null);

  const filteredPackets = packets.filter((p) => {
    if (!filterText) return true;
    const search = filterText.toLowerCase();
    return (
      p.source_ip.toLowerCase().includes(search) ||
      p.dest_ip.toLowerCase().includes(search) ||
      p.protocol.toLowerCase().includes(search)
    );
  });

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b" style={{ borderColor: theme === "dark" ? "#343535" : "#dcdbda" }}>
        <div>
          <h1 className={`text-2xl font-semibold ${theme === "dark" ? "text-[#e3e2e1]" : "text-[#1a1c1c]"}`}>
            Live Monitor
          </h1>
          <p className={`text-sm mt-1 ${theme === "dark" ? "text-[#8a919e]" : "text-[#8a919e]"}`}>
            Real-time packet capture - {packets.length} packets captured
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 p-4" style={{ borderColor: theme === "dark" ? "#343535" : "#dcdbda" }}>
        <div className="relative flex-1">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 size-4 ${theme === "dark" ? "text-[#8a919e]" : "text-[#8a919e]"}`} />
          <Input
            placeholder="Filter by IP, protocol..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className={`pl-10 pr-8 ${theme === "dark" ? "bg-[#1a1c1c] border-[#343535] text-[#e3e2e1] placeholder:text-[#8a919e]" : "bg-white border-[#dcdbda] text-[#1a1c1c]"}`}
          />
          {filterText && (
            <button
              onClick={() => setFilterText("")}
              className={`absolute right-3 top-1/2 -translate-y-1/2 ${theme === "dark" ? "text-[#8a919e] hover:text-[#e3e2e1]" : "text-[#8a919e] hover:text-[#1a1c1c]"}`}
            >
              ✕
            </button>
          )}
        </div>
        <select
          className={`px-3 py-2 rounded-lg border text-sm ${theme === "dark" ? "bg-[#1a1c1c] border-[#343535] text-[#e3e2e1]" : "bg-white border-[#dcdbda] text-[#1a1c1c]"}`}
          onChange={(e) => {
            if (e.target.value === "all") {
              setFilterText("");
            } else {
              setFilterText(e.target.value);
            }
            e.target.value = "all";
          }}
        >
          <option value="all">All Protocols</option>
          <option value="TCP">TCP</option>
          <option value="UDP">UDP</option>
          <option value="ICMP">ICMP</option>
          <option value="DNS">DNS</option>
          <option value="HTTPS">HTTPS</option>
        </select>
      </div>

      <div className="flex-1 overflow-auto px-4 pb-4 scrollbar-thin">
        <div className="rounded-xl border overflow-hidden" style={{ borderColor: theme === "dark" ? "#343535" : "#dcdbda" }}>
          <Table>
            <TableHeader>
              <TableRow className={theme === "dark" ? "bg-[#292a2a] border-[#343535]" : "bg-[#e8e7e6] border-[#dcdbda]"}>
                {["Source", "Destination", "Protocol", "Length", "Info"].map((h) => (
                  <TableHead key={h} className={`text-xs font-semibold uppercase ${theme === "dark" ? "text-[#8a919e]" : "text-[#8a919e]"}`}>
                    {h}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPackets.slice(0, 50).map((packet) => {
                const colors = protocolBadgeColors[packet.protocol] || { bg: "rgba(128,128,128,0.2)", text: "#c0c7d4" };
                return (
                  <TableRow
                    key={packet.id}
                    onClick={() => setSelectedPacket(packet)}
                    className={`cursor-pointer transition-colors ${
                      theme === "dark" ? "border-[#343535] hover:bg-[#292a2a]" : "border-[#dcdbda] hover:bg-[#e8e7e6]"
                    } ${selectedPacket?.source_ip === packet.source_ip ? theme === "dark" ? "bg-[#0078D4]/10" : "bg-[#0078D4]/5" : ""}`}
                  >
                    <TableCell className={`font-mono text-xs ${theme === "dark" ? "text-[#a3c9ff]" : "text-[#0078D4]"}`}>
                      {packet.source_ip}:{packet.source_port}
                    </TableCell>
                    <TableCell className={`font-mono text-xs ${theme === "dark" ? "text-[#a3c9ff]" : "text-[#0078D4]"}`}>
                      {packet.dest_ip}:{packet.dest_port}
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: colors.bg, color: colors.text }}>
                        {packet.protocol}
                      </span>
                    </TableCell>
                    <TableCell className={`text-sm ${theme === "dark" ? "text-[#e3e2e1]" : "text-[#1a1c1c]"}`}>
                      {packet.length} bytes
                    </TableCell>
                    <TableCell className={`text-xs max-w-xs truncate ${theme === "dark" ? "text-[#c0c7d4]" : "text-[#5c5f60]"}`}>
                      {packet.info}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      {selectedPacket && (
        <div className={`p-4 border-t ${theme === "dark" ? "bg-[#1a1c1c] border-[#343535]" : "bg-white border-[#dcdbda]"}`}>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <p className={`text-xs mb-1 ${theme === "dark" ? "text-[#8a919e]" : "text-[#8a919e]"}`}>Source</p>
              <p className={`font-mono text-sm ${theme === "dark" ? "text-[#a3c9ff]" : "text-[#0078D4]"}`}>{selectedPacket.source_ip}:{selectedPacket.source_port}</p>
            </div>
            <div>
              <p className={`text-xs mb-1 ${theme === "dark" ? "text-[#8a919e]" : "text-[#8a919e]"}`}>Destination</p>
              <p className={`font-mono text-sm ${theme === "dark" ? "text-[#a3c9ff]" : "text-[#0078D4]"}`}>{selectedPacket.dest_ip}:{selectedPacket.dest_port}</p>
            </div>
            <div>
              <p className={`text-xs mb-1 ${theme === "dark" ? "text-[#8a919e]" : "text-[#8a919e]"}`}>Length</p>
              <p className={`text-sm ${theme === "dark" ? "text-[#e3e2e1]" : "text-[#1a1c1c]"}`}>{selectedPacket.length} bytes</p>
            </div>
            <div>
              <p className={`text-xs mb-1 ${theme === "dark" ? "text-[#8a919e]" : "text-[#8a919e]"}`}>Info</p>
              <p className={`text-sm ${theme === "dark" ? "text-[#e3e2e1]" : "text-[#1a1c1c]"}`}>{selectedPacket.info}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}