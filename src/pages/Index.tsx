import { useState } from "react";
import { DownloadForm } from "@/components/DownloadForm";
import { DownloadProgress, Download } from "@/components/DownloadProgress";
import { DownloadHistory, HistoryItem } from "@/components/DownloadHistory";
import { useToast } from "@/hooks/use-toast";
import { Headphones } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [downloads, setDownloads] = useState<Download[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const { toast } = useToast();

  const handleDownload = async (url: string, isPlaylist: boolean) => {
    const newDownload: Download = {
      id: Date.now().toString(),
      title: isPlaylist ? "Playlist" : "Procesare...",
      url,
      progress: 0,
      status: "pending",
    };

    setDownloads((prev) => [...prev, newDownload]);

    try {
      // Call edge function pentru descărcare reală
      const { data, error } = await supabase.functions.invoke('download-music', {
        body: { url, isPlaylist }
      });

      if (error) {
        throw error;
      }

      if (!data.success) {
        throw new Error(data.error || 'Descărcarea a eșuat');
      }

      // Actualizăm titlul cu cel real
      setDownloads((prev) =>
        prev.map((d) =>
          d.id === newDownload.id
            ? { ...d, title: data.title, status: "downloading" }
            : d
        )
      );

      toast({
        title: "Descărcare inițiată",
        description: `Am început descărcarea: ${data.title}`,
      });

      // Simulate download progress
      simulateDownload(newDownload.id, data.title);

    } catch (error) {
      console.error('Download error:', error);
      
      setDownloads((prev) =>
        prev.map((d) =>
          d.id === newDownload.id
            ? { ...d, status: "error", progress: 0 }
            : d
        )
      );

      toast({
        title: "Eroare la descărcare",
        description: error instanceof Error ? error.message : "A apărut o eroare necunoscută",
        variant: "destructive",
      });

      // Remove failed download after 3 seconds
      setTimeout(() => {
        setDownloads((prev) => prev.filter((d) => d.id !== newDownload.id));
      }, 3000);
    }
  };

  const simulateDownload = (downloadId: string, title?: string) => {
    const interval = setInterval(() => {
      setDownloads((prev) =>
        prev.map((d) => {
          if (d.id === downloadId) {
            const newProgress = Math.min(d.progress + Math.random() * 15, 100);
            
            if (newProgress >= 100) {
              clearInterval(interval);
              
              // Move to history
              setTimeout(() => {
                setDownloads((prev) => prev.filter((item) => item.id !== downloadId));
                setHistory((prev) => [
                  {
                    id: downloadId,
                    title: title || d.title,
                    url: d.url,
                    completedAt: new Date(),
                    fileSize: "3.5 MB",
                  },
                  ...prev,
                ]);
                
                toast({
                  title: "Descărcare completă!",
                  description: `${d.title} a fost descărcat cu succes.`,
                });
              }, 500);

              return { ...d, progress: 100, status: "completed" };
            }

            return { ...d, progress: newProgress, status: "downloading" };
          }
          return d;
        })
      );
    }, 500);
  };

  const handleClearHistory = () => {
    setHistory([]);
    toast({
      title: "Istoric șters",
      description: "Istoricul descărcărilor a fost șters.",
    });
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-primary via-secondary to-accent mb-4 animate-wave">
            <Headphones className="w-10 h-10 text-background" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Music Downloader
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Descarcă melodiile și playlisturile tale favorite direct pe dispozitiv
          </p>
        </div>

        {/* Download Form */}
        <DownloadForm onDownload={handleDownload} />

        {/* Active Downloads */}
        <DownloadProgress downloads={downloads} />

        {/* Download History */}
        <DownloadHistory history={history} onClear={handleClearHistory} />

        {/* Footer */}
        <div className="text-center pt-8 pb-4">
          <p className="text-sm text-muted-foreground">
            Creat cu ❤️ pentru iubitorii de muzică
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
