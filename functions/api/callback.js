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

    const html = `
      <!doctype html>
      <html><body><script>
        (function() {
          const token = "${token}";
          const provider = "${provider}";
          
          // Send the message expected by Decap CMS
          // Common formats:
          // 1. String: "authorization:github:success:TOKEN"
          // 2. Object: { token: TOKEN, provider: "github" } (some versions)
          
          function notify() {
             const key = "authorization:" + provider + ":success:" + token;
             
             // Send to all origins since we might be developing on localhost
             // but the auth callback runs on the production domain.
             if (window.opener) {
               window.opener.postMessage(key, "*");
             }
          }

          // Send immediately
          notify();

          // Send continuously for a short duration to ensure receipt
          const interval = setInterval(notify, 500);

          // Close after 2 seconds
          setTimeout(() => {
            clearInterval(interval);
            window.close();
          }, 2000);
        })()
      </script>
      <p>Authentication successful. You can close this window if it doesn't close automatically.</p>
      </body></html>
    `;

    return new Response(html, {
      headers: {
        'content-type': 'text/html;charset=UTF-8'
      }
    });

  } catch (error) {
    return new Response(error.message, { status: 500 });
  }
}
