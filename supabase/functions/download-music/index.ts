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

    console.log('Processing download request for:', url);

    // Use Cobalt API - free, no API key needed
    const cobaltResponse = await fetch('https://api.cobalt.tools/api/json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        url: url,
        isAudioOnly: true,
        aFormat: 'mp3',
        filenamePattern: 'pretty',
        dubLang: false,
      }),
    });

    if (!cobaltResponse.ok) {
      const errorText = await cobaltResponse.text();
      console.error('Cobalt API error:', cobaltResponse.status, errorText);
      throw new Error('Serviciul de conversie nu este disponibil momentan. Încearcă din nou.');
    }

    const cobaltData = await cobaltResponse.json();
    console.log('Cobalt response:', JSON.stringify(cobaltData));

    if (cobaltData.status === 'error') {
      throw new Error(cobaltData.text || 'Eroare la procesarea link-ului');
    }

    // Cobalt returns a URL to the converted file
    const downloadUrl = cobaltData.url;
    if (!downloadUrl) {
      throw new Error('Nu s-a putut obține link-ul de descărcare');
    }

    // Get video title from YouTube oEmbed (best effort)
    let title = 'Melodie';
    try {
      // Extract video ID
      let videoId = '';
      if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1]?.split('?')[0] || '';
      } else if (url.includes('youtube.com')) {
        const urlObj = new URL(url);
        videoId = urlObj.searchParams.get('v') || '';
      }
      if (videoId) {
        const oembedRes = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
        if (oembedRes.ok) {
          const info = await oembedRes.json();
          title = info.title || title;
        }
      }
    } catch (e) {
      console.log('Could not fetch title:', e);
    }

    return new Response(
      JSON.stringify({
        success: true,
        title,
        downloadUrl,
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
