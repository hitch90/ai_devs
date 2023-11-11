/*
Rozwiąż zadanie o nazwie “whoami”. Za każdym razem, gdy pobierzesz zadanie, system zwróci Ci jedną ciekawostkę na temat pewnej osoby. Twoim zadaniem jest zbudowanie mechanizmu, który odgadnie, co to za osoba. W zadaniu chodzi o utrzymanie wątku w konwersacji z backendem. Jest to dodatkowo utrudnione przez fakt, że token ważny jest tylko 2 sekundy (trzeba go cyklicznie odświeżać!). Celem zadania jest napisania mechanizmu, który odpowiada, czy na podstawie otrzymanych hintów jest w stanie powiedzieć, czy wie, kim jest tajemnicza postać. Jeśli odpowiedź brzmi NIE, to pobierasz kolejną wskazówkę i doklejasz ją do bieżącego wątku. Jeśli odpowiedź brzmi TAK, to zgłaszasz ją do /answer/. Wybraliśmy dość ‘ikoniczną’ postać, więc model powinien zgadnąć, o kogo chodzi, po maksymalnie 5-6 podpowiedziach. Zaprogramuj mechanizm tak, aby wysyłał dane do /answer/ tylko, gdy jest absolutnie pewny swojej odpowiedzi.
*/
import { logError, showLogFromObject } from '../log';
import { scraper } from '../page';
import { task } from '../task-details';
import { code, token, msg } from '../token';
import { HumanMessage, SystemMessage } from "langchain/schema";
import { ChatOpenAI } from "langchain/chat_models/openai";

const argv = require('minimist')(process.argv.slice(2));

if (code === 0) {
    const sendAnswer = async (text) => {
        const sendedAnswer = await fetch(`https://zadania.aidevs.pl/answer/${token}`, {
            method: 'POST',
            body: JSON.stringify({ answer: text })
        }).then(r => r.json());

        showLogFromObject(sendedAnswer);
    }

    let hints: string[] = [];
    let answer = `I don't know.`;

    const chat = new ChatOpenAI({
        openAIApiKey: Bun.env.OPENAI_KEY,
        modelName: "gpt-3.5-turbo",
    });


    do {
        const taskDetails = await task(token);
        console.log(taskDetails);
        hints.push(taskDetails.hint);
        const { content } = await chat.call([
            new SystemMessage(` `),
            new HumanMessage(`O jakiej osobie mowa? ${hints.join('.')}. Podaj tylko imię i nazwisko. Jeśli nie wiesz zwróć "I don't know."`),
        ]);

        answer = content;
    } while (answer == `I don't know.`);


    sendAnswer(answer);

} else {
    logError(`${code} - Hmm, wystąpił jakiś błąd: 
    ${msg}`);
}

export { };