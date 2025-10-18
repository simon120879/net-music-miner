import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Music2, Download, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ro } from "date-fns/locale";

export interface HistoryItem {
  id: string;
  title: string;
  url: string;
  completedAt: Date;
  fileSize?: string;
}

interface DownloadHistoryProps {
  history: HistoryItem[];
  onClear: () => void;
}

export const DownloadHistory = ({ history, onClear }: DownloadHistoryProps) => {
  if (history.length === 0) {
    return (
      <Card className="p-8 backdrop-blur-xl bg-card/40 border-white/10 text-center">
        <Music2 className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
        <p className="text-muted-foreground">
          Nicio descărcare încă. Începe prin a adăuga un URL mai sus!
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6 backdrop-blur-xl bg-card/40 border-white/10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <Download className="w-5 h-5 text-accent" />
          Istoric Descărcări
        </h3>
        <Button
          variant="outline"
          size="sm"
          onClick={onClear}
          className="gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Șterge Tot
        </Button>
      </div>

      <div className="space-y-2">
        {history.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-lg bg-background/50 border border-white/5 hover:border-white/20 transition-colors"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{item.title}</p>
                <p className="text-sm text-muted-foreground truncate">
                  {item.url}
                </p>
                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                  <span>
                    {formatDistanceToNow(item.completedAt, {
                      addSuffix: true,
                      locale: ro,
                    })}
                  </span>
                  {item.fileSize && (
                    <>
                      <span>•</span>
                      <span>{item.fileSize}</span>
                    </>
                  )}
                </div>
              </div>
              <Music2 className="w-5 h-5 text-primary flex-shrink-0" />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
