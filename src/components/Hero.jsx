import { lazy, Suspense, useRef, useState } from 'react';

const Prism3D = lazy(() => import('./Prism3D'));

export default function Hero() {
  const [prismOn] = useState(
    () => !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  const clicks = useRef({ n: 0, t: 0 });

  /* the dark-side egg: three quick clicks on the wordmark flip the theme */
  const flip = () => {
    const now = performance.now();
    if (now - clicks.current.t > 700) clicks.current.n = 0;
    clicks.current.t = now;
    if (++clicks.current.n >= 3) {
      clicks.current.n = 0;
      const light = document.body.classList.toggle('lightside');
      try {
        localStorage.setItem('aethrex-side', light ? 'light' : 'dark');
      } catch { /* private mode */ }
    }
  };

  return (
    <header className="hero" id="top">
      <div className="hero-inner">
        <span className="hero-kicker rise" style={{ '--d': '0.1s' }}>
          <span className="hero-kicker-dot" aria-hidden />
          dinu · Bucharest · interdisciplinary engineer
        </span>

        {/* the optical element: a real glass prism over the wordmark.
            LightSpine's beam strikes .hero-prism; rays exit it. */}
        <div className="hero-prism">
          {prismOn && (
            <Suspense fallback={null}>
              <Prism3D />
            </Suspense>
          )}
          <h1 className="hero-title rise" style={{ '--d': '0.2s' }} onClick={flip}>
            <span className="refracted">aethrex</span>
          </h1>
        </div>

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
