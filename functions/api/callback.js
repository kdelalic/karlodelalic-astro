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

    // The handshake protocol from Decap CMS netlify-auth.js:
    // 1. Popup sends "authorizing:github" to opener
    // 2. Opener replies with "authorizing:github" back to popup
    // 3. Popup then sends "authorization:github:success:{JSON with token}"
    const html = `
      <!doctype html>
      <html><body>
      <div style="font-family: sans-serif; padding: 20px; text-align: center; max-width: 400px; margin: 50px auto; border: 1px solid #eee; border-radius: 8px;">
        <h2 style="color: #2c3e50;">Authentication</h2>
        <p id="status" style="font-size: 14px; color: #34495e;">Initiating handshake...</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 11px; color: #95a5a6;">Origin: <script>document.write(window.location.origin)</script></p>
      </div>
      <script>
        (function() {
          const token = "${token}";
          const provider = "${provider}";
          const baseUrl = "https://karlodelalic.me";
          
          function updateStatus(msg) {
            document.getElementById("status").innerHTML = msg;
          }
          
          const opener = window.opener;
          if (!opener) {
            updateStatus("Error: No opener window found.");
            return;
          }
          
          // Step 1: Send the handshake initiation
          updateStatus("Sending handshake...");
          opener.postMessage("authorizing:" + provider, baseUrl);
          
          // Listen for the handshake reply and then send the token
          window.addEventListener("message", function(e) {
            console.log("Popup received message:", e.data, "from", e.origin);
            
            // Step 2: When we receive the handshake acknowledgment, send the token
            if (e.data === "authorizing:" + provider) {
              updateStatus("Handshake received, sending token...");
              
              // Step 3: Send the success message with the token as JSON
              const successData = JSON.stringify({ token: token, provider: provider });
              const successMsg = "authorization:" + provider + ":success:" + successData;
              
              opener.postMessage(successMsg, e.origin);
              
              updateStatus("Token sent! Closing...");
              setTimeout(function() { window.close(); }, 1000);
            }
          }, false);
          
          // Fallback: If no handshake reply after 3 seconds, try sending directly
          setTimeout(function() {
            updateStatus("No handshake reply. Trying direct send...");
            
            const successData = JSON.stringify({ token: token, provider: provider });
            const successMsg = "authorization:" + provider + ":success:" + successData;
            
            // Try sending to all origins as fallback
            opener.postMessage(successMsg, "*");
            
            updateStatus("Direct send complete. Closing...");
            setTimeout(function() { window.close(); }, 2000);
          }, 3000);
        })();
      </script>
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
