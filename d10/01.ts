/*
Korzystając z modelu Whisper wykonaj zadanie API (zgodnie z opisem na zadania.aidevs.pl) o nazwie whisper. W ramach zadania otrzymasz plik MP3 (15 sekund), który musisz wysłać do transkrypcji, a otrzymany z niej tekst odeślij jako rozwiązanie zadania.
*/
import {log, logError, showLogFromObject} from '../log';
import { task } from '../task-details';
import {code, token, msg} from '../token';
import { ChatOpenAI } from "langchain/chat_models/openai";
import {BaseMessageChunk, HumanMessage} from "langchain/schema";

const argv = require('minimist')(process.argv.slice(2));

if (code === 0) {
    const sendAnswer = async (text) => {
        const sendedAnswer = await fetch(`https://zadania.aidevs.pl/answer/${token}`, {
            method: 'POST',
            body: JSON.stringify({answer: text})
        }).then(r => r.json());
    
        log(`${sendedAnswer.msg}, ${sendedAnswer.note}`);
    }

    const taskDetails = await task(token);

    showLogFromObject(taskDetails);


    const queryEnrichmentSchema = {
        "name": "addUser",
        "parameters": {
            "type": "object",
            "properties": {
                "name": {
                    "type": "string",
                    "description": "first name of the user"
                },
                "surname": {
                    "type": "string",
                    "description": "Surname of the user",
                },
                "year": {
                    "type": "integer",
                    "description": "year of born",
                }
            },
            "required": [
                "name", "surname", "year"
            ]
        }
    };
    const model = new ChatOpenAI({
        openAIApiKey: Bun.env.OPENAI_KEY,
        modelName: "gpt-4",
    }).bind({
        functions: [queryEnrichmentSchema],
        function_call: { name: "addUser" },
    });

    const result = await model.invoke([
        new HumanMessage(taskDetails.msg + taskDetails.hint1)
    ]);

    const parseFunctionCall = (result: BaseMessageChunk): { name: string, args: any } | null => {
        if (result?.additional_kwargs?.function_call === undefined) {
            return null;
        }
        return {
            name: result.additional_kwargs.function_call.name,
            args: JSON.parse(result.additional_kwargs.function_call.arguments),
        }
    }

    console.log(parseFunctionCall(result));

    
} else {
    logError(`${code} - Hmm, wystąpił jakiś błąd: 
    ${msg}`);
}

export { };