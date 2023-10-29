import chalk from 'chalk';

export const showLogFromObject = obj => {
    for (const key of Object.keys(obj)) {
        console.log(`${chalk.green(key)}: ${chalk.bold.blue(obj[key])}
        ---`);
    }
}

export const log = (text: string) => {
    console.log(chalk.green(text));
}

export const logError = (text: string) => {
    console.log(chalk.bold.red(text));
}