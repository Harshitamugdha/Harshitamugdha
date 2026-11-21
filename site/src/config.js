// Edit this file to personalise the page. Everything else reads from here.
export const site = {
  name: 'Harshita Mugdha',
  github: 'Harshitamugdha',
  // Leave email empty and "Get in touch" points to your GitHub profile instead.
  email: '',
  linkedin: '',
  // Hero image: a rendered ceramic cat (public/hero.jpg, 4:5). Any photo works; the dither
  // looks best with a plain background and one strong light source.
  heroImage: 'hero.jpg',
  // Repos to leave out of the "Recently pushed" board.
  hideRepos: ['random-demo-project']
};

export const work = [
  {
    id: 'stylesync',
    title: 'StyleSync',
    meta: 'UX case study',
    body: 'A wardrobe app that styles the clothes you already own. Research, personas and ideation are done; prototyping is next.',
    href: '',
    linkLabel: ''
  },
  {
    id: 'udgam',
    title: 'Udgam',
    meta: 'Smart India Hackathon 2026',
    body: 'Satellite forensics that traces an oil spill back to the ship that caused it. I built the frontend.',
    href: 'https://github.com/Harshitamugdha/Udgam-SIH-PS143',
    linkLabel: 'Repository'
  },
  {
    id: 'abha',
    title: 'ABHA Portal',
    meta: 'Course project, team of three',
    body: 'A health-record platform built around India’s ABHA ID. Full stack, in TypeScript.',
    href: 'https://github.com/Harshitamugdha/abha-portal',
    linkLabel: 'Repository'
  },
  {
    id: 'rag',
    title: 'Resource Allocation Graph Simulator',
    meta: 'Operating systems, JavaScript',
    body: 'Draw processes and resources, then watch requests and allocations play out as a live graph.',
    href: 'https://github.com/Harshitamugdha/Graphical-Simulator-for-Resource-Allocation-Graphs',
    linkLabel: 'Repository'
  }
];

export const process = [
  { verb: 'Research', line: 'Interviews and competitor teardown before a single frame.' },
  { verb: 'Map', line: 'Flows and information architecture, so screens have a reason to exist.' },
  { verb: 'Prototype', line: 'Clickable and ugly first, polished only after it survives testing.' },
  { verb: 'Build', line: 'React on the front, Node and SQL behind it. I ship what I design.' }
];
