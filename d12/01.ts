/*

*/
import { logError, showLogFromObject } from '../log';
import { scraper } from '../page';
import { task } from '../task-details';
import { code, token, msg } from '../token';
import {HumanMessage, SystemMessage} from "langchain/schema";
import {ChatOpenAI} from "langchain/chat_models/openai";

const argv = require('minimist')(process.argv.slice(2));

if (code === 0) {
    const sendAnswer = async (text) => {
        const sendedAnswer = await fetch(`https://zadania.aidevs.pl/answer/${token}`, {
            method: 'POST',
            body: JSON.stringify({ answer: text })
        }).then(r => r.json());

        showLogFromObject(sendedAnswer);
    }

    const taskDetails = await task(token);
    try {
        const page = await scraper(taskDetails);

        const chat = new ChatOpenAI({
            openAIApiKey: Bun.env.OPENAI_KEY,
            modelName: "gpt-4",
        });

        const { content } = await chat.call([
            new SystemMessage(`
                ${taskDetails.msg}.
                context###${page}###
            `),
            new HumanMessage(taskDetails.question),
        ]);
        await sendAnswer(content);
      } catch (error) {
        console.error("Max retries reached. Unable to complete operation.", error);
      }
} else {
    logError(`${code} - Hmm, wystąpił jakiś błąd: 
    ${msg}`);
}

export { };