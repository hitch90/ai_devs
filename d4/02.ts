import OpenAI from "openai";

const argv = require('minimist')(process.argv.slice(2));

const openAiAPI = async (task) => {
    const openai = new OpenAI({
        apiKey: Bun.env.OPENAI_KEY
    });

    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            {
                "role": "system",
                "content": `answer truthfully, as briefly as possible. ###context: ${JSON.stringify(task.blog)}`
            },
            {
                "role": "user",
                "content": task.msg + '. Use Polish. Finally format should looks like: {"answer":["tekst 1","tekst 2","tekst 3","tekst 4"]}'
            }
        ],
    });

    return response.choices[0].message.content;
}


const { code, token, msg } = await fetch(`https://zadania.aidevs.pl/token/${argv.task}`, {
    method: 'POST',
    body: JSON.stringify({ apikey: Bun.env.API_KEY })
}).then(r => r.json());

if (code === 0) {
    const task = await fetch(`https://zadania.aidevs.pl/task/${token}`).then(r => r.json());

    console.log('task', task);
    const answer = await openAiAPI(task);
    console.log({info: 'Odpowiedź z Open AI', answer: JSON.parse(answer)});

    const sendAnswer = await fetch(`https://zadania.aidevs.pl/answer/${token}`, {
        method: 'POST',
        body: answer
    }).then(r => r.json());

    console.log('send answer', sendAnswer);
} else {
    console.error('Hmm, wystąpił jakiś błąd', code, msg);
}

export { };