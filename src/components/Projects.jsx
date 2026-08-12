import { ArrowUpRight } from './icons';
import Band from './Band';
import Reveal from './Reveal';
import { useGlass } from '../lib/useGlass';

/**
 * `repo` is deliberately null until a real per-project URL exists — a
 * "Code" affordance that lands on a bare profile costs more credibility
 * than showing no link at all. Fill one in and the link appears.
 * `image` is the same deal: optional, and its absence leaves no hole.
 */
const PROJECTS = [
  {
    title: 'Urbo',
    year: '2026',
    blurb:
      'An Arduino/ESP32 environmental buddy: it reads air quality, temperature, humidity, noise and pressure, then acts — pair it to the app and it kicks on the AC when the room passes 33°C via a local Home Assistant instance.',
    stack: ['Arduino', 'ESP32', 'C++', 'Home Assistant'],
    repo: null,
    image: null,
  },
  {
    title: 'LinkerFlow',
    year: '2025',
    blurb:
      'A dry-lab tool that automates protein-linker selection: it scores candidates for a multi-domain protein and pipes structures straight into ColabFold (AlphaFold) for folding prediction.',
    stack: ['Python', 'AI', 'ColabFold'],
    repo: null,
    image: null,
  },
  {
    title: 'Eco Dashboard',
    year: '2025',
    blurb:
      'The data layer behind a 280% recycling jump: a web app that lets the whole school read waste and recycling figures at a glance, charted from live CSV.',
    stack: ['Vanilla JS', 'Chart.js', 'PapaParse'],
    repo: null,
    image: null,
  },
];

export default function Projects() {
  const glass = useGlass();

  return (
    <Band
      id="projects"
      band="590"
      lambda="λ 590nm"
      name="Projects"
      intro="Things I built to answer my own questions — hardware, AI pipelines, and the glue between them."
    >
      <div className="project-grid">
        {PROJECTS.map((p, i) => (
          <Reveal key={p.title} as="article" i={i} className="glass project-card" {...glass}>
            {p.image && (
              <figure className="project-figure">
                <img src={p.image} alt="" loading="lazy" decoding="async" />
              </figure>
            )}

            <div className="project-top">
              <h3 className="project-title">{p.title}</h3>
              <span className="project-year">{p.year}</span>
            </div>

            <p className="project-blurb">{p.blurb}</p>

            <div className="project-foot">
              <ul className="project-stack">
                {p.stack.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
              {p.repo && (
                <a className="project-link" href={p.repo} target="_blank" rel="noreferrer">
                  Code <ArrowUpRight size={14} stroke={2.2} />
                </a>
              )}
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal className="toolkit" i={3}>
        <span className="toolkit-label">Toolkit</span>
        <ul className="toolkit-items">
          <li><strong>Python</strong> <em>advanced</em></li>
          <li><strong>TensorFlow</strong> <em>advanced</em></li>
          <li>PyTorch</li>
          <li>C++</li>
          <li>TypeScript</li>
          <li>Arduino / ESP32</li>
          <li>Data viz &amp; analysis</li>
        </ul>
      </Reveal>
    </Band>
  );
}
