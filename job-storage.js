const fs = require('fs');
const path = './applied-jobs.json';

function loadAppliedJobs() {
  if (!fs.existsSync(path)) return [];
  return JSON.parse(fs.readFileSync(path));
}

function saveAppliedJob(jobTitle, companyName, jobUrl, user) {
  const appliedJobs = loadAppliedJobs();
  appliedJobs.push({
    user,
    jobTitle,
    companyName,
    jobUrl,
    date: new Date().toISOString()
  });
  fs.writeFileSync(path, JSON.stringify(appliedJobs, null, 2));
}

function wasJobAlreadyApplied(jobTitle, companyName) {
  const appliedJobs = loadAppliedJobs();
  return appliedJobs.some(
    (j) => j.jobTitle === jobTitle && j.companyName === companyName
  );
}

module.exports = { saveAppliedJob, wasJobAlreadyApplied };
