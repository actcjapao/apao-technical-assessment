const axios = require('axios');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

async function generateSummary(text) {
  const response = await axios.post(
    'https://api.openai.com/v1/completions',
    {
      model: 'gpt-3.5-turbo', // or 'gpt-4' if you have access
      messages: [{ role: 'system', content: 'Summarize the following text:' }, { role: 'user', content: text }],
      max_tokens: 200,
    },
    {
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data.choices[0].message.content.trim();
}

module.exports = generateSummary;
