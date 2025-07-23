// pages/api/generate.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const prompt = req.body.prompt;

  if (!prompt) {
    return res.status(400).json({ error: 'No prompt provided' });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer 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'
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'You are an expert React developer. Return clean, well-formatted React component code only.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3
      })
    });

    const data = await response.json();
    const result = data.choices?.[0]?.message?.content || 'No response';

    res.status(200).json({ code: result });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate code', details: err.message });
  }
}
