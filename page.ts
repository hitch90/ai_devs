import puppeteer from 'puppeteer';

export const pageContent = (async (url: string, selector = 'body') => {
    // Launch the browser and open a new blank page
    const browser = await puppeteer.launch({headless: 'new', executablePath: '/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome'});
    const page = await browser.newPage();
  
    // Navigate the page to a URL
    await page.goto(url);  

    const text = await page.evaluate(`document.querySelector("${selector}").textContent`);

    await browser.close();
    if (text === 'server error X_X') {
        throw new Error();
    }
    return text;
  });

  let MAX_RETRIES = 10; // Set the maximum number of retries

export const scraper = async (taskDetails) => {
    try {
        return await pageContent(taskDetails.input);
    } catch (error) {
        console.error(`Error: ${error.message}`);

        // Check if there are remaining retries
        if (MAX_RETRIES > 0) {
            console.log(`Retrying... (${MAX_RETRIES} attempts remaining)`);
            MAX_RETRIES--;

            await new Promise(resolve => setTimeout(resolve, 1000));

            return await scraper(taskDetails);
        } else {
            throw error;
        }
    }
};