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
      title: "Procesare...",
      url,
      progress: 0,
      status: "pending",
    };

    setDownloads((prev) => [...prev, newDownload]);

    try {
      setDownloads((prev) =>
        prev.map((d) =>
          d.id === newDownload.id
            ? { ...d, status: "downloading", progress: 30 }
            : d
        )
      );

      const { data, error } = await supabase.functions.invoke('download-music', {
        body: { url, isPlaylist }
      });

      if (error) throw error;
      if (!data.success) throw new Error(data.error || 'Descărcarea a eșuat');

      setDownloads((prev) =>
        prev.map((d) =>
          d.id === newDownload.id
            ? { ...d, title: data.title, progress: 70 }
            : d
        )
      );

      if (data.downloadUrl) {
        // Real download available
        setDownloads((prev) =>
          prev.map((d) =>
            d.id === newDownload.id ? { ...d, progress: 90 } : d
          )
        );

        const link = document.createElement('a');
        link.href = data.downloadUrl;
        link.download = `${data.title || 'melodie'}.mp3`;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setDownloads((prev) =>
          prev.map((d) =>
            d.id === newDownload.id
              ? { ...d, progress: 100, status: "completed" }
              : d
          )
        );

        toast({
          title: "Descărcare completă!",
          description: `${data.title} — verifică folderul Downloads.`,
        });
      } else if (data.noApiKey) {
        // No API key configured - inform user
        setDownloads((prev) =>
          prev.map((d) =>
            d.id === newDownload.id
              ? { ...d, progress: 100, status: "completed" }
              : d
          )
        );

        toast({
          title: `🎵 ${data.title}`,
          description: `De: ${data.metadata?.author || 'Necunoscut'} — Descărcarea reală necesită configurarea unui API key (RapidAPI).`,
        });
      }

      // Move to history
      setTimeout(() => {
        setDownloads((prev) => prev.filter((d) => d.id !== newDownload.id));
        setHistory((prev) => [
          {
            id: newDownload.id,
            title: data.title || "Melodie",
            url,
            completedAt: new Date(),
            fileSize: data.fileSize,
          },
          ...prev,
        ]);
      }, 2000);

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

      setTimeout(() => {
        setDownloads((prev) => prev.filter((d) => d.id !== newDownload.id));
      }, 3000);
    }
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
        <div className="text-center space-y-4 mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-primary via-secondary to-accent mb-4 animate-wave">
            <Headphones className="w-10 h-10 text-background" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Music Downloader
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Descarcă melodiile tale favorite în format MP3 direct pe dispozitiv
          </p>
        </div>

        <DownloadForm onDownload={handleDownload} />
        <DownloadProgress downloads={downloads} />
        <DownloadHistory history={history} onClear={handleClearHistory} />

        <div className="text-center pt-8 pb-4">
          <p className="text-sm text-muted-foreground">
            Creat cu ❤️ pentru iubitorii de muzică • Fișierele se salvează în folderul <strong>Downloads</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
