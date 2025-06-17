# 🤖 LinkedIn Job Automation Bot

Automates job search and Easy Apply submissions on LinkedIn using **Playwright (for searching)** and **Selenium WebDriver (via Node.js)** for submitting applications.

---

## 🧩 Features

- Searches LinkedIn jobs using Playwright
- Filters out non-Easy Apply jobs
- Uses Selenium (Node.js) to apply
- Tracks which jobs you've applied to
- Skips duplicates
- Session handling for both Playwright and Selenium

---

## ⚙️ Prerequisites

Before running the scripts, make sure you have:

- **Node.js** (v16 or later) — [Download here](https://nodejs.org/)
- **Google Chrome** installed (used by Selenium)
- **Git** (for version control and cloning)

---

## 📦 Installation

# Clone the project
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name

# Install dependencies
npm install

Project Structure
.
├── apply-jobs.js              # Searches LinkedIn jobs using Playwright
├── apply-job-selenium.js      # Applies to Easy Apply jobs using Selenium
├── job-storage.js             # Utility for saving job history
├── applied-jobs.json          # Stores jobs already applied to
├── job_links.json             # Stores Easy Apply job URLs between scripts
├── linkedin-session/          # Playwright session storage (auto-created)
├── .gitignore
└── README.md

1. 🔐 Save Your LinkedIn Session (One Time)
bash
Copy
Edit
node login-and-pause.js
This opens LinkedIn in a Playwright browser.

Manually log in.

Your session is saved in linkedin-session/.

2. 🔍 Search and Collect and apply Jobs
bash
Copy
Edit
node apply-jobs.js
Finds jobs using LinkedIn search

Saves Easy Apply job URLs in job_links.json

❗ Notes
linkedin-session/ is used to avoid logging in every time.

applied-jobs.json keeps track of what you've applied to.

CAPTCHA or LinkedIn security prompts may interrupt flow — solve manually and retry.

🛑 Do Not Commit These Files
Add these to your .gitignore:

gitignore
Copy
Edit
node_modules/
linkedin-session/
applied-jobs.json
job_links.json
page-dump.html

👨‍💻 Author
vstOmkar 
Contributions welcome via PRs or issues!
