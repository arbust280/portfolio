import Band from './Band';
import Reveal from './Reveal';

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

/**
 * The numbers are the point here, so they lead at display scale and the
 * prose hangs off them. No panels — a figure does not need a box.
 */
export default function Leadership() {
  return (
    <Band
      id="leadership"
      band="530"
      lambda="λ 530nm"
      name="Leadership"
      intro="The hardest problems are rarely technical. Two roles where the job was aligning people, not code."
    >
      <div className="lead-grid">
        {ROLES.map((r, i) => (
          <Reveal key={r.org} as="article" i={i} className="lead-entry">
            <p className="lead-stat">
              <span className="lead-stat-value">{r.stat}</span>
              <span className="lead-stat-caption">{r.caption}</span>
            </p>
            <div className="lead-body">
              <h3 className="work-org">{r.org}</h3>
              <p className="work-role">{r.role}</p>
              <ul className="work-points">
                {r.points.map((p, j) => (
                  <li key={j}>{p}</li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </Band>
  );
}
