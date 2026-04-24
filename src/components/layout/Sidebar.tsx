import { useState } from "react";
import { LayoutDashboard, Activity, Send, Settings, ChevronLeft, ChevronRight, Shield, Radio } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/context/ThemeContext";

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "monitor", label: "Live Monitor", icon: Activity },
  { id: "generator", label: "Traffic Generator", icon: Send },
  { id: "threat", label: "Threat Intel", icon: Shield },
  { id: "settings", label: "Settings", icon: Settings },
];

interface SidebarProps {
  activeItem: string;
  onItemClick: (id: string) => void;
}

export function Sidebar({ activeItem, onItemClick }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const { theme } = useTheme();

  return (
    <aside
      className={cn(
        "relative flex flex-col h-screen transition-all duration-300 ease-out",
        collapsed ? "w-16" : "w-60",
        theme === "dark"
          ? "bg-[#1e2020]/95 border-r border-[#343535]"
          : "bg-white/95 border-r border-[#dcdbda]"
      )}
      style={{
        backdropFilter: "blur(40px)",
      }}
    >
      <div
        className={cn(
          "flex items-center h-16 px-4 border-b border-inherit",
          theme === "dark" ? "border-[#343535]" : "border-[#dcdbda]"
        )}
      >
        <span
          className={cn(
            "font-bold text-xl tracking-tight",
            theme === "dark" ? "text-[#e3e2e1]" : "text-[#1a1c1c]"
          )}
        >
          NetTra
        </span>
        <span
          className="text-xl font-bold"
          style={{ color: "#0078D4" }}
        >
          .
        </span>
      </div>

      <nav className="flex-1 py-4 px-2 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onItemClick(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200",
                collapsed && "justify-center px-2",
                isActive
                  ? "bg-[#0078D4] text-white shadow-lg shadow-[#0078D4]/20"
                  : theme === "dark"
                  ? "text-[#c0c7d4] hover:bg-[#292a2a] hover:text-[#e3e2e1] active:scale-[0.98]"
                  : "text-[#5c5f60] hover:bg-[#e8e7e6] hover:text-[#1a1c1c] active:scale-[0.98]"
              )}
            >
              <Icon
                className={cn(
                  "size-5 shrink-0 transition-transform duration-200",
                  isActive ? "scale-110" : ""
                )}
              />
              {!collapsed && (
                <span className="text-sm font-medium">{item.label}</span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-inherit">
        <div
          className={cn(
            "p-3 rounded-xl",
            theme === "dark" ? "bg-[#292a2a]" : "bg-[#e8e7e6]"
          )}
        >
          <div className="flex items-center gap-2 mb-2">
            <Radio
              className="size-4 animate-pulse-glow"
              style={{ color: "#6ccb5f" }}
            />
            {!collapsed && (
              <span
                className={cn(
                  "text-xs font-medium",
                  theme === "dark" ? "text-[#6ccb5f]" : "text-[#6ccb5f]"
                )}
              >
                Capture Active
              </span>
            )}
          </div>
          {!collapsed && (
            <p
              className={cn(
                "text-xs",
                theme === "dark" ? "text-[#8a919e]" : "text-[#8a919e]"
              )}
            >
              eth0 • 192.168.1.100
            </p>
          )}
        </div>
      </div>

      <button
        onClick={() => setCollapsed(!collapsed)}
        className={cn(
          "absolute -right-3 top-20 w-6 h-6 rounded-full flex items-center justify-center border transition-all duration-200 hover:scale-110",
          theme === "dark"
            ? "bg-[#292a2a] border-[#343535] text-[#c0c7d4] hover:bg-[#0078D4] hover:border-[#0078D4] hover:text-white"
            : "bg-white border-[#dcdbda] text-[#5c5f60] hover:bg-[#0078D4] hover:border-[#0078D4] hover:text-white"
        )}
      >
        {collapsed ? (
          <ChevronRight className="size-3" />
        ) : (
          <ChevronLeft className="size-3" />
        )}
      </button>
    </aside>
  );
}