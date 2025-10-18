import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Download, Music, ListMusic, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DownloadFormProps {
  onDownload: (url: string, isPlaylist: boolean) => void;
}

export const DownloadForm = ({ onDownload }: DownloadFormProps) => {
  const [url, setUrl] = useState("");
  const [isPlaylist, setIsPlaylist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      toast({
        title: "URL necesar",
        description: "Te rog introdu un URL valid",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await onDownload(url, isPlaylist);
      setUrl("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-8 backdrop-blur-xl bg-card/40 border-white/10 shadow-2xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-primary to-secondary mb-4 animate-pulse-glow">
            <Music className="w-8 h-8 text-primary-foreground" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Descarcă Muzică
          </h2>
          <p className="text-muted-foreground">
            Introdu URL-ul de pe YouTube, SoundCloud sau alte platforme
          </p>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <Input
              type="url"
              placeholder="https://youtube.com/watch?v=..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="pr-12 h-14 bg-background/50 border-white/20 focus:border-primary transition-all"
              disabled={isLoading}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Music className="w-5 h-5 text-muted-foreground" />
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant={!isPlaylist ? "default" : "outline"}
              onClick={() => setIsPlaylist(false)}
              className="flex-1 h-12 gap-2"
              disabled={isLoading}
            >
              <Music className="w-4 h-4" />
              Single Track
            </Button>
            <Button
              type="button"
              variant={isPlaylist ? "default" : "outline"}
              onClick={() => setIsPlaylist(true)}
              className="flex-1 h-12 gap-2"
              disabled={isLoading}
            >
              <ListMusic className="w-4 h-4" />
              Playlist
            </Button>
          </div>

          <Button
            type="submit"
            className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-primary via-secondary to-accent hover:opacity-90 transition-opacity shadow-lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Procesare...
              </>
            ) : (
              <>
                <Download className="mr-2 h-5 w-5" />
                Descarcă {isPlaylist ? "Playlist" : "Melodie"}
              </>
            )}
          </Button>
        </div>

        <div className="pt-4 border-t border-white/10">
          <p className="text-xs text-muted-foreground text-center">
            ⚠️ Asigură-te că descarci doar conținut pentru care ai drepturi sau permisiune.
            Respectă legile privind drepturile de autor.
          </p>
        </div>
      </form>
    </Card>
  );
};
