async function fetchOpenApiKey() {
    const response = await fetch('/api-keys/openapi');
    const data = await response.json();
    return data.openApiKey;
}


const openApiRequest = async (YourLocation) => {
    try{
        const conversation = await fetchHistory(msg);

        // Post prompt and Get openAI response
        const chatCompletion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo-1106',
            messages: conversation,
            max_tokens: 30,
        });

        const response = chatCompletion.choices[0].message.content;
        // console.log(JSON.stringify(chatCompletion, null, 2));
        return { response };
        
    } catch (error) {
            console.error('openAI Request Error:', error);
    }
}


 module.exports = openApiRequest;