import { ArrowUpRight } from 'lucide-react';
import Reveal from './Reveal';
import { useGlass } from '../lib/useGlass';

// TODO: swap `href` placeholders for the real per-project repo URLs,
// and `image` placeholders for real artifacts in src/assets/projects/.
const PROJECTS = [
  {
    title: 'Urbo',
    year: '2026',
    blurb:
      'An Arduino/ESP32 environmental buddy: it reads air quality, temperature, humidity, noise and pressure, then acts — pair it to the app and it kicks on the AC when the room passes 33°C via a local Home Assistant instance.',
    stack: ['Arduino', 'ESP32', 'C++', 'Home Assistant'],
    href: 'https://github.com/arbust280',
    image: null,
    specimen: 'hardware photo',
  },
  {
    title: 'LinkerFlow',
    year: '2025',
    blurb:
      'A dry-lab tool that automates protein-linker selection: it scores candidates for a multi-domain protein and pipes structures straight into ColabFold (AlphaFold) for folding prediction.',
    stack: ['Python', 'AI', 'ColabFold'],
    href: 'https://github.com/arbust280',
    image: null,
    specimen: 'structure render',
  },
  {
    title: 'Eco Dashboard',
    year: '2025',
    blurb:
      'The data layer behind a 280% recycling jump: a web app that lets the whole school read waste and recycling figures at a glance, charted from live CSV.',
    stack: ['Vanilla JS', 'Chart.js', 'PapaParse'],
    href: 'https://github.com/arbust280',
    image: null,
    specimen: 'dashboard view',
  },
];

export default function Projects() {
  const track = useGlass();
  return (
    <section className="band" id="projects" style={{ '--band': '#ffb84d' }}>
      <Reveal className="band-label">
        <span className="band-lambda">λ 590nm</span>
        <h2 className="band-name">Projects</h2>
        <span className="band-rule" />
      </Reveal>
      <Reveal className="band-intro" i={1}>
        Things I built to answer my own questions — hardware, AI pipelines, and the glue between them.
      </Reveal>

      <div className="project-grid">
        {PROJECTS.map((p, i) => (
          <Reveal key={p.title} as="article" i={i} className="glass project-card" onMouseMove={track}>
            <div className="project-top">
              <h3 className="project-title">{p.title}</h3>
              <span className="project-year">{p.year}</span>
            </div>

            {/* specimen under glass — real artifact slots in here */}
            <figure className="specimen">
              {p.image ? (
                <img src={p.image} alt={`${p.title} — ${p.specimen}`} loading="lazy" />
              ) : (
                <span className="specimen-pending">specimen · {p.specimen}</span>
              )}
            </figure>

            <p className="project-blurb">{p.blurb}</p>
            <div className="project-foot">
              <ul className="project-stack">
                {p.stack.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
              <a className="project-link" href={p.href} target="_blank" rel="noreferrer">
                Code <ArrowUpRight size={14} strokeWidth={2.2} aria-hidden />
              </a>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal className="glass toolkit" i={3} onMouseMove={track}>
        <span className="toolkit-label">Toolkit</span>
        <div className="toolkit-items">
          <span><strong>Python</strong> (advanced)</span>
          <span><strong>TensorFlow</strong> (advanced)</span>
          <span>PyTorch</span>
          <span>C++</span>
          <span>TypeScript</span>
          <span>Arduino / ESP32</span>
          <span>Data viz &amp; analysis</span>
        </div>
      </Reveal>
    </section>
  );
}
