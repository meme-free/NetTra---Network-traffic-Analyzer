import { Moon, Sun, Radio } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { Switch } from "@/components/ui/switch";
import { useTrafficDataContext } from "@/hooks/useTrafficData";

export function StatusBar() {
  const { theme, toggleTheme } = useTheme();
  const { stats, isGeneratorRunning } = useTrafficDataContext();

  return (
    <footer className={`h-8 px-4 flex items-center justify-between border-t text-xs ${theme === "dark" ? "bg-[#1e2020]/95 border-[#343535] text-[#c0c7d4]" : "bg-white/95 border-[#dcdbda] text-[#5c5f60]"}`}
      style={{ backdropFilter: "blur(20px)" }}>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <Radio className="size-3" style={{ color: isGeneratorRunning ? (theme === "dark" ? "#6ccb5f" : "#6ccb5f") : "#8a919e" }} />
          <span className="text-xs font-medium" style={{ color: isGeneratorRunning ? (theme === "dark" ? "#6ccb5f" : "#6ccb5f") : "#8a919e" }}>
            {isGeneratorRunning ? "Live" : "Idle"}
          </span>
        </div>
        <span className="text-[#8a919e]">|</span>
        <span className="tabular-nums">{stats.bandwidth.toFixed(1)} MB/s</span>
        <span className="text-[#8a919e]">|</span>
        <span className="tabular-nums">{stats.packet_rate.toLocaleString()} pkt/s</span>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5">
          <Sun className="size-3" />
          <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} className="scale-75" />
          <Moon className="size-3" />
        </div>
      </div>
    </footer>
  );
}