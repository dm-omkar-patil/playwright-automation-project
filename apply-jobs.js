const { chromium } = require('playwright');
const fs = require('fs');
const { wasJobAlreadyApplied } = require('./job-storage');
const { applyToJob } = require('./apply-job-selenium');

const user = 'balugadesoham@gmail.com'; // Replace or make dynamic in production

(async () => {
  const userDataDir = './linkedin-session';

  const browser = await chromium.launchPersistentContext(userDataDir, {
    headless: false,
  });

  const page = await browser.newPage();

  console.log('🔐 Opening LinkedIn...');
  await page.goto('https://www.linkedin.com/feed/');
  await page.waitForTimeout(3000);

  const currentUrl = page.url();
  if (currentUrl.includes('/checkpoint') || currentUrl.includes('captcha')) {
    console.warn('⚠️ CAPTCHA or checkpoint detected. Please solve it using login-and-pause.js first.');
    await browser.close();
    process.exit(1);
  }

  console.log('✅ Logged in. Navigating to job search page...');

  const jobSearchUrl = 'https://www.linkedin.com/jobs/search/?keywords=DevOps&location=India&f_AL=true';
  await page.goto(jobSearchUrl, { waitUntil: 'domcontentloaded' });

  // Repeated scrolling to trigger full lazy load
  console.log('📜 Scrolling to load job listings...');
  for (let i = 0; i < 5; i++) {
    await page.mouse.wheel(0, 1000);
    await page.waitForTimeout(2000);
  }

  // Wait for updated job card selector
  try {
    await page.waitForSelector('.job-card-container--clickable, .job-card-container', { timeout: 15000 });
  } catch (err) {
    console.error('❌ Could not find job listings. Dumping HTML...');
    const html = await page.content();
    fs.writeFileSync('page-dump.html', html);
    await browser.close();
    return;
  }

  const jobCards = await page.$$('.job-card-container--clickable, .job-card-container');

  if (jobCards.length === 0) {
    console.warn('⚠️ No jobs loaded. Check filters or CAPTCHA.');
    await browser.close();
    return;
  }

  console.log(`📄 Found ${jobCards.length} jobs. Collecting Easy Apply links...`);

  const easyApplyJobs = [];

  for (const card of jobCards) {
    try {
      await card.click();
      await page.waitForTimeout(3000);

      const easyApply = await page.$('button:has-text("Easy Apply")');
      if (easyApply) {
        const jobTitleEl = await page.$('h2.top-card-layout__title, h1.top-card-layout__title');
        const companyEl = await page.$('span.topcard__flavor, a.topcard__org-name-link');
        const jobUrl = page.url();

        const jobTitle = jobTitleEl ? await jobTitleEl.innerText() : 'Unknown Title';
        const companyName = companyEl ? await companyEl.innerText() : 'Unknown Company';

        if (wasJobAlreadyApplied(jobTitle, companyName)) {
          console.log(`⏭️ Already applied to: ${jobTitle} at ${companyName}`);
          continue;
        }

        easyApplyJobs.push(jobUrl);
        console.log(`🔹 Added job for applying via Selenium: ${jobTitle} at ${companyName}`);
      } else {
        console.log('🔸 Easy Apply not available, skipping...');
      }
    } catch (err) {
      console.error('⚠️ Error collecting job info:', err.message);
    }
  }

  await browser.close();

  if (easyApplyJobs.length === 0) {
    console.log('⚠️ No Easy Apply jobs to process.');
    return;
  }

  console.log(`🚀 Applying to ${easyApplyJobs.length} jobs using Selenium...`);

  for (const url of easyApplyJobs) {
    await applyToJob(url);
  }
})();
