import { useTheme } from "@/context/ThemeContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface ProtocolData {
  name: string;
  value: number;
  color?: string;
}

interface ProtocolPieChartProps {
  data?: ProtocolData[];
  height?: number;
}

const defaultColors: Record<string, string> = {
  TCP: "#0078D4",
  UDP: "#6ccb5f",
  DNS: "#a3c9ff",
  ICMP: "#ffb689",
  HTTPS: "#0078D4",
  ARP: "#c0c7d4",
  "No Data": "#8a919e",
};

export function ProtocolPieChart({ data, height = 220 }: ProtocolPieChartProps) {
  const { theme } = useTheme();

  const chartData = data && data.length > 0 && data.some(d => d.value > 0)
    ? data.map((d) => ({
        ...d,
        color: d.color || defaultColors[d.name] || "#8a919e",
      }))
    : [
        { name: "No Data", value: 100, color: "#8a919e" },
      ];

  const tooltipBg = theme === "dark" ? "#1a1c1c" : "#ffffff";
  const tooltipBorder = theme === "dark" ? "#343535" : "#dcdbda";

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
          Protocol Distribution
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ResponsiveContainer width="100%" height={height}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="45%"
              innerRadius={55}
              outerRadius={75}
              paddingAngle={3}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  stroke="transparent"
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: tooltipBg,
                border: `1px solid ${tooltipBorder}`,
                borderRadius: 12,
                fontSize: 12,
                boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
              }}
              formatter={(value) => [`${value}%`, " percentage"]}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value) => (
                <span
                  className="text-sm"
                  style={{
                    color: theme === "dark" ? "#c0c7d4" : "#5c5f60",
                  }}
                >
                  {value}
                </span>
              )}
              iconType="square"
              iconSize={10}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}