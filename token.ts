const argv = require('minimist')(process.argv.slice(2));

export const getToken: any = async () => await fetch(`https://zadania.aidevs.pl/token/${argv.task}`, {
    method: 'POST',
    body: JSON.stringify({ apikey: process.env.API_KEY })
}).then(r => r.json());