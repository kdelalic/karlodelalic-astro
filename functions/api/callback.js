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
               opener.console.log("[CMS-Auth] Sending signals to CMS...");
             } catch (e) {
               console.warn("Could not access opener console (cross-origin limitation)");
             }
             
             // Create various response structures
             const authResponse = {
               token: token,
               access_token: token,
               provider: provider
             };
             const authResponseJSON = JSON.stringify(authResponse);
             
             // Try every known format for Decap CMS / Netlify CMS
             const formats = [
               "authorization:" + provider + ":success:" + token,
               "authorization:" + provider + ":success:" + authResponseJSON,
               "authorizer:" + provider + ":success:" + token,
               "authorizer:" + provider + ":success:" + authResponseJSON,
               // Also try without 'authorization:' prefix just in case for some custom implementations
               authResponseJSON
             ];
             
             formats.forEach(msg => {
               opener.postMessage(msg, "*");
             });

             // Also try this specific format for some versions of Decap CMS/Netlify CMS
             opener.postMessage("authorization:github:success", "*");
          }

          window.onload = function() {
            document.getElementById("status").innerHTML = "Sending credentials to CMS...";
            notify();
            // Continuously notify for 10 seconds or until window is closed
            const interval = setInterval(notify, 500);
            
            // Note: We won't auto-close the window yet to allow for debugging visibility
            setTimeout(() => {
               document.getElementById("status").innerHTML = "Handshake sequence complete. If not logged in, please check CMS console errors.";
            }, 5000);
          };
        })()
      </script>
      <div style="font-family: sans-serif; padding: 20px; text-align: center; max-width: 400px; margin: auto; border: 1px solid #eee; border-radius: 8px; margin-top: 50px;">
        <h2 style="color: #2c3e50;">Authentication</h2>
        <p id="status" style="font-size: 14px; color: #34495e;">Initializing...</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 11px; color: #95a5a6;">Origin: <script>document.write(window.location.origin)</script></p>
        <button onclick="window.close()" style="padding: 8px 16px; background: #3498db; color: white; border: none; border-radius: 4px; cursor: pointer;">Close Window</button>
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
