import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { invoke } from "@tauri-apps/api/core";

export interface Packet {
  id: string;
  timestamp: number;
  source_ip: string;
  source_port: number;
  dest_ip: string;
  dest_port: number;
  protocol: string;
  length: number;
  info: string;
}

export interface TrafficStats {
  bandwidth: number;
  packet_rate: number;
  active_ips: number;
  total_bytes: number;
  packets: number;
}

export interface IPFlow {
  ip: string;
  packets: number;
  bytes: number;
  port: number;
  protocol: string;
  last_seen: number;
}

export interface PortTraffic {
  port: number;
  bytes: number;
  packets: number;
  is_anomalous: boolean;
  detected_at: number;
}

export interface ProtocolStats {
  name: string;
  value: number;
}

export interface BandwidthPoint {
  time: number;
  download: number;
  upload: number;
}

export interface TrafficDataContextType {
  packets: Packet[];
  stats: TrafficStats;
  topIPs: IPFlow[];
  protocolDistribution: { name: string; value: number }[];
  bandwidthHistory: BandwidthPoint[];
  isGeneratorRunning: boolean;
  generatorPackets: number;
  generatorBytes: number;
  generatorDownload: number;
  generatorUpload: number;
  generatorStartTime: number | null;
  portTraffic: PortTraffic[];
  activeThreats: number;
  resetGeneratorStats: () => void;
  startGenerator: () => void;
  stopGenerator: () => void;
}

const TrafficDataContext = createContext<TrafficDataContextType | null>(null);

export function useTrafficDataContext() {
  const context = useContext(TrafficDataContext);
  if (!context) {
    throw new Error(
      "useTrafficDataContext must be used within TrafficDataProvider",
    );
  }
  return context;
}

export function TrafficDataProvider({ children }: { children: ReactNode }) {
  const [packets, setPackets] = useState<Packet[]>([]);
  const [stats, setStats] = useState<TrafficStats>({
    bandwidth: 0,
    packet_rate: 0,
    active_ips: 0,
    total_bytes: 0,
    packets: 0,
  });
  const [topIPs, setTopIPs] = useState<IPFlow[]>([]);
  const [protocolDistribution, setProtocolDistribution] = useState<
    { name: string; value: number }[]
  >([{ name: "No Data", value: 100 }]);
  const [bandwidthHistory, setBandwidthHistory] = useState<BandwidthPoint[]>(
    [],
  );
  const [isGeneratorRunning, setIsGeneratorRunning] = useState(false);
  const [generatorPackets, setGeneratorPackets] = useState(0);
  const [generatorBytes, setGeneratorBytes] = useState(0);
  const [generatorDownload, setGeneratorDownload] = useState(0);
  const [generatorUpload, setGeneratorUpload] = useState(0);
  const [generatorStartTime, setGeneratorStartTime] = useState<number | null>(
    null,
  );
  const [portTraffic, setPortTraffic] = useState<PortTraffic[]>([]);
  const [activeThreats, setActiveThreats] = useState(0);

  const fetchData = useCallback(async () => {
    try {
      const [
        packetsData,
        statsData,
        ipFlowsData,
        protocolData,
        bandwidthData,
        portData,
      ] = await Promise.all([
        invoke<Packet[]>("get_packets", { limit: 50 }),
        invoke<TrafficStats>("get_stats"),
        invoke<IPFlow[]>("get_ip_flows"),
        invoke<ProtocolStats[]>("get_protocol_distribution"),
        invoke<BandwidthPoint[]>("get_bandwidth_history"),
        invoke<PortTraffic[]>("get_port_traffic"),
      ]);

      setPackets(packetsData);
      setStats(statsData);
      setTopIPs(ipFlowsData);

      const total = protocolData.reduce((sum, p) => sum + p.value, 0);
      if (total > 0) {
        setProtocolDistribution(
          protocolData
            .map((p) => ({
              name: p.name,
              value: Math.round((p.value / total) * 100),
            }))
            .filter((p) => p.value > 0),
        );
      }

      setBandwidthHistory(bandwidthData);
      setPortTraffic(portData);

      const anomalous = portData.filter((p) => p.is_anomalous);
      setActiveThreats(anomalous.length);

      setGeneratorPackets(statsData.packets);
      setGeneratorBytes(statsData.total_bytes);
      setGeneratorDownload(Math.floor(statsData.total_bytes * 0.8));
      setGeneratorUpload(Math.floor(statsData.total_bytes * 0.2));
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  }, []);

  const startGenerator = useCallback(async () => {
    try {
      await invoke("start_gen");
      setIsGeneratorRunning(true);
      setGeneratorStartTime(Date.now());
    } catch (error) {
      console.error("Failed to start generator:", error);
    }
  }, []);

  const stopGenerator = useCallback(async () => {
    try {
      await invoke("stop_gen");
      setIsGeneratorRunning(false);
    } catch (error) {
      console.error("Failed to stop generator:", error);
    }
  }, []);

  const resetGeneratorStats = useCallback(async () => {
    try {
      await invoke("reset_capture");
      setPackets([]);
      setStats({
        bandwidth: 0,
        packet_rate: 0,
        active_ips: 0,
        total_bytes: 0,
        packets: 0,
      });
      setTopIPs([]);
      setProtocolDistribution([{ name: "No Data", value: 100 }]);
      setBandwidthHistory([]);
      setPortTraffic([]);
      setActiveThreats(0);
      setGeneratorPackets(0);
      setGeneratorBytes(0);
      setGeneratorDownload(0);
      setGeneratorUpload(0);
      setGeneratorStartTime(null);
      setIsGeneratorRunning(false);
    } catch (error) {
      console.error("Failed to reset:", error);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(fetchData, 1000);
    return () => clearInterval(interval);
  }, [fetchData]);

  useEffect(() => {
    invoke<boolean>("is_generating")
      .then(setIsGeneratorRunning)
      .catch(console.error);
  }, []);

  return (
    <TrafficDataContext.Provider
      value={{
        packets,
        stats,
        topIPs,
        protocolDistribution,
        bandwidthHistory,
        isGeneratorRunning,
        generatorPackets,
        generatorBytes,
        generatorDownload,
        generatorUpload,
        generatorStartTime,
        portTraffic,
        activeThreats,
        resetGeneratorStats,
        startGenerator,
        stopGenerator,
      }}
    >
      {children}
    </TrafficDataContext.Provider>
  );
}
