import http from 'http';
import { URL } from 'url';

const PORT = 3000;
const MODEL = process.env.OPENROUTER_MODEL || 'deepseek/deepseek-r1:free';

const send = (res, status, bodyObj, headers = {}) => {
  const body = JSON.stringify(bodyObj);
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',              // dev-friendly; restrict in prod if you want
    'Access-Control-Allow-Methods': 'POST, OPTIONS, GET',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    ...headers,
  });
  res.end(body);
};

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  // --- CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS, GET',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    });
    return res.end();
  }

  // --- Health checks (handy for quick tests)
  if (url.pathname === '/api/ping' && req.method === 'GET') {
    return send(res, 200, { ok: true, time: new Date().toISOString() });
  }
  if (url.pathname === '/api/health' && req.method === 'GET') {
    return send(res, 200, {
      ok: true,
      hasKey: Boolean(process.env.OPENROUTER_API_KEY),
      model: MODEL,
    });
  }

  // --- Chat endpoint
  if (url.pathname === '/api/chat' && req.method === 'POST') {
    let raw = '';
    req.on('data', (c) => (raw += c));
    req.on('end', async () => {
      try {
        const apiKey = process.env.OPENROUTER_API_KEY;
        if (!apiKey) {
          return send(res, 500, { reply: 'Server not configured (missing OPENROUTER_API_KEY).' });
        }

        // Parse user message
        let payload = {};
        try { payload = JSON.parse(raw || '{}'); }
        catch { return send(res, 400, { reply: 'Invalid JSON body.' }); }

        const message = (payload?.message ?? '').toString().trim();
        if (!message) return send(res, 400, { reply: 'No message provided' });

        // Helpful headers for OpenRouter (free routes may check referer)
        const referer = req.headers.referer || req.headers.origin || `http://localhost:${PORT}`;

        // Call OpenRouter
        const upstream = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
            'HTTP-Referer': referer,
            'X-Title': 'Beyond Barriers Chatbot',
          },
          body: JSON.stringify({
            model: MODEL, // default deepseek-r1:free
            messages: [
              { role: 'system', content: 'You are a helpful, concise assistant for an accessibility learning site.' },
              { role: 'user', content: message }
            ],
            temperature: 0.7
          }),
        });

        if (!upstream.ok) {
          const text = await safeReadText(upstream);
          console.error('OpenRouter error:', upstream.status, text);
          return send(res, 502, { reply: `Upstream error ${upstream.status}: ${text || 'No body'}` });
        }

        let data;
        try { data = await upstream.json(); }
        catch {
          const text = await safeReadText(upstream);
          console.error('Invalid JSON from OpenRouter:', text);
          return send(res, 502, { reply: 'Invalid JSON from upstream.' });
        }

        const reply = data?.choices?.[0]?.message?.content || 'No reply from model.';
        return send(res, 200, { reply });
      } catch (e) {
        console.error('Server error:', e);
        return send(res, 500, { reply: 'Server error.' });
      }
    });
    return;
  }

  // --- Fallback for any other route/method
  return send(res, 405, { reply: 'Method not allowed' });
});

server.listen(PORT, () => {
  console.log(`Local API running on http://localhost:${PORT} (model: ${MODEL})`);
});

// Helper to read text safely
async function safeReadText(response) {
  try { return await response.text(); }
  catch { return ''; }
}