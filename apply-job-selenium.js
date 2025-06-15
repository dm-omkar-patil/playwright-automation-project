// apply-job-selenium.js
const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const { saveAppliedJob, wasJobAlreadyApplied } = require('./job-storage');

const user = 'balugadesoham@gmail.com';

async function applyToJob(jobUrl) {
  const options = new chrome.Options();
  options.addArguments('--user-data-dir=./linkedin-chrome-profile'); // Use saved profile to avoid login
  options.addArguments('--start-maximized');

  let driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();

  try {
    await driver.get(jobUrl);
    await driver.sleep(3000); // Wait for job page to load

    const jobTitle = await driver.findElement(By.css('h1')).getText();
    const company = await driver.findElement(By.css('.topcard__org-name-link, .topcard__flavor')).getText();

    if (wasJobAlreadyApplied(jobTitle, company)) {
      console.log(`⏭️ Already applied to: ${jobTitle} at ${company}`);
      return;
    }

    // Check and click "Easy Apply"
    const easyApplyBtn = await driver.findElements(By.xpath("//button[contains(., 'Easy Apply')]"));
    if (easyApplyBtn.length === 0) {
      console.log('🔸 Easy Apply not available, skipping...');
      return;
    }

    await easyApplyBtn[0].click();
    await driver.sleep(2000);

    const submitBtns = await driver.findElements(By.css('button[aria-label="Submit application"]'));
    if (submitBtns.length > 0) {
      await submitBtns[0].click();
      saveAppliedJob(jobTitle, company, jobUrl, user);
      console.log(`✅ Application submitted: ${jobTitle} at ${company}`);
    } else {
      console.log('⏭️ Multi-step application detected. Skipping...');
      const dismiss = await driver.findElements(By.css('button[aria-label="Dismiss"]'));
      if (dismiss.length > 0) await dismiss[0].click();
    }
  } catch (err) {
    console.error('❌ Error applying to job:', err.message);
  } finally {
    await driver.quit();
  }
}

module.exports = { applyToJob };
