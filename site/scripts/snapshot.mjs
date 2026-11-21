// Fetches real GitHub numbers at build time so the page never shows an empty board,
// even when a visitor's browser hits the API rate limit. The page still refreshes live.
import { writeFile } from 'node:fs/promises';

const USER = process.env.GH_USER || 'Harshitamugdha';
const headers = { Accept: 'application/vnd.github+json', 'User-Agent': 'portfolio-snapshot' };
if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

const get = async url => {
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.json();
};

const [user, repos, commits] = await Promise.all([
  get(`https://api.github.com/users/${USER}`),
  get(`https://api.github.com/users/${USER}/repos?per_page=100&sort=pushed`),
  get(`https://api.github.com/search/commits?q=author:${USER}&per_page=1`)
]);

const recent = repos
  .filter(r => !r.fork && r.name.toLowerCase() !== USER.toLowerCase())
  .slice(0, 4)
  .map(r => r.name);

const snapshot = {
  user: USER,
  repos: user.public_repos,
  commits: commits.total_count,
  recent,
  takenAt: new Date().toISOString()
};

await writeFile(new URL('../src/data/github.json', import.meta.url), `${JSON.stringify(snapshot, null, 2)}\n`);
console.log(snapshot);
