import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Music, CheckCircle2, XCircle, Loader2 } from "lucide-react";

export interface Download {
  id: string;
  title: string;
  url: string;
  progress: number;
  status: "pending" | "downloading" | "completed" | "error";
  error?: string;
}

interface DownloadProgressProps {
  downloads: Download[];
}

export const DownloadProgress = ({ downloads }: DownloadProgressProps) => {
  if (downloads.length === 0) return null;

  return (
    <Card className="p-6 backdrop-blur-xl bg-card/40 border-white/10">
      <div className="space-y-4">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <Music className="w-5 h-5 text-primary" />
          Descărcări Active
        </h3>
        
        <div className="space-y-3">
          {downloads.map((download) => (
            <div
              key={download.id}
              className="p-4 rounded-lg bg-background/50 border border-white/5 space-y-2"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{download.title}</p>
                  <p className="text-sm text-muted-foreground truncate">
                    {download.url}
                  </p>
                </div>
                
                <div className="flex-shrink-0">
                  {download.status === "downloading" && (
                    <Loader2 className="w-5 h-5 text-secondary animate-spin" />
                  )}
                  {download.status === "completed" && (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  )}
                  {download.status === "error" && (
                    <XCircle className="w-5 h-5 text-destructive" />
                  )}
                </div>
              </div>

              {download.status === "downloading" && (
                <div className="space-y-1">
                  <Progress value={download.progress} className="h-2" />
                  <p className="text-xs text-muted-foreground text-right">
                    {download.progress}%
                  </p>
                </div>
              )}

              {download.status === "error" && download.error && (
                <p className="text-sm text-destructive">{download.error}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
