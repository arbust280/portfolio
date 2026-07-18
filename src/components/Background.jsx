/**
 * Ambient scene behind everything: drifting prismatic aurora, a
 * perspective light-grid floor, and slow-rising glass shards. Kept
 * deliberately dark and neutral — the LightSpine carries the color.
 *
 * All motion is CSS so it runs regardless of JS animation timing, and
 * the whole layer is disabled under prefers-reduced-motion (index.css).
 */
const SHARDS = [
  { l: '8%', d: 0, dur: 26, s: 34, r: -18, o: 0.5 },
  { l: '39%', d: 12, dur: 29, s: 46, r: 8, o: 0.35 },
  { l: '71%', d: 15, dur: 24, s: 30, r: 16, o: 0.5 },
  { l: '94%', d: 7, dur: 30, s: 20, r: 32, o: 0.4 },
];

export default function Background() {
  return (
    <div className="scene" aria-hidden>
      {/* prismatic aurora blobs */}
      <div className="scene-aurora" />

      {/* perspective light-grid floor */}
      <div className="scene-grid" />

      {/* rising glass shards */}
      <div className="scene-shards">
        {SHARDS.map((s, i) => (
          <span
            key={i}
            className="shard"
            style={{
              left: s.l,
              width: `${s.s}px`,
              height: `${s.s * 1.4}px`,
              animationDuration: `${s.dur}s`,
              animationDelay: `${s.d}s`,
              opacity: s.o,
              '--rot': `${s.r}deg`,
            }}
          />
        ))}
      </div>

      {/* vignette to seat the content */}
      <div className="scene-vignette" />
    </div>
  );
}
