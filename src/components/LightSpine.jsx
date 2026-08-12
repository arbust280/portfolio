import { useEffect, useRef, useState } from 'react';

/**
 * The full-page light engine. A white beam drops from the top of the
 * viewport and strikes the prism; five spectral rays exit it and run
 * down the page in the right margin. At each section the matching
 * wavelength peels off, sweeps BEHIND that section's glass, rejoins the
 * bundle, and at the footer all five recombine into one white line
 * aimed at the contact CTA.
 *
 * Painted at z-index 1, under the content layer (z-index 2), so every
 * .glass panel blurs and tints the rays crossing behind it.
 *
 * Cost discipline — the previous version re-measured seven elements and
 * re-rendered a document-height SVG on every pointermove, which is a
 * forced layout plus a full repaint at pointer rate. Here:
 *   · geometry is measured only when the document actually changes
 *     (resize / fonts / ResizeObserver), never on pointer or scroll;
 *   · pointer tilt is a compositor-only transform on the ray group;
 *   · each ray ignites via IntersectionObserver writing one custom
 *     property, so React never re-renders the SVG after mount.
 */

/**
 * `sweep: 'glass'` sends the ray behind the section's panels, where their
 * backdrop-filter blurs and tints it — the whole point of the effect.
 * Cardless sections get `'edge'` instead: a shallow bow in the margin.
 * Sweeping a ray across bare body copy reads as a scratch, not as light.
 */
const BANDS = [
  { color: 'var(--l700)', target: '#work .work-list', sweep: 'edge' },
  { color: 'var(--l590)', target: '#projects .project-grid', sweep: 'glass' },
  { color: 'var(--l530)', target: '#leadership .lead-grid', sweep: 'edge' },
  { color: 'var(--l470)', target: '#education .edu-layout', sweep: 'edge' },
  { color: 'var(--l410)', target: '#education .award-grid', sweep: 'edge' },
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
    d += ` C ${(p1[0] + (p2[0] - p0[0]) / 6).toFixed(1)},${(p1[1] + (p2[1] - p0[1]) / 6).toFixed(1)}`;
    d += ` ${(p2[0] - (p3[0] - p1[0]) / 6).toFixed(1)},${(p2[1] - (p3[1] - p1[1]) / 6).toFixed(1)}`;
    d += ` ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  return d;
}

function measure() {
  const word = document.querySelector('.hero-prism') || document.querySelector('.hero-title');
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

  const contentRight = (vw + Math.min(vw - 32, 1120)) / 2;
  /* on mobile the lane hugs the right edge so the fan never crosses copy */
  const laneX = mobile ? vw - 13 : Math.min(vw - 46, contentRight + 88);
  const spread = mobile ? 3.5 : 7;

  /* The prism moment: beam in on the left face, spectrum out on the right.
     These fractions target the visible triangle, which occupies roughly
     the middle half of its square canvas — aiming at the box edge instead
     makes the beam appear to strike empty space. */
  const hit = { x: W.left + W.width * 0.3, y: W.top + W.height * 0.54 };
  const exit = { x: W.right - W.width * 0.28, y: W.top + W.height * 0.62 };
  const entry = smooth([[hit.x - 90, 0], [hit.x, hit.y]]);
  const inner = smooth([[hit.x, hit.y], [exit.x, exit.y]]);

  const yBundle = W.bottom + (mobile ? 170 : 260);
  const convergeY = C.top - (mobile ? 90 : 120);

  /* Rays are straight runs joined by short beziers — light only bends at
     an interface, and straight segments never loop back on themselves. */
  const rays = BANDS.map((b, k) => {
    const lx = laneX + (k - 2) * spread;
    const cxk = cx + (k - 2) * 2.5;
    const fan = 26;
    /* where this wavelength meets its section — the glint sits on the path */
    let glint = { x: lx, y: rects[k].top + 30 };
    let d = `M ${exit.x.toFixed(1)},${exit.y.toFixed(1)}`;
    d += ` C ${(exit.x + 90).toFixed(1)},${(exit.y + 20 + k * fan).toFixed(1)} ${lx.toFixed(1)},${(yBundle - 240).toFixed(1)} ${lx.toFixed(1)},${yBundle.toFixed(1)}`;
    if (!mobile) {
      const t = rects[k];
      const yA = t.top - 150;
      const yB = t.bottom + 150;
      d += ` L ${lx},${yA.toFixed(1)}`;

      if (b.sweep === 'glass') {
        /* dive behind the panels — they blur and tint the ray */
        const P1 = { x: t.right - 26, y: t.top + 30 };
        glint = P1;
        const P2 = { x: t.left + 44, y: t.bottom - 30 };
        d += ` C ${lx},${(yA + 120).toFixed(1)} ${(P1.x + 110).toFixed(1)},${(P1.y - 80).toFixed(1)} ${P1.x.toFixed(1)},${P1.y.toFixed(1)}`;
        d += ` L ${P2.x.toFixed(1)},${P2.y.toFixed(1)}`;
        d += ` C ${(P2.x - 110).toFixed(1)},${(P2.y + 80).toFixed(1)} ${lx},${(yB - 120).toFixed(1)} ${lx},${yB.toFixed(1)}`;
      } else {
        /* bow toward the content edge without ever crossing it */
        const bx = Math.max(t.right + 18, lx - 54);
        const my = (t.top + t.bottom) / 2;
        d += ` C ${lx},${(yA + 150).toFixed(1)} ${bx.toFixed(1)},${(my - 160).toFixed(1)} ${bx.toFixed(1)},${my.toFixed(1)}`;
        d += ` C ${bx.toFixed(1)},${(my + 160).toFixed(1)} ${lx},${(yB - 150).toFixed(1)} ${lx},${yB.toFixed(1)}`;
        glint = { x: bx, y: my };
      }
    }
    d += ` L ${lx},${(convergeY - 260).toFixed(1)}`;
    d += ` C ${lx},${(convergeY - 60).toFixed(1)} ${cxk.toFixed(1)},${(convergeY - 160).toFixed(1)} ${cxk.toFixed(1)},${convergeY.toFixed(1)}`;
    if (mobile) glint = { x: lx, y: rects[k].top + 30 };
    return { color: b.color, d, glint };
  });

  const recombine = smooth([[cx, convergeY], [cx, C.top - 46]]);
  const glints = rays.map((r) => r.glint);

  return { vw, docH, entry, inner, rays, recombine, glints, end: { x: cx, y: C.top - 46 } };
}

export default function LightSpine() {
  const [geo, setGeo] = useState(null);
  const wrapRef = useRef(null);
  const rayRefs = useRef([]);
  const tailRef = useRef(null);

  /* geometry — recomputed only when the document itself changes */
  useEffect(() => {
    let debounce = 0;
    const run = () => setGeo(measure());

    const schedule = () => {
      clearTimeout(debounce);
      debounce = setTimeout(run, 160);
    };

    run();
    const settle = setTimeout(run, 600);           // after fonts + first reveals
    document.fonts?.ready.then(run).catch(() => {});
    window.addEventListener('resize', schedule);
    const ro = new ResizeObserver(schedule);
    ro.observe(document.body);

    return () => {
      clearTimeout(debounce);
      clearTimeout(settle);
      window.removeEventListener('resize', schedule);
      ro.disconnect();
    };
  }, []);

  /* pointer tilt — a compositor transform, never a re-measure */
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    if (matchMedia('(hover: none)').matches) return undefined;

    let raf = 0;
    let next = { x: 0, y: 0 };
    const onTilt = (e) => {
      next = e.detail;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const el = wrapRef.current;
        if (!el) return;
        el.style.setProperty('--tilt-x', next.x.toFixed(3));
        el.style.setProperty('--tilt-y', next.y.toFixed(3));
      });
    };
    window.addEventListener('prism-tilt', onTilt);
    return () => {
      window.removeEventListener('prism-tilt', onTilt);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  /* ignition — each ray brightens as its own section arrives */
  useEffect(() => {
    if (!geo) return undefined;

    const light = (el, on) => el?.style.setProperty('--lit', on ? '1' : '0');
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const k = Number(e.target.dataset.band);
          light(rayRefs.current[k], e.isIntersecting);
        }
      },
      { rootMargin: '-8% 0px -8% 0px' },
    );

    BANDS.forEach((b, k) => {
      const el = document.querySelector(b.target);
      if (!el) return;
      el.dataset.band = String(k);
      io.observe(el);
    });

    const tailIo = new IntersectionObserver(
      ([e]) => light(tailRef.current, e.isIntersecting),
      { rootMargin: '0px 0px -10% 0px' },
    );
    const cta = document.querySelector('.footer-cta');
    if (cta) tailIo.observe(cta);

    return () => {
      io.disconnect();
      tailIo.disconnect();
    };
  }, [geo]);

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
            <stop offset="0%" stopColor="#fff" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* incoming white beam, and its path through the glass */}
        <g className="spine-entry">
          <path className="ray-bloom" d={geo.entry} />
          <path className="ray-halo" d={geo.entry} />
          <path className="ray-core" d={geo.entry} />
          <path className="ray-inner" d={geo.inner} />
        </g>

        {/* dispersed bundle — one ray per wavelength band */}
        <g className="spine-rays">
          {geo.rays.map((r, k) => (
            <g
              key={r.color}
              className="spine-ray"
              style={{ '--band': r.color }}
              ref={(el) => { rayRefs.current[k] = el; }}
            >
              <path className="ray-bloom" d={r.d} />
              <path className="ray-halo" d={r.d} />
              <path className="ray-core" d={r.d} />
              <circle className="ray-glint-halo" cx={geo.glints[k].x} cy={geo.glints[k].y} r="15" />
              <circle className="ray-glint" cx={geo.glints[k].x} cy={geo.glints[k].y} r="2.4" />
            </g>
          ))}
        </g>

        {/* recombination: the spectrum becomes white light again */}
        <g className="spine-tail" ref={tailRef}>
          <path className="ray-bloom" d={geo.recombine} />
          <path className="ray-halo" d={geo.recombine} />
          <path className="ray-core" d={geo.recombine} />
          <circle className="ray-glint-halo" cx={geo.end.x} cy={geo.end.y} r="24" />
          <circle className="ray-glint" cx={geo.end.x} cy={geo.end.y} r="3.2" />
        </g>
      </svg>
    </div>
  );
}
