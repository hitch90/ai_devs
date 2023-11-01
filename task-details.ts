export const task = async (token: string) => await fetch(`https://zadania.aidevs.pl/task/${token}`).then(r => r.json());
