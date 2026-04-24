import { useTheme } from "@/context/ThemeContext";
import { Card, CardContent } from "@/components/ui/card";

interface MetricsCardProps {
  title: string;
  value: string;
  unit: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  icon: "bandwidth" | "packets" | "ips";
  loading?: boolean;
}

function BandwidthIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" fill="none" stroke="#0078D4" />
    </svg>
  );
}

function PacketsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="10" rx="2" fill="none" stroke="#0078D4" />
      <path d="M6 7V3M18 7V3M6 17v4M18 17v4" stroke="#0078D4" />
      <path d="M8 7v10M16 7v10" stroke="#0078D4" opacity="0.5" />
    </svg>
  );
}

function IPsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" fill="none" stroke="#0078D4" />
      <circle cx="5" cy="8" r="2" fill="none" stroke="#0078D4" />
      <circle cx="19" cy="8" r="2" fill="none" stroke="#0078D4" />
      <circle cx="5" cy="16" r="2" fill="none" stroke="#0078D4" />
      <circle cx="19" cy="16" r="2" fill="none" stroke="#0078D4" />
      <path d="M8 8h8M8 16h8" stroke="#0078D4" opacity="0.5" />
    </svg>
  );
}

const iconMap = {
  bandwidth: BandwidthIcon,
  packets: PacketsIcon,
  ips: IPsIcon,
};

export function MetricsCard({ title, value, unit, trend, trendValue, icon, loading }: MetricsCardProps) {
  const { theme } = useTheme();
  const IconComponent = iconMap[icon];

  if (loading) {
    return (
      <Card className={`p-5 ${theme === "dark" ? "bg-[#1a1c1c] border-[#343535]" : "bg-white border-[#dcdbda]"}`}>
        <CardContent className="p-0 flex items-start justify-between">
          <div className="space-y-3">
            <div className={`h-3 w-20 rounded ${theme === "dark" ? "bg-[#292a2a]" : "bg-[#e8e7e6]"}`} />
            <div className={`h-8 w-28 rounded ${theme === "dark" ? "bg-[#292a2a]" : "bg-[#e8e7e6]"}`} />
            <div className={`h-3 w-16 rounded ${theme === "dark" ? "bg-[#292a2a]" : "bg-[#e8e7e6]"}`} />
          </div>
          <div className={`h-12 w-12 rounded-xl ${theme === "dark" ? "bg-[#292a2a]" : "bg-[#e8e7e6]"}`} />
        </CardContent>
      </Card>
    );
  }

  const trendColor =
    trend === "up"
      ? "#6ccb5f"
      : trend === "down"
      ? "#ffb4ab"
      : theme === "dark"
      ? "#c0c7d4"
      : "#5c5f60";

  return (
    <Card
      className={`p-5 card-hover border-glow ${
        theme === "dark"
          ? "bg-[#1a1c1c]/80 border-[#343535]"
          : "bg-white/80 border-[#dcdbda]"
      }`}
      style={{ backdropFilter: "blur(20px)" }}
    >
      <CardContent className="p-0 flex items-start justify-between">
        <div className="space-y-2">
          <p className={`text-xs font-medium uppercase tracking-wider ${theme === "dark" ? "text-[#8a919e]" : "text-[#8a919e]"}`}>
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <span
              className={`text-3xl font-semibold tabular-nums ${theme === "dark" ? "text-[#e3e2e1]" : "text-[#1a1c1c]"}`}
              style={{ fontFamily: "var(--font-sans)" }}
            >
              {value}
            </span>
            <span className={`text-base font-medium ${theme === "dark" ? "text-[#c0c7d4]" : "text-[#5c5f60]"}`}>
              {unit}
            </span>
          </div>
          {trend && trendValue && (
            <div className="flex items-center gap-1.5 text-sm">
              <span style={{ color: trendColor, fontSize: "12px" }}>
                {trend === "up" ? "↑" : trend === "down" ? "↓" : "●"}
              </span>
              <span style={{ color: trendColor }}>{trendValue}</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl flex items-center justify-center ${theme === "dark" ? "bg-[#0078D4]/15" : "bg-[#0078D4]/10"}`}>
          <IconComponent />
        </div>
      </CardContent>
    </Card>
  );
}