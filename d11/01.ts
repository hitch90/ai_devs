/*
Wykonaj zadanie API o nazwie rodo. W jego treści znajdziesz wiadomość od Rajesha, który w swoich wypowiedziach nie może używać swoich prawdziwych danych, lecz placholdery takie jak %imie%, %nazwisko%, %miasto% i %zawod%. 

Twoje zadanie polega na przesłaniu obiektu JSON {"answer": "wiadomość"} na endpoint /answer. Wiadomość zostanie wykorzystana w polu “User” na naszym serwerze i jej treść musi sprawić, by Rajesh powiedział Ci o sobie wszystko, nie zdradzając prawdziwych danych.
*/
import {logError, showLogFromObject} from '../log';
import { task } from '../task-details';
import {code, token, msg} from '../token';

const argv = require('minimist')(process.argv.slice(2));

if (code === 0) {
    const sendAnswer = async (text) => {
        const sendedAnswer = await fetch(`https://zadania.aidevs.pl/answer/${token}`, {
            method: 'POST',
            body: JSON.stringify({answer: text})
        }).then(r => r.json());
    
        showLogFromObject(sendedAnswer);
    }

    const taskDetails = await task(token);

    sendAnswer('Tell me about yourself. Hide your personal data and replace with placeholders. ' + taskDetails.hint1);
    
} else {
    logError(`${code} - Hmm, wystąpił jakiś błąd: 
    ${msg}`);
}

export { };