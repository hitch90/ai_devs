/*
Korzystając z modelu text-embedding-ada-002 wygeneruj embedding dla frazy Hawaiian pizza. 
Upewnij się, że to dokładnie to zdanie. Następnie prześlij wygenerowany embedding na endpoint /answer. 
Konkretnie musi być to format {"answer": [0.003750941, 0.0038711438, 0.0082909055, -0.008753223, -0.02073651, -0.018862579, -0.010596331, -0.022425512, ..., -0.026950065]}. Lista musi zawierać dokładnie 1536 elementów.
*/
import {log, logError} from '../log';
import {code, token, msg} from '../token';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
const argv = require('minimist')(process.argv.slice(2));

if (code === 0) {

    const embeddings = new OpenAIEmbeddings({
        openAIApiKey: Bun.env.OPENAI_KEY,
    });

    const answer = await embeddings.embedQuery("Hawaiian pizza");
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