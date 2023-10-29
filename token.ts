const argv = require('minimist')(process.argv.slice(2));

export const { code, token, msg } = await fetch(`https://zadania.aidevs.pl/token/${argv.task}`, {
    method: 'POST',
    body: JSON.stringify({ apikey: Bun.env.API_KEY })
}).then(r => r.json());
