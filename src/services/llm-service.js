const axios = require('axios');

async function summarizeText(text) {
    const apiKey = 'OIrn4pAi6TIyzCIiVDVFkHjdM31o4BWu';
    const encodedText = encodeURIComponent(text);

    const apiUrl = `https://text-summarizer.unicornapi.co/v1?api_key=${apiKey}&text=${encodedText}`;

    try {
        const response = await axios.get(apiUrl);
        
        // console.log(response.data);
        return response.data
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
        return null;
        
    }
}

module.exports = summarizeText;
