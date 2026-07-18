import Reveal from './Reveal';
import { useGlass } from '../lib/useGlass';

const WORK = [
  {
    org: 'Transfer Pricing Services Romania',
    role: 'Specialised IT Intern · Bucharest',
    dates: "Jun–Jul '26",
    points: [
      <>Shipped a <strong>Stripe payment interface and redesign</strong> for tpsoft.ro, wired to Google Apps Script so contracts and invoices auto-generate in Docs and index into Sheets.</>,
      <>Rebuilt the main company website end to end with a <strong>Supabase</strong> backend.</>,
      <>Built and deployed a team project site in <strong>Astro</strong> on Vercel.</>,
    ],
  },
  {
    org: 'VIS Romania #5912 · iGEM',
    role: 'Head of Dry Lab & Software · Bucharest',
    dates: "Mar–Oct '25",
    points: [
      <>Ran <strong>10+ simulation models</strong> (COPASI, HADDOCK, MATLAB, Colab) to stress-test the project's molecular design and lab feasibility.</>,
      <>Built <strong>LinkerFlow</strong>, a tool pairing AI automation with protein visualisation to pick multi-domain linkers and dispatch candidates to ColabFold.</>,
      <>Co-hosted a SynBio automation workshop with researcher Anton Kulaga on driving lab work through <strong>Model Context Protocol</strong> tools.</>,
    ],
  },
];

export default function Work() {
  const track = useGlass();
  return (
    <section className="band" id="work" style={{ '--band': '#ff5c4d' }}>
      <Reveal className="band-label">
        <span className="band-lambda">λ 700nm</span>
        <h2 className="band-name">Work</h2>
        <span className="band-rule" />
      </Reveal>
      <Reveal className="band-intro" i={1}>
        Where the ideas actually shipped — with a deadline, a client, and a URL at the end.
      </Reveal>

      <div className="work-list">
        {WORK.map((w, i) => (
          <Reveal key={w.org} as="article" i={i} className="glass work-card" onMouseMove={track}>
            <div className="work-head">
              <h3 className="work-org">{w.org}</h3>
              <span className="work-dates">{w.dates}</span>
            </div>
            <p className="work-role">{w.role}</p>
            <ul className="work-points">
              {w.points.map((p, j) => (
                <li key={j}>{p}</li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
