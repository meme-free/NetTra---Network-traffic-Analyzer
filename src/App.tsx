import { useState } from "react";
import { ThemeProvider } from "@/context/ThemeContext";
import { TrafficDataProvider } from "@/hooks/useTrafficData";
import { Sidebar } from "@/components/layout/Sidebar";
import { StatusBar } from "@/components/layout/StatusBar";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { LiveMonitor } from "@/components/monitor/LiveMonitor";
import { TrafficGenerator } from "@/components/generator/TrafficGenerator";
import { ThreatIntel } from "@/components/threat/ThreatIntel";
import { Settings } from "@/components/settings/Settings";

function App() {
  const [activeItem, setActiveItem] = useState("dashboard");

  return (
    <ThemeProvider>
      <TrafficDataProvider>
        <div className="flex h-screen bg-background text-foreground overflow-hidden">
          <Sidebar activeItem={activeItem} onItemClick={setActiveItem} />

          <main className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-auto scrollbar-thin">
              {activeItem === "dashboard" && <Dashboard />}
              {activeItem === "monitor" && <LiveMonitor />}
              {activeItem === "generator" && <TrafficGenerator />}
              {activeItem === "threat" && <ThreatIntel />}
              {activeItem === "settings" && <Settings />}
            </div>

            <StatusBar />
          </main>
        </div>
      </TrafficDataProvider>
    </ThemeProvider>
  );
}

export default App;