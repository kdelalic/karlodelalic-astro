export async function onRequestGet(context) {
  const { request, env } = context;
  const clientId = env.GITHUB_CLIENT_ID;
  const clientSecret = env.GITHUB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return new Response('GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET not set', { status: 500 });
  }

  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  if (!code) {
    return new Response('Missing code param', { status: 400 });
  }

  try {
    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'accept': 'application/json',
        'user-agent': 'cloudflare-pages-functions'
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code
      })
    });

    const result = await response.json();

    if (result.error) {
      return new Response(JSON.stringify(result), { status: 400 });
    }

    const token = result.access_token;
    const provider = 'github';
    const baseUrl = 'https://karlodelalic.me';

    const html = `<!doctype html>
<html><body>
<p style="font-family:sans-serif;text-align:center;margin-top:40px">Authenticating...</p>
<script>
(function() {
  const token = "${token}";
  const provider = "${provider}";
  const opener = window.opener;
  
  if (!opener) return;
  
  opener.postMessage("authorizing:" + provider, "${baseUrl}");
  
  window.addEventListener("message", function(e) {
    if (e.data === "authorizing:" + provider) {
      const data = JSON.stringify({ token: token, provider: provider });
      opener.postMessage("authorization:" + provider + ":success:" + data, e.origin);
      setTimeout(function() { window.close(); }, 500);
    }
  }, false);
  
  setTimeout(function() {
    const data = JSON.stringify({ token: token, provider: provider });
    opener.postMessage("authorization:" + provider + ":success:" + data, "*");
    setTimeout(function() { window.close(); }, 500);
  }, 3000);
})();
</script>
</body></html>`;

    return new Response(html, {
      headers: { 'content-type': 'text/html;charset=UTF-8' }
    });

  } catch (error) {
    return new Response(error.message, { status: 500 });
  }
}
