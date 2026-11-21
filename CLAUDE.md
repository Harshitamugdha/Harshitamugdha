# CLAUDE.md

GitHub profile repo for **Harshitamugdha** (Harshita Mugdha, "Sia"). It holds two things:

1. `README.md`: the profile page GitHub shows. GitHub strips JS and custom CSS, so motion here is only a GIF, SVGs and stats-service images.
2. `site/`: the real portfolio (Vite + React + GSAP + OGL), deployed to GitHub Pages at
   `https://harshitamugdha.github.io/Harshitamugdha/`. The README's top GIF is a screen recording of this site.

Positioning: **UI/UX designer who also builds the code.** Copy and design choices should support that.

## Layout

```
README.md                     profile README (GIF hero, stats cards, snake)
assets/portfolio-preview.gif  recording of the site, embedded at the top of README
assets/header-*.svg           old animated header, no longer used (safe to delete)
.github/workflows/snake.yml   daily contribution-snake SVGs -> `output` branch
.github/workflows/pages.yml   builds site/ and deploys to Pages (daily + on push to site/)
site/
  src/config.js               ALL editable content: name, links, work items, process steps
  src/App.jsx                 page sections: Nav, Hero, Numbers, Work, Process, Contact
  src/styles.css              design tokens + all layout CSS
  src/useGitHub.js            live GitHub numbers (snapshot first, then live fetch)
  src/Reveal.jsx              scroll-in fade, IntersectionObserver based
  src/data/github.json        build-time snapshot of repos/commits/recent repos
  src/components/             React Bits components, vendored verbatim (see below)
  scripts/snapshot.mjs        refreshes src/data/github.json from the GitHub API
  public/                     hero.jpg (rendered ceramic cat), texture.jpg, stylesync-bg.jpg
```

## Commands (run inside `site/`)

```bash
npm ci              # install
npm run dev         # local dev server
npm run snapshot    # refresh src/data/github.json (needs network to api.github.com)
npm run build       # production build to site/dist
npm run preview     # serve the build
```

There are no tests. "Done" means `npm run build` passes and the page has been looked at in a browser at desktop (1440px) and mobile (390px) widths, with no horizontal scroll on mobile.

## Content rules

- Edit content in `src/config.js`, not in `App.jsx`.
- **Never invent claims.** Every project, role, number and skill on the page or README must be true. Unverified right now: Udgam "I built the frontend", the four Process lines, Figma in the README stack. Ask before adding new claims.
- Only link repos that are public. (`mini-vercel` is not public, so it is not linked.)
- GitHub numbers are never hardcoded in the UI. They come from `useGitHub()`: snapshot JSON first (so the boards are never empty), then a live fetch cached in localStorage for 30 minutes. "Public commits" is the GitHub commit-search count, so it only covers public commits.

## Design rules

- **One theme, dark only.** Tokens live at the top of `styles.css`. Don't add a light section.
- **One accent: `#b5e853` (lime).** Text on the accent is `--on-accent`. Light-mode README cards use `#4d7c0f` as the readable lime.
- **Shapes:** cards and media 16px radius, flap tiles 6px, buttons and pills fully round.
- **Type:** Geist Variable + Geist Mono Variable via `@fontsource-variable`. No serif, no Inter.
- **No em dashes or en dashes** in any visible text. Use hyphens, commas or periods.
- No emoji, no eyebrow labels above every heading, no fake screenshots built from divs.
- One CTA label per intent: contact is always "Get in touch".
- Motion has to have a reason, and all of it must respect `prefers-reduced-motion`. The React Bits components already handle this; `.reveal` handles it in CSS.

## React Bits components (`src/components/`)

`MaskedHeading`, `SplitFlapText` and `DitherVeil` are copied **verbatim** from React Bits. Don't edit them. Configure them through props, or wrap them.

- **MaskedHeading** (hero name): the media inside the letters is zoomed past the heading, which used to widen the page on mobile. `.hero__copy { overflow-x: clip }` fixes that. Keep it.
- **SplitFlapText** (Numbers section): the boards get `''` until the section scrolls into view (`useSeen`), so visitors actually see them flip. Numbers are zero-padded (`023`, `0408`) so no tile shows a blank flap.
- **DitherVeil** (hero visual): the image must be same-origin or served with CORS. `pixelSize={3}` is deliberate, because 2px dither turns to mush in the README GIF.

## Images

`public/hero.jpg`, `texture.jpg` and `stylesync-bg.jpg` are original renders (raymarched cat, procedural marble). No stock photos. If you swap the hero, use a 4:5 image with a plain dark background; the dither reads best that way. `stylesync-bg.jpg` is a placeholder until real StyleSync screens exist. Replacing it with actual case-study screens is the highest-value improvement for the designer positioning.

## Updating the README GIF

Re-record whenever the hero or the Numbers section changes visibly:

1. Run `npm run build && npm run preview`.
2. Record about 15s with Playwright at 1280x800: hero entrance, cursor over the cat, cursor over the name, smooth scroll to `#numbers`, hold while the boards flip. Block `api.github.com` during recording so the real snapshot numbers show.
3. Convert the recording:
   ```bash
   ffmpeg -ss 0.6 -i recording.webm -vf "fps=10,scale=960:-1:flags=lanczos,split[s0][s1];[s0]palettegen=max_colors=96:stats_mode=diff[p];[s1][p]paletteuse=dither=none:diff_mode=rectangle" assets/portfolio-preview.gif
   ```
4. Keep the GIF under about 8 MB.

## Deploy

- In repo Settings, set Pages > Source to **GitHub Actions**. `pages.yml` refreshes the snapshot (with `GITHUB_TOKEN`), builds and deploys.
- `vite.config.js` uses `base: './'` so the build works under the `/Harshitamugdha/` subpath. Asset URLs in code go through `import.meta.env.BASE_URL`.
- Snake: run the "Contribution snake" workflow once to create the `output` branch the README points at.

## Gotchas

- Remote file tools can't write inside `.github/`. If a workflow file lands in `MOVE-TO-.github-workflows/`, move it by hand.
- `npm run snapshot` can fail with `EAI_AGAIN` on some networks. The committed `github.json` still holds real numbers, and the Pages workflow continues past a failed snapshot.
- The public `github-readme-stats.vercel.app` instance is rate-limited. If its cards break in the README, self-host it on Vercel and swap the domain.
