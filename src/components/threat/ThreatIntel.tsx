import { useTheme } from "@/context/ThemeContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, AlertTriangle, Globe, Server } from "lucide-react";
import { useTrafficDataContext } from "@/hooks/useTrafficData";

const severityColors: Record<string, { bg: string; text: string; border: string }> = {
  critical: { bg: "rgba(255,180,171,0.2)", text: "#ffb4ab", border: "#ffb4ab" },
  high: { bg: "rgba(255,182,137,0.2)", text: "#ffb689", border: "#ffb689" },
  medium: { bg: "rgba(255,220,100,0.2)", text: "#ffdc64", border: "#ffdc64" },
  low: { bg: "rgba(108,203,95,0.2)", text: "#6ccb5f", border: "#6ccb5f" },
};

function getAnomalyType(port: number, bytes: number, packets: number): { severity: string; title: string; description: string } {
  const mbPerSec = bytes / 1024 / 1024;
  
  if (mbPerSec > 10) {
    return {
      severity: "critical",
      title: "Massive Data Transfer",
      description: `${mbPerSec.toFixed(2)} MB/s detected on port ${port}`,
    };
  }
  
  if (port === 445 || port === 139 || port === 135) {
    return {
      severity: "critical",
      title: "SMB/Anomalous Activity",
      description: `High traffic on Windows file sharing port ${port}`,
    };
  }
  
  if (port === 22 || port === 23) {
    return {
      severity: "high",
      title: "SSH/Telnet Activity",
      description: `Unusual traffic on port ${port} (remote access)`,
    };
  }
  
  if (mbPerSec > 1) {
    return {
      severity: "high",
      title: "High Bandwidth Transfer",
      description: `${mbPerSec.toFixed(2)} MB/s on port ${port}`,
    };
  }
  
  if (packets > 500) {
    return {
      severity: "medium",
      title: "High Packet Rate",
      description: `${packets} packets on port ${port}`,
    };
  }
  
  return {
    severity: "low",
    title: "Detected Traffic",
    description: `Traffic on port ${port} (${packets} packets, ${(bytes / 1024).toFixed(1)} KB)`,
  };
}

export function ThreatIntel() {
  const { theme } = useTheme();
  const { portTraffic, activeThreats } = useTrafficDataContext();

  const anomalousPorts = portTraffic.filter(
    (p) => p.bytes > 10000 || p.packets > 50
  );

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b" style={{ borderColor: theme === "dark" ? "#343535" : "#dcdbda" }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-2xl font-semibold ${theme === "dark" ? "text-[#e3e2e1]" : "text-[#1a1c1c]"}`}>
              Threat Intel
            </h1>
            <p className={`text-sm mt-1 ${theme === "dark" ? "text-[#8a919e]" : "text-[#8a919e]"}`}>
              Real-time network traffic analysis
            </p>
          </div>
          {anomalousPorts.length > 0 && (
            <div className={`px-4 py-2 rounded-xl flex items-center gap-2 ${severityColors.critical.bg}`}>
              <AlertTriangle className="size-5" style={{ color: severityColors.critical.text }} />
              <span className={`font-semibold ${theme === "dark" ? "text-[#e3e2e1]" : "text-[#1a1c1c]"}`}>
                {anomalousPorts.length} Anomalies
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 p-6 space-y-6 overflow-auto">
        <div className="grid grid-cols-4 gap-4">
          <Card className={`p-4 ${theme === "dark" ? "bg-[#1a1c1c]/80" : "bg-white/80"}`}>
            <CardContent className="p-0 flex items-center justify-between">
              <div>
                <p className={`text-2xl font-semibold ${theme === "dark" ? "text-[#e3e2e1]" : "text-[#1a1c1c]"}`}>
                  {portTraffic.length}
                </p>
                <p className={`text-xs ${theme === "dark" ? "text-[#8a919e]" : "text-[#8a919e]"}`}>Active Ports</p>
              </div>
              <Shield className="size-8" style={{ color: "#0078D4" }} />
            </CardContent>
          </Card>
          
          <Card className={`p-4 ${theme === "dark" ? "bg-[#1a1c1c]/80" : "bg-white/80"}`}>
            <CardContent className="p-0 flex items-center justify-between">
              <div>
                <p className={`text-2xl font-semibold ${theme === "dark" ? "text-[#e3e2e1]" : "text-[#1a1c1c]"}`}>
                  {anomalousPorts.length}
                </p>
                <p className={`text-xs ${theme === "dark" ? "text-[#8a919e]" : "text-[#8a919e]"}`}>Anomalous Ports</p>
              </div>
              <Server className="size-8" style={{ color: "#6ccb5f" }} />
            </CardContent>
          </Card>
          
          <Card className={`p-4 ${theme === "dark" ? "bg-[#1a1c1c]/80" : "bg-white/80"}`}>
            <CardContent className="p-0 flex items-center justify-between">
              <div>
                <p className={`text-2xl font-semibold ${theme === "dark" ? "text-[#e3e2e1]" : "text-[#1a1c1c]"}`}>
                  {activeThreats}
                </p>
                <p className={`text-xs ${theme === "dark" ? "text-[#8a919e]" : "text-[#8a919e]"}`}>Active Alerts</p>
              </div>
              <AlertTriangle className="size-8" style={{ color: "#ffb689" }} />
            </CardContent>
          </Card>
          
          <Card className={`p-4 ${theme === "dark" ? "bg-[#1a1c1c]/80" : "bg-white/80"}`}>
            <CardContent className="p-0 flex items-center justify-between">
              <div>
                <p className={`text-2xl font-semibold ${theme === "dark" ? "text-[#e3e2e1]" : "text-[#1a1c1c]"}`}>
                  1
                </p>
                <p className={`text-xs ${theme === "dark" ? "text-[#8a919e]" : "text-[#8a919e]"}`}>Countries</p>
              </div>
              <Globe className="size-8" style={{ color: "#a3c9ff" }} />
            </CardContent>
          </Card>
        </div>

        <Card className={`p-5 ${theme === "dark" ? "bg-[#1a1c1c]/80" : "bg-white/80"}`}>
          <CardHeader className="p-0 pb-4">
            <CardTitle className={`text-sm font-semibold ${theme === "dark" ? "text-[#e3e2e1]" : "text-[#1a1c1c]"}`}>
              Port Traffic Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 space-y-3">
            {portTraffic.length === 0 ? (
              <p className={`text-sm py-8 text-center ${theme === "dark" ? "text-[#8a919e]" : "text-[#8a919e]"}`}>
                Start capture to monitor port traffic.
              </p>
            ) : (
              portTraffic.slice(0, 20).map((port) => {
                const anomaly = getAnomalyType(port.port, port.bytes, port.packets);
                const colors = severityColors[anomaly.severity];
                const isAnomalous = port.bytes > 10000 || port.packets > 50;
                
                return (
                  <div
                    key={port.port}
                    className={`p-4 rounded-xl border transition-all hover:scale-[1.01] cursor-pointer ${
                      theme === "dark" 
                        ? "bg-[#1a1c1c] border-[#343535] hover:border-[#0078D4]" 
                        : "bg-white border-[#dcdbda] hover:border-[#0078D4]"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        {isAnomalous && (
                          <div className={`p-2 rounded-lg ${colors.bg}`}>
                            <AlertTriangle className="size-5" style={{ color: colors.text }} />
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className={`font-semibold ${theme === "dark" ? "text-[#e3e2e1]" : "text-[#1a1c1c]"}`}>
                              Port {port.port}
                            </h3>
                            {isAnomalous && (
                              <span
                                className={`px-2 py-0.5 rounded-full text-xs font-medium uppercase`}
                                style={{ backgroundColor: colors.bg, color: colors.text }}
                              >
                                {anomaly.severity}
                              </span>
                            )}
                          </div>
                          <p className={`text-sm ${theme === "dark" ? "text-[#c0c7d4]" : "text-[#5c5f60]"}`}>
                            {anomaly.title}: {anomaly.description}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-xs" style={{ color: theme === "dark" ? "#8a919e" : "#8a919e" }}>
                            <span>{port.packets} packets</span>
                            <span>•</span>
                            <span>{(port.bytes / 1024).toFixed(1)} KB</span>
                            <span>•</span>
                            <span>{(port.bytes / 1024 / 0.5).toFixed(1)} KB/s</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}