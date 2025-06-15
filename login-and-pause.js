const { chromium } = require('playwright');

(async () => {
  const userDataDir = './linkedin-session';

  const browser = await chromium.launchPersistentContext(userDataDir, {
    headless: false, // Keep it visible for manual actions
    slowMo: 50,      // Optional: slow down actions
  });

  const page = await browser.newPage();
  await page.goto('https://www.linkedin.com/login');

  console.log(`
🔐 Manually log in and complete CAPTCHA/2FA if needed.
✅ Close the browser window once you're successfully logged in.
`);

  // Keep the browser open for user to manually log in
})();
