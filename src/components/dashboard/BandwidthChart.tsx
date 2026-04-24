import { useTheme } from "@/context/ThemeContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface DataPoint {
  time: number;
  download: number;
  upload: number;
}

interface BandwidthChartProps {
  data?: DataPoint[];
  height?: number;
}

export function BandwidthChart({ data, height = 220 }: BandwidthChartProps) {
  const { theme } = useTheme();

  const chartData = data && data.length > 0 ? data : Array.from({ length: 30 }, (_, i) => ({
    time: i,
    download: 0,
    upload: 0,
  }));

  const gridColor = theme === "dark" ? "#343535" : "#dcdbda";
  const textColor = theme === "dark" ? "#8a919e" : "#8a919e";
  const tooltipBg = theme === "dark" ? "#1a1c1c" : "#ffffff";
  const tooltipBorder = theme === "dark" ? "#343535" : "#dcdbda";

  return (
    <Card
      className={`p-5 card-hover border-glow ${
        theme === "dark" ? "bg-[#1a1c1c]/80 border-[#343535]" : "bg-white/80 border-[#dcdbda]"
      }`}
      style={{ backdropFilter: "blur(20px)" }}
    >
      <CardHeader className="p-0 pb-4 flex flex-row items-center justify-between">
        <CardTitle
          className={`text-sm font-semibold ${
            theme === "dark" ? "text-[#e3e2e1]" : "text-[#1a1c1c]"
          }`}
        >
          Bandwidth
        </CardTitle>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className={`w-6 h-1 rounded-full`} style={{ background: "#0078D4" }} />
            <span className={theme === "dark" ? "text-[#c0c7d4]" : "text-[#5c5f60]"}>Download</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`w-6 h-1 rounded-full`} style={{ background: "#6ccb5f" }} />
            <span className={theme === "dark" ? "text-[#c0c7d4]" : "text-[#5c5f60]"}>Upload</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ResponsiveContainer width="100%" height={height}>
          <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="downloadGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0078D4" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#0078D4" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="uploadGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6ccb5f" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#6ccb5f" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 11, fill: textColor }}
              axisLine={{ stroke: gridColor }}
              tickLine={{ stroke: gridColor }}
              tickFormatter={(v) => (v % 10 === 0 ? `${30 - v}s` : "")}
            />
            <YAxis
              tick={{ fontSize: 11, fill: textColor }}
              axisLine={{ stroke: gridColor }}
              tickLine={{ stroke: gridColor }}
              tickFormatter={(v) => `${v} MB`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: tooltipBg,
                border: `1px solid ${tooltipBorder}`,
                borderRadius: 12,
                fontSize: 12,
                boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
              }}
              labelStyle={{
                color: theme === "dark" ? "#e3e2e1" : "#1a1c1c",
                fontWeight: 600,
                marginBottom: 4,
              }}
              itemStyle={{ color: textColor }}
              formatter={(value) => [`${Number(value).toFixed(2)} MB`, " bandwidth"]}
            />
            <Area
              type="monotone"
              dataKey="download"
              stroke="#0078D4"
              strokeWidth={2.5}
              fill="url(#downloadGradient)"
              dot={false}
              activeDot={{ r: 5, fill: "#0078D4", stroke: tooltipBg, strokeWidth: 2 }}
            />
            <Area
              type="monotone"
              dataKey="upload"
              stroke="#6ccb5f"
              strokeWidth={2.5}
              fill="url(#uploadGradient)"
              dot={false}
              activeDot={{ r: 5, fill: "#6ccb5f", stroke: tooltipBg, strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}