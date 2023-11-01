/*
Skorzystaj z API zadania.aidevs.pl, aby pobrać dane zadania inprompt. 
Znajdziesz w niej dwie właściwości — input, czyli tablicę / listę zdań na temat różnych osób 
(każde z nich zawiera imię jakiejś osoby) oraz question będące pytaniem na temat jednej z tych osób. 
Lista jest zbyt duża, aby móc ją wykorzystać w jednym zapytaniu, więc dowolną techniką odfiltruj te zdania, 
które zawierają wzmiankę na temat osoby wspomnianej w pytaniu. 
Ostatnim krokiem jest wykorzystanie odfiltrowanych danych jako kontekst na podstawie którego model ma udzielić odpowiedzi na pytanie. 
Zatem: pobierz listę zdań oraz pytanie, skorzystaj z LLM, aby odnaleźć w pytaniu imię, 
programistycznie lub z pomocą no-code odfiltruj zdania zawierające to imię. 
Ostatecznie spraw by model odpowiedział na pytanie, 
a jego odpowiedź prześlij do naszego API w obiekcie JSON zawierającym jedną właściwość “answer”.
*/
import {log, logError} from '../log';
import { openAiAPI } from '../open-ai';
import {code, token, msg} from '../token';
import {task} from '../task-details';

const argv = require('minimist')(process.argv.slice(2));

if (code === 0) {
    const taskDetails = await task(token);
    const givenName = await openAiAPI(`Return only name from given sentence. Answer with only one word or if you can't find name return 0`, taskDetails.question, 'gpt-4');
    const filteredArray = taskDetails.input.filter(item => item.includes(givenName));
    const answer = await openAiAPI(JSON.stringify(filteredArray), taskDetails.question);

    const sendAnswer = await fetch(`https://zadania.aidevs.pl/answer/${token}`, {
        method: 'POST',
        body: JSON.stringify({answer})
    }).then(r => r.json());

    log(`${sendAnswer.msg}, ${sendAnswer.note}`);

} else {
    logError(`${code} - Hmm, wystąpił jakiś błąd: 
    ${msg}`);
}

export { };