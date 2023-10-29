import OpenAI from "openai";

export const openAiAPI = async (system: string, prompt: string, model = 'gpt-3.5-turbo') => {
    const openai = new OpenAI({
        apiKey: Bun.env.OPENAI_KEY
    });

    const response = await openai.chat.completions.create({
        model,
        messages: [
            {
                "role": "system",
                "content": system,
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
    });

    return response.choices[0].message.content;
}