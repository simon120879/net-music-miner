import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DownloadRequest {
  url: string;
  isPlaylist: boolean;
}

interface DownloadResponse {
  success: boolean;
  title: string;
  downloadUrl?: string;
  error?: string;
  metadata?: {
    duration: string;
    thumbnail: string;
    author: string;
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url, isPlaylist }: DownloadRequest = await req.json();
    
    console.log('Download request received:', { url, isPlaylist });

    if (!url) {
      throw new Error('URL is required');
    }

    // Validare URL YouTube
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
    if (!youtubeRegex.test(url)) {
      throw new Error('URL invalid. Te rog să folosești un link YouTube valid.');
    }

    // Extract video ID from URL
    let videoId = '';
    if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0] || '';
    } else if (url.includes('youtube.com')) {
      const urlParams = new URLSearchParams(new URL(url).search);
      videoId = urlParams.get('v') || '';
    }

    if (!videoId) {
      throw new Error('Nu am putut extrage ID-ul video din URL.');
    }

    console.log('Video ID extracted:', videoId);

    // Folosim ytdl API pentru a obține informații despre video
    // Nota: Acesta este un exemplu. Pentru producție, ai nevoie de un API key sau serviciu plătit
    const infoUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
    const infoResponse = await fetch(infoUrl);
    
    if (!infoResponse.ok) {
      throw new Error('Nu am putut obține informații despre video.');
    }

    const videoInfo = await infoResponse.json();
    
    console.log('Video info retrieved:', videoInfo);

    // Pentru demo, returnăm informațiile video
    // În producție, aici ar trebui să procesezi și să returnezi link-ul de descărcare real
    const response: DownloadResponse = {
      success: true,
      title: videoInfo.title || 'Unknown Title',
      // În producție, aici ar fi URL-ul real de descărcare
      downloadUrl: `https://www.youtube.com/watch?v=${videoId}`,
      metadata: {
        duration: '0:00',
        thumbnail: videoInfo.thumbnail_url || '',
        author: videoInfo.author_name || 'Unknown',
      }
    };

    return new Response(
      JSON.stringify(response),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in download-music function:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'A apărut o eroare la procesarea cererii.';
    
    const errorResponse: DownloadResponse = {
      success: false,
      title: '',
      error: errorMessage,
    };

    return new Response(
      JSON.stringify(errorResponse),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    );
  }
});
