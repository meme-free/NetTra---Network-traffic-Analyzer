import { useTheme } from "@/context/ThemeContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface IPData {
  ip: string;
  packets: number;
  bytes: number;
  port: number;
  protocol: string;
  last_seen: number;
}

interface TopIPsTableProps {
  data?: IPData[];
}

const protocolColors: Record<string, { dark: { bg: string; text: string }; light: { bg: string; text: string } }> = {
  TCP: { dark: { bg: "rgba(0,120,212,0.2)", text: "#a3c9ff" }, light: { bg: "rgba(0,120,212,0.1)", text: "#0078D4" } },
  UDP: { dark: { bg: "rgba(108,203,95,0.2)", text: "#6ccb5f" }, light: { bg: "rgba(108,203,95,0.1)", text: "#6ccb5f" } },
  ICMP: { dark: { bg: "rgba(255,182,137,0.2)", text: "#ffb689" }, light: { bg: "rgba(255,182,137,0.1)", text: "#ffb689" } },
};

const emptyIPs: IPData[] = [
  { ip: "-", packets: 0, bytes: 0, port: 0, protocol: "TCP", last_seen: 0 },
  { ip: "-", packets: 0, bytes: 0, port: 0, protocol: "TCP", last_seen: 0 },
  { ip: "-", packets: 0, bytes: 0, port: 0, protocol: "TCP", last_seen: 0 },
  { ip: "-", packets: 0, bytes: 0, port: 0, protocol: "TCP", last_seen: 0 },
  { ip: "-", packets: 0, bytes: 0, port: 0, protocol: "TCP", last_seen: 0 },
];

export function TopIPsTable({ data }: TopIPsTableProps) {
  const { theme } = useTheme();

  const activeIPs = data?.filter(ip => ip.packets > 0) || [];
  const displayData = activeIPs.length > 0 
    ? [...activeIPs, ...emptyIPs.slice(0, 5 - activeIPs.length)]
    : emptyIPs;

  return (
    <Card
      className={`p-5 card-hover border-glow ${
        theme === "dark" ? "bg-[#1a1c1c]/80 border-[#343535]" : "bg-white/80 border-[#dcdbda]"
      }`}
      style={{ backdropFilter: "blur(20px)" }}
    >
      <CardHeader className="p-0 pb-4">
        <CardTitle
          className={`text-sm font-semibold ${
            theme === "dark" ? "text-[#e3e2e1]" : "text-[#1a1c1c]"
          }`}
        >
          Top Active IPs
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-hidden rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow className={theme === "dark" ? "bg-[#292a2a]" : "bg-[#e8e7e6]"}>
                {["IP Address", "Packets", "Bandwidth", "Protocol"].map((header, i) => (
                  <TableHead
                    key={header}
                    className={`text-xs font-semibold uppercase tracking-wider ${
                      theme === "dark" ? "text-[#8a919e]" : "text-[#8a919e]"
                    } ${i === 0 ? "pl-4" : ""}`}
                  >
                    {header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayData.slice(0, 5).map((row, index) => {
                const colors = protocolColors[row.protocol]?.[theme === "dark" ? "dark" : "light"] || protocolColors.TCP[theme === "dark" ? "dark" : "light"];
                const isEmpty = row.ip === "-" || row.packets === 0;
                
                return (
                  <TableRow
                    key={`${row.ip}-${index}`}
                    className={`transition-colors duration-200 ${
                      theme === "dark" ? "border-[#343535] hover:bg-[#292a2a]" : "border-[#dcdbda] hover:bg-[#e8e7e6]"
                    } ${isEmpty ? "opacity-40" : ""}`}
                  >
                    <TableCell
                      className={`font-mono text-sm font-medium py-3 pl-4 ${
                        theme === "dark" ? "text-[#a3c9ff]" : "text-[#0078D4]"
                      } ${isEmpty ? "text-[#8a919e]" : ""}`}
                    >
                      {row.ip}
                    </TableCell>
                    <TableCell
                      className={`text-sm tabular-nums ${
                        theme === "dark" ? "text-[#e3e2e1]" : "text-[#1a1c1c]"
                      } ${isEmpty ? "text-[#8a919e]" : ""}`}
                    >
                      {isEmpty ? "-" : row.packets.toLocaleString()}
                    </TableCell>
                    <TableCell
                      className={`text-sm tabular-nums ${
                        theme === "dark" ? "text-[#e3e2e1]" : "text-[#1a1c1c]"
                      } ${isEmpty ? "text-[#8a919e]" : ""}`}
                    >
                      {isEmpty ? "-" : `${(row.bytes / 1024 / 1024).toFixed(2)} MB`}
                    </TableCell>
                    <TableCell>
                      <span
                        className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold"
                        style={isEmpty ? {} : { backgroundColor: colors.bg, color: colors.text }}
                      >
                        {isEmpty ? "-" : row.protocol}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}