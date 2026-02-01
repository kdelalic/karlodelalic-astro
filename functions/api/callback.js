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
          
          function notify() {
             const opener = window.opener || window.parent;
             if (!opener) {
               console.error("No opener found");
               const statusEl = document.getElementById("status");
               if (statusEl) {
                 statusEl.innerHTML = "Error: No opener window found. Please don't close the main CMS window.";
                 statusEl.style.color = "red";
               }
               return;
             }
             
             try {
               opener.console.log("[CMS-Auth] Sending token from popup...");
             } catch (e) {
               console.warn("Could not access opener console (cross-origin limitation)");
             }
             
             const messageObject = {
               token: token,
               provider: provider
             };
             
             const formats = [
               "authorization:" + provider + ":success:" + token,
               "authorization:" + provider + ":success:" + JSON.stringify(messageObject),
               "authorizer:" + provider + ":success:" + token
             ];
             
             formats.forEach(msg => {
               opener.postMessage(msg, "*");
             });

             opener.postMessage(messageObject, "*");
          }

          window.onload = function() {
            document.getElementById("status").innerHTML = "Sending credentials to CMS...";
            notify();
            const interval = setInterval(notify, 500);

            setTimeout(() => {
              clearInterval(interval);
              document.getElementById("status").innerHTML = "Finished. You can close this window.";
              setTimeout(() => { window.close() }, 2000);
            }, 4000);
          };
        })()
      </script>
      <div style="font-family: sans-serif; padding: 20px; text-align: center;">
        <h2>Authentication Result</h2>
        <p id="status">Processing...</p>
        <p style="font-size: 12px; color: #666;">Current Origin: <script>document.write(window.location.origin)</script></p>
      </div>
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
