import OpenAI from "openai";

const argv = require('minimist')(process.argv.slice(2));

const openAiAPI = async (system, task) => {
    // This code is for v4 of the openai package: npmjs.com/package/openai

    const openai = new OpenAI({
        apiKey: Bun.env.OPENAI_KEY
    });

    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            {
                "role": "system",
                "content": `answer truthfully, as briefly as possible. context: ${JSON.stringify(system)}`
            },
            {
                "role": "user",
                "content": task
            }
        ],
    });

    return response.choices[0].message.content;
}


const { code, token, msg } = await fetch(`https://zadania.aidevs.pl/token/${argv.task}`, {
    method: 'POST',
    body: JSON.stringify({ apikey: Bun.env.API_KEY })
}).then(r => r.json())

if (code === 0) {
    const task = await fetch(`https://zadania.aidevs.pl/task/${token}`).then(r => r.json());

    console.log('task', task);
    const answer = await openAiAPI(task, task.msg);
    console.log(answer);

    const sendAnswer = await fetch(`https://zadania.aidevs.pl/answer/${token}`, {
        method: 'POST',
        body: JSON.stringify({ answer })
    }).then(r => r.json());

    console.log('send answer', sendAnswer);
} else {
    console.error('Hmm, wystąpił jakiś błąd', code, msg);
}

export { };