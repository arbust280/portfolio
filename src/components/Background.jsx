/**
 * The room the light travels through.
 *
 * Deliberately almost empty. The previous version layered four coloured
 * aurora blobs behind a blur(34px) — expensive, and worse, it competed
 * with the spectrum for attention, so the rays never got to be the
 * brightest thing on screen. A beam only reads as a beam in a dark room.
 *
 * What's left: a cold ambient wash, an optical-bench grid, and dust —
 * you can only see a light beam because there is something in the air
 * for it to scatter off. All motion is compositor-only transforms.
 */

const MOTES = [
  { l: '12%', d: 0, dur: 34, s: 3, o: 0.5 },
  { l: '28%', d: 9, dur: 41, s: 2, o: 0.35 },
  { l: '46%', d: 17, dur: 29, s: 4, o: 0.45 },
  { l: '67%', d: 5, dur: 46, s: 2, o: 0.3 },
  { l: '81%', d: 22, dur: 33, s: 3, o: 0.5 },
  { l: '93%', d: 13, dur: 38, s: 2, o: 0.35 },
];

export default function Background() {
  return (
    <div className="scene" aria-hidden>
      <div className="scene-ambient" />
      <div className="scene-grid" />

      <div className="scene-motes">
        {MOTES.map((m, i) => (
          <span
            key={i}
            className="mote"
            style={{
              left: m.l,
              width: `${m.s}px`,
              height: `${m.s}px`,
              opacity: m.o,
              animationDuration: `${m.dur}s`,
              animationDelay: `-${m.d}s`,
            }}
          />
        ))}
      </div>

      <div className="scene-vignette" />
    </div>
  );
}
