import { useTheme } from "@/context/ThemeContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Square, Zap, Activity, ArrowDown, ArrowUp } from "lucide-react";
import { useTrafficDataContext } from "@/hooks/useTrafficData";

export function TrafficGenerator() {
  const { theme } = useTheme();
  const { 
    isGeneratorRunning, 
    startGenerator, 
    stopGenerator,
    generatorPackets,
    generatorBytes,
    generatorStartTime,
    resetGeneratorStats
  } = useTrafficDataContext();
  
  const formatDuration = (ms: number | null) => {
    if (!ms) return "0:00";
    const secs = Math.floor((Date.now() - ms) / 1000);
    const mins = Math.floor(secs / 60);
    const hours = Math.floor(mins / 60);
    if (hours > 0) return `${hours}:${String(mins % 60).padStart(2, "0")}:${String(secs % 60).padStart(2, "0")}`;
    return `${mins}:${String(secs % 60).padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b" style={{ borderColor: theme === "dark" ? "#343535" : "#dcdbda" }}>
        <h1 className={`text-2xl font-semibold ${theme === "dark" ? "text-[#e3e2e1]" : "text-[#1a1c1c]"}`}>
          Traffic Generator
        </h1>
        <p className={`text-sm mt-1 ${theme === "dark" ? "text-[#8a919e]" : "text-[#8a919e]"}`}>
          Generate random network traffic for testing
        </p>
      </div>

      <div className="flex-1 p-6 space-y-6 overflow-auto">
        <Card className={`p-5 ${theme === "dark" ? "bg-[#1a1c1c]/80 border-[#343535]" : "bg-white/80 border-[#dcdbda]"}`}>
          <CardHeader className="p-0 pb-4">
            <CardTitle className={`text-sm font-semibold ${theme === "dark" ? "text-[#e3e2e1]" : "text-[#1a1c1c]"}`}>
              Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="grid grid-cols-4 gap-4">
              <div className={`p-4 rounded-xl ${theme === "dark" ? "bg-[#292a2a]" : "bg-[#e8e7e6]"}`}>
                <Activity className="size-5 mb-2" style={{ color: "#0078D4" }} />
                <p className={`text-2xl font-semibold ${theme === "dark" ? "text-[#e3e2e1]" : "text-[#1a1c1c]"}`}>
                  {generatorPackets.toLocaleString()}
                </p>
                <p className={`text-xs ${theme === "dark" ? "text-[#8a919e]" : "text-[#8a919e]"}`}>Packets Sent</p>
              </div>
              <div className={`p-4 rounded-xl ${theme === "dark" ? "bg-[#292a2a]" : "bg-[#e8e7e6]"}`}>
                <Zap className="size-5 mb-2" style={{ color: "#0078D4" }} />
                <p className={`text-2xl font-semibold ${theme === "dark" ? "text-[#e3e2e1]" : "text-[#1a1c1c]"}`}>
                  {(generatorBytes / 1024 / 1024).toFixed(2)} MB
                </p>
                <p className={`text-xs ${theme === "dark" ? "text-[#8a919e]" : "text-[#8a919e]"}`}>Total Data</p>
              </div>
              <div className={`p-4 rounded-xl ${theme === "dark" ? "bg-[#292a2a]" : "bg-[#e8e7e6]"}`}>
                <ArrowDown className="size-5 mb-2" style={{ color: "#0078D4" }} />
                <p className={`text-2xl font-semibold ${theme === "dark" ? "text-[#e3e2e1]" : "text-[#1a1c1c]"}`}>
                  ~{(generatorBytes * 0.8 / 1024 / 1024).toFixed(1)} MB
                </p>
                <p className={`text-xs ${theme === "dark" ? "text-[#8a919e]" : "text-[#8a919e]"}`}>Download</p>
              </div>
              <div className={`p-4 rounded-xl ${theme === "dark" ? "bg-[#292a2a]" : "bg-[#e8e7e6]"}`}>
                <ArrowUp className="size-5 mb-2" style={{ color: "#6ccb5f" }} />
                <p className={`text-2xl font-semibold ${theme === "dark" ? "text-[#e3e2e1]" : "text-[#1a1c1c]"}`}>
                  ~{(generatorBytes * 0.2 / 1024 / 1024).toFixed(1)} MB
                </p>
                <p className={`text-xs ${theme === "dark" ? "text-[#8a919e]" : "text-[#8a919e]"}`}>Upload</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className={`p-6 rounded-xl text-center ${theme === "dark" ? "bg-[#1a1c1c]/50 border-[#343535] border-dashed" : "bg-white/50 border-[#dcdbda] border-dashed"}`}>
          <div className={`mb-2 ${isGeneratorRunning ? "animate-pulse" : ""}`}>
            <Zap className={`size-16 mx-auto ${isGeneratorRunning ? "text-green-500" : theme === "dark" ? "text-[#8a919e]" : "text-[#8a919e]"}`} style={{ color: isGeneratorRunning ? "#6ccb5f" : undefined }} />
          </div>
          <p className={`text-lg font-medium ${theme === "dark" ? "text-[#e3e2e1]" : "text-[#1a1c1c]"}`}>
            {isGeneratorRunning ? "Generating Traffic..." : "Ready to Generate"}
          </p>
          <p className={`text-sm mt-1 ${theme === "dark" ? "text-[#8a919e]" : "text-[#8a919e]"}`}>
            {isGeneratorRunning ? `Duration: ${formatDuration(generatorStartTime)}` : "Click Start to begin"}
          </p>
        </div>
      </div>

      <div className={`p-4 border-t flex items-center justify-between ${theme === "dark" ? "bg-[#1a1c1c] border-[#343535]" : "bg-white border-[#dcdbda]"}`}>
        <Button
          variant="outline"
          size="sm"
          onClick={resetGeneratorStats}
          className="gap-2"
        >
          Reset
        </Button>
        <Button
          size="lg"
          onClick={() => isGeneratorRunning ? stopGenerator() : startGenerator()}
          className={`gap-2 px-8 ${isGeneratorRunning ? "bg-red-600 hover:bg-red-700" : ""}`}
        >
          {isGeneratorRunning ? (
            <><Square className="size-5" /> Stop</>
          ) : (
            <><Play className="size-5" /> Start Generation</>
          )}
        </Button>
      </div>
    </div>
  );
}