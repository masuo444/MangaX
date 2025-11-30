// Vercel Serverless Function: Gemini proxy
// Reads base64 image and returns translated text array

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const apiKey =
    process.env.GEMINI_API_KEY ||
    process.env.VITE_GEMINI_API_KEY ||
    process.env.REACT_APP_GEMINI_API_KEY;

  if (!apiKey) {
    res.status(400).json({ error: 'Missing GEMINI API key' });
    return;
  }

  try {
    const { image, targetLang = 'en' } = req.body || {};
    if (!image) {
      res.status(400).json({ error: 'Missing image' });
      return;
    }
    const inlineDataPart = image.split(',')[1];
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Extract all text bubbles from this manga page. Return a JSON array where each object has "original" (Japanese text) and "translated" (${targetLang}). Only return JSON array.`,
                },
                { inlineData: { mimeType: 'image/jpeg', data: inlineDataPart } },
              ],
            },
          ],
          generationConfig: { responseMimeType: 'application/json' },
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      res.status(response.status).json({ error: 'Gemini API error', detail: errText });
      return;
    }
    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    const parsed = JSON.parse(text);
    res.status(200).json(parsed);
  } catch (e) {
    res.status(500).json({ error: 'Server error', detail: e?.message });
  }
}
