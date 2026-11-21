import { useEffect, useState } from 'react';
import snapshot from './data/github.json';
import { site } from './config';

const CACHE_KEY = 'hm-github-v1';
const CACHE_MS = 30 * 60 * 1000;

const readCache = () => {
  try {
    const raw = window.localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    return Date.now() - data.at < CACHE_MS ? data.value : null;
  } catch {
    return null;
  }
};

const writeCache = value => {
  try {
    window.localStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), value }));
  } catch {
    /* storage can be unavailable; the snapshot still covers us */
  }
};

const visibleRepos = list => list.filter(name => !site.hideRepos.includes(name)).slice(0, 3);

// Starts from the build-time snapshot (real numbers, never empty), then refreshes from the live API.
export function useGitHub() {
  const [state, setState] = useState(() => ({
    repos: snapshot.repos,
    commits: snapshot.commits,
    recent: visibleRepos(snapshot.recent),
    status: 'snapshot',
    at: snapshot.takenAt
  }));

  useEffect(() => {
    const cached = readCache();
    if (cached) {
      setState({ ...cached, recent: visibleRepos(cached.recent), status: 'live' });
      return undefined;
    }

    const controller = new AbortController();
    const get = url =>
      fetch(url, { signal: controller.signal, headers: { Accept: 'application/vnd.github+json' } }).then(r => {
        if (!r.ok) throw new Error(String(r.status));
        return r.json();
      });

    const user = site.github;
    Promise.all([
      get(`https://api.github.com/users/${user}`),
      get(`https://api.github.com/users/${user}/repos?per_page=100&sort=pushed`),
      get(`https://api.github.com/search/commits?q=author:${user}&per_page=1`)
    ])
      .then(([profile, repos, commits]) => {
        const value = {
          repos: profile.public_repos,
          commits: commits.total_count,
          recent: repos.filter(r => !r.fork && r.name.toLowerCase() !== user.toLowerCase()).map(r => r.name),
          at: new Date().toISOString()
        };
        writeCache(value);
        setState({ ...value, recent: visibleRepos(value.recent), status: 'live' });
      })
      .catch(err => {
        if (err.name !== 'AbortError') setState(s => ({ ...s, status: 'snapshot' }));
      });

    return () => controller.abort();
  }, []);

  return state;
}
