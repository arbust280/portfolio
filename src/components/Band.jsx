import Reveal from './Reveal';

/**
 * A wavelength band — one section of the spectrum, one section of the
 * page. `lambda` is the annotation the light engine keys off, so the
 * label and the ray that peels off here always name the same number.
 */
export default function Band({ id, lambda, name, intro, band, children, className = '' }) {
  return (
    <section
      className={`band ${className}`.trim()}
      id={id}
      style={{ '--band': `var(--l${band})` }}
    >
      <Reveal className="band-label">
        <span className="band-lambda">{lambda}</span>
        <h2 className="band-name">{name}</h2>
        <span className="band-rule" />
      </Reveal>

      {intro && <Reveal className="band-intro" i={1}>{intro}</Reveal>}

      {children}
    </section>
  );
}
