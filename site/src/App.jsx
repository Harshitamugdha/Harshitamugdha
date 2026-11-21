import { useEffect, useRef, useState } from 'react';
import MaskedHeading from './components/MaskedHeading';
import SplitFlapText from './components/SplitFlapText';
import DitherVeil from './components/DitherVeil';
import Reveal from './Reveal';
import { useGitHub } from './useGitHub';
import { site, work, process } from './config';

const asset = path => `${import.meta.env.BASE_URL}${path}`;
const githubUrl = `https://github.com/${site.github}`;
const contactHref = site.email ? `mailto:${site.email}` : githubUrl;

const BOARD = {
  tileColor: '#151613',
  textColor: '#ecede6',
  depth: 0.6,
  glare: 0.25,
  tileRadius: 6,
  charset: 'alphanumeric',
  flipsPerChar: 7,
  stagger: 0.05
};

const fmtDate = iso =>
  new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

function Nav() {
  return (
    <nav className="nav" aria-label="Primary">
      <a href="#top" className="nav__mark" aria-label="Harshita Mugdha, home">
        HM
      </a>
      <div className="nav__links">
        <a href="#numbers">Numbers</a>
        <a href="#work">Work</a>
        <a href="#process">Process</a>
        <a href={contactHref} className="nav__cta">
          Get in touch
        </a>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero__copy">
        <MaskedHeading
          tag="h1"
          text={site.name}
          src={asset('texture.jpg')}
          reveal="scale"
          trigger="mount"
          duration={1.3}
          stagger={0.1}
          align="left"
          weight={700}
          tracking={-0.05}
          lineHeight={1.08}
          textScale={0.205}
          fillScale={1.3}
          parallax={30}
          drift={22}
          hoverZoom={0.06}
          spotlight
          spotlightRadius={220}
          outline
          outlineColor="rgba(236, 237, 230, 0.28)"
          className="hero__name"
        />
        <Reveal delay={500}>
          <p className="hero__lede">
            I design interfaces and then build them, from user research to React to the API underneath.
          </p>
        </Reveal>
        <Reveal delay={650} className="hero__ctas">
          <a href="#work" className="btn btn--primary">
            See the work
          </a>
          <a href={githubUrl} className="btn btn--ghost">
            GitHub
          </a>
        </Reveal>
      </div>

      <Reveal className="hero__visual" delay={150}>
        <DitherVeil
          src={asset(site.heroImage)}
          fit="cover"
          pattern="floyd"
          pixelSize={3}
          inkColor="#0c0d0b"
          paperColor="#ecede6"
          contrast={1.25}
          revealRadius={105}
          softness={0.65}
          linger={0.7}
          rimColor="#b5e853"
          rim={0.14}
          wander
        />
      </Reveal>
    </section>
  );
}

// Boards stay blank until the section is on screen, so visitors actually see them flip.
function useSeen(threshold = 0.3) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setSeen(true);
        io.disconnect();
      }
    }, { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, seen];
}

function Numbers() {
  const gh = useGitHub();
  const [ref, seen] = useSeen();
  const recentWords = gh.recent.length
    ? gh.recent.map(n => n.toUpperCase().replace(/[-_]/g, ' ').slice(0, 15))
    : ['NO PUBLIC REPOS'];

  return (
    <section className="numbers" id="numbers" aria-labelledby="numbers-title" ref={ref}>
      <Reveal className="numbers__intro">
        <h2 id="numbers-title" className="h2">
          Shipping in public.
        </h2>
        <p className="body">
          Live from GitHub.{' '}
          {gh.status === 'live' ? `Updated ${fmtDate(gh.at)}.` : `Snapshot from ${fmtDate(gh.at)}.`}
        </p>
      </Reveal>

      <div className="numbers__boards">
        <Reveal className="stat" delay={80}>
          <span className="stat__label">Public repos</span>
          <SplitFlapText {...BOARD} text={seen ? String(gh.repos).padStart(3, '0') : ''} padTo={3} align="right" fontSize="clamp(40px, 6vw, 76px)" />
        </Reveal>
        <Reveal className="stat" delay={160}>
          <span className="stat__label">Public commits</span>
          <SplitFlapText
            {...BOARD}
            text={seen ? String(gh.commits).padStart(4, '0') : ''}
            padTo={4}
            align="right"
            fontSize="clamp(40px, 6vw, 76px)"
          />
        </Reveal>
      </div>

      <Reveal className="stat stat--wide" delay={120}>
        <span className="stat__label">Recently pushed</span>
        <SplitFlapText
          {...BOARD}
          words={seen ? recentWords : ['']}
          padTo={15}
          cycleDelay={2600}
          order="random"
          fontSize="clamp(20px, 5.2vw, 44px)"
          gap={4}
        />
      </Reveal>
    </section>
  );
}

function Work() {
  return (
    <section className="work" id="work" aria-labelledby="work-title">
      <Reveal>
        <h2 id="work-title" className="h2">
          Selected work
        </h2>
      </Reveal>
      <div className="bento">
        {work.map((item, i) => (
          <Reveal as="article" key={item.id} className={`tile tile--${item.id}`} delay={i * 90}>
            {item.id === 'stylesync' ? (
              <img className="tile__bg" src={asset('stylesync-bg.jpg')} alt="" loading="lazy" />
            ) : null}
            <div className="tile__body">
              <p className="tile__meta">{item.meta}</p>
              <h3 className="tile__title">{item.title}</h3>
              <p className="tile__text">{item.body}</p>
              {item.href ? (
                <a className="tile__link" href={item.href}>
                  {item.linkLabel}
                  <span aria-hidden="true"> ↗</span>
                </a>
              ) : (
                <span className="tile__status">Case study in progress</span>
              )}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Process() {
  return (
    <section className="process" id="process" aria-labelledby="process-title">
      <Reveal>
        <h2 id="process-title" className="h2">
          How I work
        </h2>
      </Reveal>
      <ol className="process__list">
        {process.map((step, i) => (
          <Reveal as="li" key={step.verb} className="process__item" delay={i * 90}>
            <h3 className="process__verb">{step.verb}</h3>
            <p className="body">{step.line}</p>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}

function Contact() {
  return (
    <section className="contact" aria-labelledby="contact-title">
      <Reveal>
        <h2 id="contact-title" className="contact__title">
          Have a product that needs a sharper interface?
        </h2>
        <a href={contactHref} className="btn btn--primary btn--lg">
          Get in touch
        </a>
      </Reveal>
      <footer className="footer">
        <span>© {new Date().getFullYear()} {site.name}</span>
        <span className="footer__links">
          <a href={githubUrl}>GitHub</a>
          {site.linkedin ? <a href={site.linkedin}>LinkedIn</a> : null}
        </span>
      </footer>
    </section>
  );
}

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Numbers />
        <Work />
        <Process />
        <Contact />
      </main>
    </>
  );
}
