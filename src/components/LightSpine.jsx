import { useEffect, useRef, useState } from 'react';

/**
 * The full-page light engine. A white beam drops from the top of the
 * viewport and strikes the wordmark — the wordmark is the prism. Five
 * spectral rays exit it and run down the page as a bundle in the right
 * margin. At each section the matching wavelength peels off, sweeps
 * BEHIND that section's glass cards (backdrop-filter finally has light
 * to refract), rejoins the bundle, and at the footer all five converge
 * back into one white line that points at the contact CTA.
 *
 * Painted at z-index 1, under the content layer (z-index 2), so every
 * .glass panel blurs and tints the rays crossing behind it.
 */

const BANDS = [
  { color: '#ff5c4d', target: '#work .work-list' },
  { color: '#ffb84d', target: '#projects .project-grid' },
  { color: '#5cff8f', target: '#leadership .lead-grid' },
  { color: '#5c8aff', target: '#education .edu-layout' },
  { color: '#b36bff', target: '#education .award-grid' },
];

/* document-space rect (getBoundingClientRect is viewport-space) */
function docRect(el) {
  const r = el.getBoundingClientRect();
  return {
    left: r.left + window.scrollX,
    right: r.right + window.scrollX,
    top: r.top + window.scrollY,
    bottom: r.bottom + window.scrollY,
    width: r.width,
    height: r.height,
  };
}

/* Catmull-Rom through the points, emitted as cubic beziers */
function smooth(pts) {
  if (pts.length < 2) return '';
  let d = `M ${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C ${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  return d;
}

function measure() {
  const word = document.querySelector('.hero-title .refracted');
  const cta = document.querySelector('.footer-cta');
  const rects = BANDS.map((b) => {
    const el = document.querySelector(b.target);
    return el ? docRect(el) : null;
  });
  if (!word || !cta || rects.some((r) => !r)) return null;

  const vw = document.documentElement.clientWidth;
  const docH = document.documentElement.scrollHeight;
  const mobile = vw < 900;
  const W = docRect(word);
  const C = docRect(cta);
  const cx = vw / 2;

  const contentRight = (vw + Math.min(vw - 32, 1080)) / 2;
  /* on mobile the lane hugs the right edge so the fan never crosses copy */
  const laneX = mobile ? vw - 13 : Math.min(vw - 44, contentRight + 84);
  const spread = mobile ? 3.5 : 7;

  /* the prism moment: beam in on the left face, spectrum out on the right */
  const hit = { x: W.left + W.width * 0.05, y: W.top + W.height * 0.48 };
  const exit = { x: W.right - W.width * 0.03, y: W.top + W.height * 0.64 };
  const entry = smooth([
    [hit.x - 90, 0],
    [hit.x, hit.y],
  ]);
  const inner = smooth([
    [hit.x, hit.y],
    [exit.x, exit.y],
  ]);

  const yBundle = W.bottom + (mobile ? 170 : 260);
  const convergeY = C.top - (mobile ? 90 : 120);

  /* Rays are straight runs joined by short beziers — light only bends
     at an interface, and straight segments never loop. */
  const rays = BANDS.map((b, k) => {
    const lx = laneX + (k - 2) * spread;
    const cxk = cx + (k - 2) * 2.5;
    let d = `M ${exit.x.toFixed(1)},${exit.y.toFixed(1)}`;
    d += ` C ${(exit.x + 90).toFixed(1)},${(exit.y + 20 + k * 26).toFixed(1)} ${lx.toFixed(1)},${(yBundle - 240).toFixed(1)} ${lx.toFixed(1)},${yBundle.toFixed(1)}`;
    if (!mobile) {
      const t = rects[k];
      const yA = t.top - 150;
      const yB = t.bottom + 150;
      const P1 = { x: t.right - 26, y: t.top + 30 };
      const P2 = { x: t.left + 44, y: t.bottom - 30 };
      d += ` L ${lx},${yA.toFixed(1)}`;
      d += ` C ${lx},${(yA + 120).toFixed(1)} ${(P1.x + 110).toFixed(1)},${(P1.y - 80).toFixed(1)} ${P1.x.toFixed(1)},${P1.y.toFixed(1)}`;
      d += ` L ${P2.x.toFixed(1)},${P2.y.toFixed(1)}`;
      d += ` C ${(P2.x - 110).toFixed(1)},${(P2.y + 80).toFixed(1)} ${lx},${(yB - 120).toFixed(1)} ${lx},${yB.toFixed(1)}`;
    }
    d += ` L ${lx},${(convergeY - 260).toFixed(1)}`;
    d += ` C ${lx},${(convergeY - 60).toFixed(1)} ${cxk.toFixed(1)},${(convergeY - 160).toFixed(1)} ${cxk.toFixed(1)},${convergeY.toFixed(1)}`;
    return { color: b.color, d };
  });

  /* recombined white light, aimed at the contact CTA */
  const recombine = smooth([
    [cx, convergeY],
    [cx, C.top - 24],
  ]);

  /* glints where each wavelength meets its section */
  const glints = rects.map((t, k) => ({
    color: BANDS[k].color,
    x: mobile ? laneX : t.right - 26,
    y: t.top + 30,
  }));

  return { vw, docH, entry, inner, rays, recombine, glints, end: { x: cx, y: C.top - 24 } };
}

export default function LightSpine() {
  const [geo, setGeo] = useState(null);
  const wrapRef = useRef(null);

  useEffect(() => {
    let raf = 0;
    let debounce = 0;
    const run = () => setGeo(measure());

    const schedule = () => {
      clearTimeout(debounce);
      debounce = setTimeout(run, 160);
    };

    run();
    const settle = setTimeout(run, 600); // after fonts + first reveals
    if (document.fonts?.ready) document.fonts.ready.then(run);
    window.addEventListener('resize', schedule);
    const ro = new ResizeObserver(schedule);
    ro.observe(document.body);

    const light = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        wrapRef.current?.style.setProperty(
          '--lit',
          `${window.scrollY + window.innerHeight * 0.92}px`,
        );
      });
    };
    light();
    window.addEventListener('scroll', light, { passive: true });

    return () => {
      clearTimeout(debounce);
      clearTimeout(settle);
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('resize', schedule);
      window.removeEventListener('scroll', light);
      ro.disconnect();
    };
  }, []);

  if (!geo) return null;

  return (
    <div className="light-spine" ref={wrapRef} aria-hidden>
      <svg
        width={geo.vw}
        height={geo.docH}
        viewBox={`0 0 ${geo.vw} ${geo.docH}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="spineGlow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* incoming white beam + the refracted pass through the wordmark */}
        <path d={geo.entry} stroke="#ffffff" strokeWidth="7" opacity="0.14" strokeLinecap="round" />
        <path d={geo.entry} stroke="#ffffff" strokeWidth="1.8" opacity="0.9" strokeLinecap="round" />
        <path d={geo.inner} stroke="#ffffff" strokeWidth="1.4" opacity="0.5" strokeLinecap="round" />

        {/* dispersed bundle — one ray per wavelength band */}
        {geo.rays.map((r) => (
          <g key={r.color}>
            <path d={r.d} stroke={r.color} strokeWidth="7" opacity="0.13" strokeLinecap="round" />
            <path d={r.d} stroke={r.color} strokeWidth="1.7" opacity="0.78" strokeLinecap="round" />
          </g>
        ))}

        {/* glints where each wavelength meets its section */}
        {geo.glints.map((g) => (
          <g key={g.color}>
            <circle cx={g.x} cy={g.y} r="14" fill="url(#spineGlow)" opacity="0.5" />
            <circle cx={g.x} cy={g.y} r="2.4" fill={g.color} />
          </g>
        ))}

        {/* recombination: the spectrum becomes white light again */}
        <path d={geo.recombine} stroke="#ffffff" strokeWidth="8" opacity="0.16" strokeLinecap="round" />
        <path d={geo.recombine} stroke="#ffffff" strokeWidth="2" opacity="0.95" strokeLinecap="round" />
        <circle cx={geo.end.x} cy={geo.end.y} r="22" fill="url(#spineGlow)" opacity="0.8" />
        <circle cx={geo.end.x} cy={geo.end.y} r="3.2" fill="#ffffff" />
      </svg>
    </div>
  );
}
