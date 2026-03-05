import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useAppState } from "@/hooks/useApp";
import { Clock, MapPin, Route, Zap } from "lucide-react";

function StatCard({ icon: Icon, label, value, color = "default" }: { 
  icon: any; 
  label: string; 
  value: string; 
  color?: "default" | "success" | "warning" | "info";
}) {
  const colorClasses = {
    default: "bg-muted/50 border-border",
    success: "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800",
    warning: "bg-orange-50 border-orange-200 dark:bg-orange-950 dark:border-orange-800",
    info: "bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800"
  };

  return (
    <div className={`p-3 rounded-lg border ${colorClasses[color]} transition-colors`}>
      <div className="flex items-center gap-2 mb-1">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
      </div>
      <div className="text-lg font-bold">{value}</div>
    </div>
  );
}

function ProgressBar({ label, value, max, color = "blue" }: {
  label: string;
  value: number;
  max: number;
  color?: "blue" | "green" | "orange";
}) {
  const percentage = max > 0 ? (value / max) * 100 : 0;
  
  const colorClasses = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    orange: "bg-orange-500"
  };

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{value}</span>
      </div>
      <div className="w-full bg-muted rounded-full h-2">
        <div 
          className={`h-2 rounded-full transition-all duration-500 ${colorClasses[color]}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  );
}

export const RightPanel = () => {
  const { animationStats, graphAlgorithm } = useAppState();
  
  const efficiency = animationStats.visitedNodes > 0 
    ? Math.round((animationStats.pathLength / animationStats.visitedNodes) * 100)
    : 0;

  return (
    <div className="flex flex-col w-full max-w-[288px] space-y-4 text-sm">
      {/* Algorithm Info */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4" />
          <h3 className="font-semibold">Algorithm</h3>
        </div>
        <Badge variant="secondary" className="w-fit">
          {graphAlgorithm.toUpperCase()}
        </Badge>
      </section>

      <Separator />

      {/* Statistics Cards */}
      <section className="space-y-3">
        <h3 className="font-semibold flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Performance Stats
        </h3>
        
        <div className="grid grid-cols-2 gap-2">
          <StatCard 
            icon={MapPin}
            label="Visited"
            value={animationStats.visitedNodes.toString()}
            color="info"
          />
          <StatCard 
            icon={Route}
            label="Path Length"
            value={animationStats.pathLength.toString()}
            color="success"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <StatCard 
            icon={Clock}
            label="Time"
            value={`${animationStats.executionTime}ms`}
            color="warning"
          />
          <StatCard 
            icon={Zap}
            label="Efficiency"
            value={`${efficiency}%`}
            color={efficiency > 50 ? "success" : "warning"}
          />
        </div>
      </section>

      <Separator />

      {/* Progress Bars */}
      <section className="space-y-3">
        <h3 className="font-semibold">Analysis</h3>
        
        <ProgressBar 
          label="Nodes Explored"
          value={animationStats.visitedNodes}
          max={Math.max(animationStats.visitedNodes, 100)}
          color="blue"
        />
        
        <ProgressBar 
          label="Path Efficiency"
          value={efficiency}
          max={100}
          color={efficiency > 70 ? "green" : efficiency > 40 ? "orange" : "orange"}
        />
      </section>

      <Separator />

      {/* Controls Info */}
      <section className="space-y-2 text-muted-foreground">
        <h3 className="font-medium text-foreground">Controls</h3>
        <div className="space-y-1 text-xs">
          <p>• Click & drag to draw walls</p>
          <p>• Drag nodes to reposition</p>
          <p>• Select algorithm before running</p>
        </div>
      </section>
    </div>
  );
};
