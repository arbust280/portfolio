import Reveal from './Reveal';
import { useGlass } from '../lib/useGlass';

const ROLES = [
  {
    stat: '10+',
    caption: 'students coordinated',
    org: 'Verita International School',
    role: 'President, Student Council · Aug 2025 – present',
    points: [
      'Directed 5+ school-wide events — bake sales, sports tournaments, cultural nights — that pulled the community together.',
      'Introduced quality-of-life reforms: a new Student Council page on the school site and a Code of Conduct for all activities.',
    ],
  },
  {
    stat: '280%',
    caption: 'recycling increase, month one',
    org: 'Verita ECO Team',
    role: 'Co-leader · Aug 2025 – present',
    points: [
      'Launched the Green Bin Project and built the Eco Dashboard that made the data public.',
      'Backed wider initiatives, including the new Băneasa forest bike lane.',
    ],
  },
];

export default function Leadership() {
  const track = useGlass();
  return (
    <section className="band" id="leadership" style={{ '--band': '#5cff8f' }}>
      <Reveal className="band-label">
        <span className="band-lambda">λ 530nm</span>
        <h2 className="band-name">Leadership</h2>
        <span className="band-rule" />
      </Reveal>
      <Reveal className="band-intro" i={1}>
        The hardest problems are rarely technical. Two roles where the job was aligning people, not code.
      </Reveal>

      <div className="lead-grid">
        {ROLES.map((r, i) => (
          <Reveal key={r.org} as="article" i={i} className="glass lead-card" onMouseMove={track}>
            <div className="lead-stat">{r.stat}</div>
            <div className="lead-stat-caption">{r.caption}</div>
            <h3 className="work-org">{r.org}</h3>
            <p className="work-role">{r.role}</p>
            <ul className="work-points">
              {r.points.map((p, j) => (
                <li key={j}>{p}</li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
