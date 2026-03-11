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
      // Update status to downloading
      setDownloads((prev) =>
        prev.map((d) =>
          d.id === newDownload.id
            ? { ...d, status: "downloading", progress: 20 }
            : d
        )
      );

      const { data, error } = await supabase.functions.invoke('download-music', {
        body: { url, isPlaylist }
      });

      if (error) throw error;
      if (!data.success) throw new Error(data.error || 'Descărcarea a eșuat');

      // Update progress
      setDownloads((prev) =>
        prev.map((d) =>
          d.id === newDownload.id
            ? { ...d, title: data.title, progress: 60 }
            : d
        )
      );

      // Trigger real file download in browser
      const downloadUrl = data.downloadUrl;
      if (downloadUrl) {
        setDownloads((prev) =>
          prev.map((d) =>
            d.id === newDownload.id ? { ...d, progress: 80 } : d
          )
        );

        // Create a temporary link to trigger download
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `${data.title || 'melodie'}.mp3`;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      // Mark as completed
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

      // Move to history after a delay
      setTimeout(() => {
        setDownloads((prev) => prev.filter((d) => d.id !== newDownload.id));
        setHistory((prev) => [
          {
            id: newDownload.id,
            title: data.title || "Melodie",
            url,
            completedAt: new Date(),
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
        {/* Header */}
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

        {/* Download Form */}
        <DownloadForm onDownload={handleDownload} />

        {/* Active Downloads */}
        <DownloadProgress downloads={downloads} />

        {/* Download History */}
        <DownloadHistory history={history} onClear={handleClearHistory} />

        {/* Footer */}
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
