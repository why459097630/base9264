// pages/api/generate.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'No prompt provided' });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o', 
        messages: [
          {
            role: 'system',
            content: 'You are an expert React developer. Return clean, well-formatted React component code only.',
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: 'OpenAI API error',
        details: data,
      });
    }

    if (!data.choices || !data.choices[0]?.message?.content) {
      return res.status(500).json({
        error: 'No valid response from OpenAI',
        details: data,
      });
    }

    const result = data.choices[0].message.content;

    res.status(200).json({ code: result });

  } catch (err) {
    res.status(500).json({
      error: 'Failed to generate code',
      details: err.message,
    });
  }
}
