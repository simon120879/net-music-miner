import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();

    if (!url) {
      throw new Error('URL-ul este necesar');
    }

    // Validate YouTube URL
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
    if (!youtubeRegex.test(url)) {
      throw new Error('URL invalid. Folosește un link YouTube valid.');
    }

    // Extract video ID
    let videoId = '';
    if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0] || '';
    } else if (url.includes('youtube.com')) {
      const urlObj = new URL(url);
      videoId = urlObj.searchParams.get('v') || '';
    }

    if (!videoId) {
      throw new Error('Nu am putut extrage ID-ul video din URL.');
    }

    // Get video info
    const oembedRes = await fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
    );

    if (!oembedRes.ok) {
      throw new Error('Nu am putut obține informații despre video.');
    }

    const videoInfo = await oembedRes.json();

    // Check if RAPIDAPI_KEY is configured for real downloads
    const rapidApiKey = Deno.env.get('RAPIDAPI_KEY');

    if (rapidApiKey) {
      // Real download via RapidAPI
      console.log('Using RapidAPI for download...');
      
      const apiResponse = await fetch(
        `https://youtube-mp36.p.rapidapi.com/dl?id=${videoId}`,
        {
          headers: {
            'X-RapidAPI-Key': rapidApiKey,
            'X-RapidAPI-Host': 'youtube-mp36.p.rapidapi.com',
          },
        }
      );

      if (!apiResponse.ok) {
        throw new Error('Eroare la serviciul de conversie.');
      }

      const apiData = await apiResponse.json();

      if (apiData.status === 'ok' && apiData.link) {
        return new Response(
          JSON.stringify({
            success: true,
            title: apiData.title || videoInfo.title,
            downloadUrl: apiData.link,
            fileSize: apiData.filesize ? `${(apiData.filesize / 1024 / 1024).toFixed(1)} MB` : undefined,
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } else {
        throw new Error(apiData.msg || 'Conversia a eșuat. Încearcă alt video.');
      }
    }

    // No API key - return info only
    return new Response(
      JSON.stringify({
        success: true,
        title: videoInfo.title || 'Unknown',
        downloadUrl: null,
        noApiKey: true,
        metadata: {
          thumbnail: videoInfo.thumbnail_url,
          author: videoInfo.author_name,
        },
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Eroare necunoscută',
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );
  }
});
