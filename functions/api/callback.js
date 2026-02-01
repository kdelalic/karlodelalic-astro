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
          function receiveMessage(e) {
            console.log("receiveMessage %o", e);
            
            // Match the window.open call in Decap CMS
            // https://github.com/decaporg/decap-cms/blob/e939551/packages/decap-cms-lib-auth/src/netlify-auth.js#L46
            
            // Decap CMS expects a message with 'authorizer: "github"' (config.yml backend.name)
            // But usually we just postMessage to opener.
            
            window.opener.postMessage(
              'authorization:${provider}:success:${token}',
              e.origin
            );
          }

          window.addEventListener("message", receiveMessage, false);
          
          // Send message to opener immediately in case they are already listening
          // The CMS polls or listens. The standard for custom backends often involves 
          // a specific handshake, but for 'github' backend with 'base_url', it expects
          // specific behavior. 
          
          // Let's try the standard postMessage format for Decap CMS with external OAuth:
          window.opener.postMessage({
            token: "${token}",
            provider: "${provider}"
          }, "*");

          // Also try the legacy string format just in case
          window.opener.postMessage("authorization:github:success:${token}", "*");

          document.write("Login successful! You can close this window.");
          setTimeout(() => { window.close() }, 1000);
        })()
      </script></body></html>
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
