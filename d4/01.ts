import OpenAI from "openai";

const argv = require('minimist')(process.argv.slice(2));

const openAiAPI = async (task) => {
    const openai = new OpenAI({
        apiKey: Bun.env.OPENAI_KEY
    });

    const moderation = await openai.moderations.create({ input: task.input });
    const answer = (moderation.results.map(el => el.flagged ? 1 : 0));
    
    return answer;
}


const { code, token, msg } = await fetch(`https://zadania.aidevs.pl/token/${argv.task}`, {
    method: 'POST',
    body: JSON.stringify({ apikey: Bun.env.API_KEY })
}).then(r => r.json());

if (code === 0) {
    const task = await fetch(`https://zadania.aidevs.pl/task/${token}`).then(r => r.json());
    const answer = await openAiAPI(task);
    const answerAsString = JSON.stringify({answer});

    const sendAnswer = await fetch(`https://zadania.aidevs.pl/answer/${token}`, {
        method: 'POST',
        body: answerAsString
    }).then(r => r.json());
} else {
    console.error('Hmm, wystąpił jakiś błąd', code, msg);
}

export { };