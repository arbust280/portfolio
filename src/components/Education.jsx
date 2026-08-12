import Band from './Band';
import Reveal from './Reveal';
import ResonanceCurve from './ResonanceCurve';

const SUBJECTS = [
  { name: 'Mathematics AA', level: 'HL' },
  { name: 'Physics', level: 'HL' },
  { name: 'Chemistry', level: 'HL' },
  { name: 'Business Management', level: 'HL' },
  { name: 'English A L&L', level: 'SL' },
  { name: 'Spanish ab initio', level: 'SL' },
];

const AWARDS = [
  { year: '2025', name: 'ASMA Senior Division', result: 'Best in School' },
  { year: '2025', name: 'iGEM Competition', result: 'Silver Medal' },
  { year: '2024', name: 'UKMT Senior Challenge', result: 'Silver Medal' },
  { year: '2021', name: 'CoderDojo Coolest Projects', result: 'Bronze Award' },
];

/**
 * Two wavelengths live in this section — 470 for education, 410 for
 * awards — so the light engine peels a ray off twice here. Awards are an
 * index, not four boxes: year, name, result, aligned in columns.
 */
export default function Education() {
  return (
    <Band id="education" band="470" lambda="λ 470nm" name="Education">
      <div className="edu-layout">
        <Reveal as="article" className="edu-block">
          <div className="work-head">
            <h3 className="work-org">Verita International School</h3>
            <span className="work-dates">Grad. May &rsquo;27</span>
          </div>
          <p className="work-role">IB Diploma Programme · Bucharest</p>
          <ul className="edu-subjects">
            {SUBJECTS.map((s) => (
              <li key={s.name}>
                {s.name}
                <span className="edu-level" data-level={s.level}>{s.level}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal as="article" i={1} className="edu-block">
          <div className="work-head">
            <h3 className="work-org">Extended Essay</h3>
            <span className="work-dates">Physics</span>
          </div>
          <p className="work-role">Electrical circuits &amp; resonance</p>
          <p className="edu-ee-question">
            How does resistance in an RLC circuit shape the resonance curve — peak amplitude,
            bandwidth, quality factor — and what does that imply for frequency selectivity in
            MRI systems?
          </p>
          <ResonanceCurve className="edu-resonance" />
        </Reveal>
      </div>

      <Reveal className="band-label band-label--sub" i={2} style={{ '--band': 'var(--l410)' }}>
        <span className="band-lambda">λ 410nm</span>
        <h2 className="band-name">Awards</h2>
        <span className="band-rule" />
      </Reveal>

      <ul className="award-grid" style={{ '--band': 'var(--l410)' }} id="awards">
        {AWARDS.map((a, i) => (
          <Reveal key={a.name} as="li" i={i} className="award-row">
            <span className="award-year">{a.year}</span>
            <span className="award-name">{a.name}</span>
            <span className="award-result">{a.result}</span>
          </Reveal>
        ))}
      </ul>
    </Band>
  );
}
