import Band from './Band';
import Reveal from './Reveal';

const WORK = [
  {
    org: 'Transfer Pricing Services Romania',
    role: 'Specialised IT Intern · Bucharest',
    dates: "Jun–Jul '26",
    points: [
      <>Shipped a <strong>Stripe payment interface and redesign demo</strong> for tpsoft.ro, wired to Google Apps Script — contracts and invoices auto-generate in Docs, database and index in Sheets.</>,
      <>Rebuilt the main company website end to end with <strong>Supabase, Sanity Studio and Resend</strong> integration.</>,
      <>Created an <strong>open-source JSON crawler of the Romanian Stock Market (BVB)</strong> — a free public path to local trading and company data that existing APIs charge for.</>,
      <>Reframed dense transfer-pricing legislation (OPANAF 828) as a <strong>football-themed interactive newsletter</strong> timed to the World Cup finals — a compliance update turned shareable lead-gen tool, featured on the company&rsquo;s LinkedIn.</>,
      <>Built and deployed a team project site in <strong>Astro</strong> on Vercel.</>,
    ],
  },
  {
    org: 'VIS Romania #5912 · iGEM',
    role: 'Head of Dry Lab & Software · Bucharest',
    dates: "Mar–Oct '25",
    points: [
      <>Ran <strong>10+ simulation models</strong> (COPASI, HADDOCK, MATLAB, Colab) to stress-test the project&rsquo;s molecular design and lab feasibility.</>,
      <>Built <strong>LinkerFlow</strong>, a tool pairing AI automation with protein visualisation to pick multi-domain linkers and dispatch candidates to ColabFold.</>,
      <>Co-hosted a SynBio automation workshop with researcher Anton Kulaga on driving lab work through <strong>Model Context Protocol</strong> tools.</>,
    ],
  },
];

/**
 * Cardless on purpose. Two roles do not need two boxes — they need room
 * and a rule between them. Glass is reserved for the sections where a
 * panel is the interaction.
 */
export default function Work() {
  return (
    <Band
      id="work"
      band="700"
      lambda="λ 700nm"
      name="Work"
      intro="Where the ideas actually shipped — with a deadline, a client, and a URL at the end."
    >
      <div className="work-list">
        {WORK.map((w, i) => (
          <Reveal key={w.org} as="article" i={i} className="work-entry">
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
    </Band>
  );
}
