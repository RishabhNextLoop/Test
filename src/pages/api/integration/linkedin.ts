import nanoid from "nanoid";
import { NextApiRequest, NextApiResponse } from "next";
import puppeteer from "puppeteer";
import chromium from "chromium";

const LINKEDIN_URL = "https://www.linkedin.com";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const defaultWaitingTime = 60000 * 5; // 5 mins
    // if (!user) {
    // 	res.send('no user')
    // }

    const folderPath = `./linkedin-data/${nanoid()}`;
    console.log("FOLDER PATH SET-=========");
    // const isLocal = process.env.APP_ENV === "dev";
    const browser = await puppeteer.launch({
      headless: false,
      args: [],
      userDataDir: folderPath,
      executablePath: chromium.path,
    });
    console.log(chromium.path, "here2");
    console.log("BROWSER INITIATED-=========");

    const page = await browser.newPage();
    await page.goto(`${LINKEDIN_URL}/login`, {
      timeout: defaultWaitingTime,
    });

    console.log("PAGE INITIATED-=========");

    await page.waitForSelector(".feed-container-theme", {
      timeout: defaultWaitingTime,
    });
    // redirect them to their own profile
    await page.goto(`${LINKEDIN_URL}/in/`);

    const browserWSEndpoint = browser.wsEndpoint();
    const userDataDir = browserWSEndpoint.split("/")[3];
    console.log("USER DATA DIR-=========");
    console.log(userDataDir);

    console.log("REDIRECTED TO PROFILE-=========");
    // we wait for it to be loaded
    await page.waitForSelector(".pvs-profile-actions", {
      timeout: defaultWaitingTime,
    });

    await browser.close();
    res.send("ok");
  } catch (error) {
    console.log("=====PUPPETEER ERROR=========");
    console.log(error);
    res.json(error);
  }
}
