import Reveal from './Reveal';
import ResonanceCurve from './ResonanceCurve';
import { useGlass } from '../lib/useGlass';

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

export default function Education() {
  const track = useGlass();
  return (
    <section className="band" id="education" style={{ '--band': '#5c8aff' }}>
      <Reveal className="band-label">
        <span className="band-lambda">λ 470nm</span>
        <h2 className="band-name">Education</h2>
        <span className="band-rule" />
      </Reveal>

      <div className="edu-layout">
        <Reveal as="article" className="glass edu-card" onMouseMove={track}>
          <div className="work-head">
            <h3 className="work-org">Verita International School</h3>
            <span className="work-dates">Grad. May '27</span>
          </div>
          <p className="work-role">IB Diploma Programme · Bucharest</p>
          <ul className="edu-subjects">
            {SUBJECTS.map((s) => (
              <li key={s.name} data-level={s.level}>{s.name}</li>
            ))}
          </ul>
        </Reveal>

        <Reveal as="article" i={1} className="glass edu-card" onMouseMove={track}>
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

      <Reveal className="band-label" i={2} style={{ marginTop: 'clamp(40px, 6vh, 64px)' }}>
        <span className="band-lambda" style={{ '--band': '#b36bff' }}>λ 410nm</span>
        <h2 className="band-name">Awards</h2>
        <span className="band-rule" style={{ '--band': '#b36bff' }} />
      </Reveal>

      <div className="award-grid" style={{ '--band': '#b36bff' }} id="awards">
        {AWARDS.map((a, i) => (
          <Reveal key={a.name} as="article" i={i} className="glass award-card" onMouseMove={track}>
            <span className="award-year">{a.year}</span>
            <div className="award-name">{a.name}</div>
            <div className="award-result">{a.result}</div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
