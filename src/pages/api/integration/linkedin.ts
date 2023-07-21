import { NextApiRequest, NextApiResponse } from "next";
import puppeteer from "puppeteer";
import path from "path";
import fse from "fs-extra";

const LINKEDIN_URL = "https://www.linkedin.com";

async function getFolderSize(folderPath: string): Promise<number> {
  let totalSize = 0;
  const files = await fse.readdir(folderPath);

  for (const file of files) {
    const filePath = path.join(folderPath, file);
    const stats = await fse.stat(filePath);

    if (stats.isFile()) {
      totalSize += stats.size;
    } else if (stats.isDirectory()) {
      totalSize += await getFolderSize(filePath);
    }
  }

  return totalSize;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let browser = null;
  try {
    const { email, password } = req.body;

    const defaultWaitingTime = 60000 * 5; // 5 mins

    const folderPath = `./linkedin-data/${Date.now()}`;

    console.log("FOLDER PATH SET-=========");
    browser = await puppeteer.launch({
      headless: false,
      userDataDir: folderPath,
      // executablePath: isLocal ? undefined : "/usr/bin/google-chrome",
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--single-process"],
    });

    console.log("BROWSER INITIATED-=========");

    const page = await browser.newPage();

    await page.goto(`${LINKEDIN_URL}/login`, {
      timeout: defaultWaitingTime,
      waitUntil: "domcontentloaded",
    });

    console.log("PAGE INITIATED-=========");

    await page.type("#username", email);
    await page.type("#password", password);
    await page.click(".login__form_action_container button");

    // Retry mechanism for finding selector
    const maxRetryAttempts = 5;
    let retryAttempt = 0;
    while (retryAttempt < maxRetryAttempts) {
      try {
        await page.waitForSelector(".feed-container-theme", {
          timeout: defaultWaitingTime,
        });
        console.log("LOGIN SUCCESSFUL-=========");
        break;
      } catch (error) {
        console.log(
          `Retrying to find the selector (${
            retryAttempt + 1
          }/${maxRetryAttempts})`
        );
        retryAttempt++;
        if (retryAttempt === maxRetryAttempts) {
          throw new Error(
            "Failed to find the selector after multiple attempts"
          );
        }
      }
    }

    await page.goto(`${LINKEDIN_URL}/in/`);

    console.log("REDIRECTED TO PROFILE-=========");
    await page.waitForSelector(".pvs-profile-actions", {
      timeout: defaultWaitingTime,
    });

    console.log("FOLDER PATH:", folderPath);
    const folderSizeInBytes = await getFolderSize(folderPath);
    const folderSizeInMB = folderSizeInBytes / (1024 * 1024);
    console.log(`Folder size: ${folderSizeInMB.toFixed(2)} MB`);

    res.send("ok");
  } catch (error) {
    console.log("=====PUPPETEER ERROR=========");
    console.log(error);
    res.json(error);
  } finally {
    if (browser !== null) {
      await browser.close();
      console.log("BROWSER CLOSED-=========");
    }
  }
}
