import {showLogFromObject, log, logError} from '../log';
import { openAiAPI } from '../open-ai';
import {code, token, msg} from '../token';

const argv = require('minimist')(process.argv.slice(2));


const sendQuestion = async (question, token) => {
    let formData = new FormData();
    formData.append('question', question);

    return await fetch(`https://zadania.aidevs.pl/task/${token}`, {
        method: 'POST',
        body: formData
    }).then(r => r.json());
}

if (code === 0) {
    const {answer} = await sendQuestion(argv.q, token);
    const isAnswerTrue = await openAiAPI(`Is the message on topic? Only YES or NO uppercase. #### context: ${argv.q}`, `${answer}`);
    const sendAnswer = await fetch(`https://zadania.aidevs.pl/answer/${token}`, {
        method: 'POST',
        body: JSON.stringify({answer: isAnswerTrue})
    }).then(r => r.json());

    log(`${sendAnswer.msg}, ${sendAnswer.note}`);

} else {
    logError(`${code} - Hmm, wystąpił jakiś błąd: 
    ${msg}`);
}

export { };