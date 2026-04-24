import { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { Card, CardContent } from "@/components/ui/card";
import { BandwidthChart } from "@/components/dashboard/BandwidthChart";
import { TopIPsTable } from "@/components/dashboard/TopIPsTable";

export function TrafficAnalysis() {
  const { theme } = useTheme();
  const [timeRange, setTimeRange] = useState("1h");

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b" style={{ borderColor: theme === "dark" ? "#343535" : "#dcdbda" }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-2xl font-semibold ${theme === "dark" ? "text-[#e3e2e1]" : "text-[#1a1c1c]"}`}>
              Traffic Analysis
            </h1>
            <p className={`text-sm mt-1 ${theme === "dark" ? "text-[#8a919e]" : "text-[#8a919e]"}`}>
              Deep packet inspection and analysis
            </p>
          </div>
          <div className="flex gap-2">
            {["15m", "30m", "1h", "6h", "24h"].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  timeRange === range
                    ? "bg-[#0078D4] text-white"
                    : theme === "dark"
                    ? "bg-[#292a2a] text-[#c0c7d4] hover:bg-[#343535]"
                    : "bg-[#e8e7e6] text-[#5c5f60] hover:bg-[#dcdbda]"
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 p-6 space-y-6 overflow-auto">
        <div className="grid grid-cols-4 gap-4">
          <Card className={`p-4 ${theme === "dark" ? "bg-[#1a1c1c]/80" : "bg-white/80"}`}>
            <CardContent className="p-0">
              <p className={`text-3xl font-semibold ${theme === "dark" ? "text-[#e3e2e1]" : "text-[#1a1c1c]"}`}>
                2.4 GB
              </p>
              <p className={`text-xs ${theme === "dark" ? "text-[#8a919e]" : "text-[#8a919e]"}`}>
                Total Traffic
              </p>
            </CardContent>
          </Card>
          <Card className={`p-4 ${theme === "dark" ? "bg-[#1a1c1c]/80" : "bg-white/80"}`}>
            <CardContent className="p-0">
              <p className={`text-3xl font-semibold ${theme === "dark" ? "text-[#e3e2e1]" : "text-[#1a1c1c]"}`}>
                847K
              </p>
              <p className={`text-xs ${theme === "dark" ? "text-[#8a919e]" : "text-[#8a919e]"}`}>
                Total Packets
              </p>
            </CardContent>
          </Card>
          <Card className={`p-4 ${theme === "dark" ? "bg-[#1a1c1c]/80" : "bg-white/80"}`}>
            <CardContent className="p-0">
              <p className={`text-3xl font-semibold ${theme === "dark" ? "text-[#e3e2e1]" : "text-[#1a1c1c]"}`}>
                156
              </p>
              <p className={`text-xs ${theme === "dark" ? "text-[#8a919e]" : "text-[#8a919e]"}`}>
                Unique IPs
              </p>
            </CardContent>
          </Card>
          <Card className={`p-4 ${theme === "dark" ? "bg-[#1a1c1c]/80" : "bg-white/80"}`}>
            <CardContent className="p-0">
              <p className={`text-3xl font-semibold ${theme === "dark" ? "text-[#e3e2e1]" : "text-[#1a1c1c]"}`}>
                65%
              </p>
              <p className={`text-xs ${theme === "dark" ? "text-[#8a919e]" : "text-[#8a919e]"}`}>
                TCP Protocol
              </p>
            </CardContent>
          </Card>
        </div>

        <BandwidthChart height={280} />
        <TopIPsTable />
      </div>
    </div>
  );
}