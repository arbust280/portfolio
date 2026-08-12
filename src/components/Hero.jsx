import { lazy, Suspense, useCallback, useState } from 'react';

const Prism = lazy(() => import('./Prism'));

/**
 * The poster. A beam arrives from the top of the viewport, strikes the
 * prism, and leaves as five wavelengths that run the rest of the page.
 *
 * The prism is loaded lazily; if WebGL is unavailable or the context is
 * lost, `glFailed` swaps in the CSS prism so the composition never has
 * a hole in it.
 */
export default function Hero() {
  const [glFailed, setGlFailed] = useState(false);
  const onFail = useCallback(() => setGlFailed(true), []);

  return (
    <header className="hero" id="top">
      <div className="hero-inner">
        <p className="hero-kicker">
          <span className="hero-kicker-dot" aria-hidden />
          dinu · Bucharest · interdisciplinary engineer
        </p>

        <div className="hero-prism">
          {glFailed ? (
            <span className="prism-css" aria-hidden />
          ) : (
            <Suspense fallback={<span className="prism-css" aria-hidden />}>
              <Prism onFail={onFail} />
            </Suspense>
          )}
        </div>

        <h1 className="hero-title">aethrex</h1>

        <p className="hero-lede">
          I work where the abstract meets the physical — <strong>physics for intuition,
          software for delivery</strong>. Payment systems, protein-folding pipelines,
          environmental sensing, and the messy layer where a model finally has to run on
          real hardware.
        </p>

        <div className="hero-actions">
          <a className="btn btn--beam" href="#work">See the work</a>
          <a className="btn" href="#ethos">Why engineering</a>
        </div>
      </div>

      <span className="hero-scroll" aria-hidden>
        <span className="hero-scroll-rule" />
        scroll
      </span>
    </header>
  );
}
