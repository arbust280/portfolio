export default function Hero() {
  return (
    <header className="hero" id="top">
      <div className="hero-inner">
        <span className="hero-kicker rise" style={{ '--d': '0.1s' }}>
          <span className="hero-kicker-dot" aria-hidden />
          aethrex · Bucharest · interdisciplinary engineer
        </span>

        {/* the wordmark IS the prism — LightSpine strikes it with the beam */}
        <h1 className="hero-title rise" style={{ '--d': '0.2s' }}>
          <span className="refracted">aethrex</span>
        </h1>

        <p className="hero-lede rise" style={{ '--d': '0.34s' }}>
          I work where the abstract meets the physical — <strong>physics for intuition,
          software for delivery</strong>. Payment systems, protein-folding pipelines,
          environmental sensing, and the messy layer where a model finally has to run on
          real hardware.
        </p>

        <div className="hero-actions rise" style={{ '--d': '0.46s' }}>
          <a className="btn btn--beam" href="#work">See the work →</a>
          <a className="btn" href="#ethos">Why engineering</a>
        </div>
      </div>
    </header>
  );
}
