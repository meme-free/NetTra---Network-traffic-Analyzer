import { useTheme } from "@/context/ThemeContext";
import { MetricsCard } from "./MetricsCard";
import { BandwidthChart } from "./BandwidthChart";
import { ProtocolPieChart } from "./ProtocolPieChart";
import { TopIPsTable } from "./TopIPsTable";
import { useTrafficDataContext } from "@/hooks/useTrafficData";

export function Dashboard() {
  const { theme } = useTheme();
  const { stats, protocolDistribution, bandwidthHistory, topIPs, isGeneratorRunning } = useTrafficDataContext();

  const formatBandwidth = (val: number) => val.toFixed(1);
  const formatRate = (val: number) => val.toLocaleString();

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className={`text-2xl font-semibold ${theme === "dark" ? "text-[#e3e2e1]" : "text-[#1a1c1c]"}`}>
          Dashboard
        </h1>
        <p className={`text-sm mt-1 ${theme === "dark" ? "text-[#8a919e]" : "text-[#8a919e]"}`}>
          Real-time network traffic overview
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <MetricsCard
          title="Bandwidth"
          value={formatBandwidth(stats.bandwidth)}
          unit="MB/s"
          trend={isGeneratorRunning ? "up" : "neutral"}
          trendValue={isGeneratorRunning ? "Active" : "Idle"}
          icon="bandwidth"
        />
        <MetricsCard
          title="Packet Rate"
          value={formatRate(stats.packet_rate)}
          unit="pkt/s"
          trend="neutral"
          trendValue={isGeneratorRunning ? "Active" : "Idle"}
          icon="packets"
        />
        <MetricsCard
          title="Active IPs"
          value={formatRate(stats.active_ips || 0)}
          unit=""
          trend="up"
          trendValue="Connected"
          icon="ips"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <BandwidthChart data={bandwidthHistory} />
        </div>
        <ProtocolPieChart data={protocolDistribution} />
      </div>

      <TopIPsTable data={topIPs} />
    </div>
  );
}