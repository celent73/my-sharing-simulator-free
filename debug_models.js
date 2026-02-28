const https = require('https');

const apiKey = process.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
    console.error("Please provide VITE_GEMINI_API_KEY env var");
    process.exit(1);
}

const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

https.get(url, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            if (json.error) {
                console.error("API Error:", json.error);
            } else {
                console.log("Available Models:");
                if (json.models) {
                    json.models.forEach(m => {
                        if (m.supportedGenerationMethods.includes("generateContent")) {
                            console.log(`- ${m.name} (Methods: ${m.supportedGenerationMethods.join(', ')})`);
                        }
                    });
                } else {
                    console.log("No models found?", json);
                }
            }
        } catch (e) {
            console.error("Parse Error:", e);
            console.log("Raw Response:", data);
        }
    });

}).on('error', (err) => {
    console.error("Network Error:", err);
});
