import { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Moon, Sun, Bell, Database } from "lucide-react";

export function Settings() {
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState({
    threatAlerts: true,
    captureEvents: true,
    systemUpdates: true,
  });

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b" style={{ borderColor: theme === "dark" ? "#343535" : "#dcdbda" }}>
        <h1 className={`text-2xl font-semibold ${theme === "dark" ? "text-[#e3e2e1]" : "text-[#1a1c1c]"}`}>
          Settings
        </h1>
        <p className={`text-sm mt-1 ${theme === "dark" ? "text-[#8a919e]" : "text-[#8a919e]"}`}>
          Application preferences and configuration
        </p>
      </div>

      <div className="flex-1 p-6 space-y-6 overflow-auto">
        <Card className={`p-5 ${theme === "dark" ? "bg-[#1a1c1c]/80" : "bg-white/80"}`}>
          <CardHeader className="p-0 pb-4">
            <CardTitle className="flex items-center gap-2">
              <Sun className="size-5" style={{ color: "#0078D4" }} />
              <span className={theme === "dark" ? "text-[#e3e2e1]" : "text-[#1a1c1c]"}>
                Appearance
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className={`font-medium ${theme === "dark" ? "text-[#e3e2e1]" : "text-[#1a1c1c]"}`}>
                  Theme
                </p>
                <p className={`text-sm ${theme === "dark" ? "text-[#8a919e]" : "text-[#8a919e]"}`}>
                  Choose your preferred color scheme
                </p>
              </div>
              <div className="flex gap-2">
                {[
                  { id: "light", icon: Sun, label: "Light" },
                  { id: "dark", icon: Moon, label: "Dark" },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id as "light" | "dark")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                      theme === t.id
                        ? "bg-[#0078D4] text-white"
                        : theme === "dark"
                        ? "bg-[#292a2a] text-[#c0c7d4] hover:bg-[#343535]"
                        : "bg-[#e8e7e6] text-[#5c5f60] hover:bg-[#dcdbda]"
                    }`}
                  >
                    <t.icon className="size-4" />
                    <span className="text-sm font-medium">{t.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={`p-5 ${theme === "dark" ? "bg-[#1a1c1c]/80" : "bg-white/80"}`}>
          <CardHeader className="p-0 pb-4">
            <CardTitle className="flex items-center gap-2">
              <Bell className="size-5" style={{ color: "#0078D4" }} />
              <span className={theme === "dark" ? "text-[#e3e2e1]" : "text-[#1a1c1c]"}>
                Notifications
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 space-y-4">
            {[
              { 
                key: "threatAlerts", 
                label: "Threat Alerts", 
                description: "Get notified about security threats",
                checked: notifications.threatAlerts,
              },
              { 
                key: "captureEvents", 
                label: "Capture Events", 
                description: "Notifications when capture starts/stops",
                checked: notifications.captureEvents,
              },
              { 
                key: "systemUpdates", 
                label: "System Updates", 
                description: "Check for updates automatically",
                checked: notifications.systemUpdates,
              },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between">
                <div>
                  <p className={`font-medium ${theme === "dark" ? "text-[#e3e2e1]" : "text-[#1a1c1c]"}`}>
                    {item.label}
                  </p>
                  <p className={`text-sm ${theme === "dark" ? "text-[#8a919e]" : "text-[#8a919e]"}`}>
                    {item.description}
                  </p>
                </div>
                <Switch 
                  checked={item.checked}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, [item.key]: checked }))} 
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className={`p-5 ${theme === "dark" ? "bg-[#1a1c1c]/80" : "bg-white/80"}`}>
          <CardHeader className="p-0 pb-4">
            <CardTitle className="flex items-center gap-2">
              <Database className="size-5" style={{ color: "#0078D4" }} />
              <span className={theme === "dark" ? "text-[#e3e2e1]" : "text-[#1a1c1c]"}>
                Data Storage
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className={`font-medium ${theme === "dark" ? "text-[#e3e2e1]" : "text-[#1a1c1c]"}`}>
                  Compression
                </p>
                <p className={`text-sm ${theme === "dark" ? "text-[#8a919e]" : "text-[#8a919e]"}`}>
                  Compress captured data to save space
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className={`font-medium ${theme === "dark" ? "text-[#e3e2e1]" : "text-[#1a1c1c]"}`}>
                  Max Log Size
                </p>
                <p className={`text-sm ${theme === "dark" ? "text-[#8a919e]" : "text-[#8a919e]"}`}>
                  100 MB
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}