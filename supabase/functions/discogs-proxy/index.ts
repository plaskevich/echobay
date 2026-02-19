import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const DISCOGS_API_BASE = 'https://api.discogs.com';
const USER_AGENT = 'EchoBay/1.0 +https://github.com/plaskevich/EchoBay';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { action, query, releaseId } = await req.json();

    const discogsKey = Deno.env.get('DISCOGS_KEY');
    const discogsSecret = Deno.env.get('DISCOGS_SECRET');

    if (!discogsKey || !discogsSecret) {
      return new Response(JSON.stringify({ error: 'Discogs API credentials not configured on server.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    const authParams = new URLSearchParams({ key: discogsKey, secret: discogsSecret });
    let discogsUrl: string;

    if (action === 'search') {
      if (!query || typeof query !== 'string') {
        return new Response(JSON.stringify({ error: 'Search query is required.' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        });
      }
      const params = new URLSearchParams({
        q: query,
        type: 'master',
        per_page: '10',
        key: discogsKey,
        secret: discogsSecret,
      });
      discogsUrl = `${DISCOGS_API_BASE}/database/search?${params}`;
    } else if (action === 'release') {
      if (!releaseId || typeof releaseId !== 'number') {
        return new Response(JSON.stringify({ error: 'Release ID is required.' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        });
      }
      discogsUrl = `${DISCOGS_API_BASE}/masters/${releaseId}?${authParams}`;
    } else {
      return new Response(JSON.stringify({ error: 'Invalid action. Use "search" or "release".' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    const fetchDiscogs = async (url: string) => {
      return await fetch(url, {
        headers: { 'User-Agent': USER_AGENT, Accept: 'application/json' },
      });
    };

    const discogsResponse = await fetchDiscogs(discogsUrl);
    const data = await discogsResponse.json();

    if (!discogsResponse.ok) {
      return new Response(
        JSON.stringify({
          error: `Discogs API error: ${discogsResponse.status} ${discogsResponse.statusText}`,
          status: discogsResponse.status,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: discogsResponse.status }
      );
    }

    if (action === 'release' && data.main_release) {
      try {
        const releaseUrl = `${DISCOGS_API_BASE}/releases/${data.main_release}?${authParams}`;
        const releaseResponse = await fetchDiscogs(releaseUrl);
        if (releaseResponse.ok) {
          const releaseData = await releaseResponse.json();
          data.labels = releaseData.labels;
        }
      } catch {
        // labels are optional, don't fail the whole request
      }
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message || 'Internal server error' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
