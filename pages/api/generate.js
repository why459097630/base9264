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
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
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
    const result = JSON.stringify(data, null, 2);

    res.status(200).json({ code: result });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate code', details: err.message });
  }
}
