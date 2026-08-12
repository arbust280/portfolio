import { useEffect, useRef, useState } from 'react';
import { buildProgram } from '../lib/prism-gl';

/**
 * Canvas shell around the dispersion shader.
 *
 * Responsibilities beyond drawing: never run the loop while the hero is
 * offscreen, render exactly one static frame when the reader prefers
 * reduced motion, broadcast pointer tilt so LightSpine can re-aim its
 * rays, and hand back to the CSS prism if WebGL is missing or the
 * context is lost. `failed` drives that last case — the parent shows a
 * pure-CSS prism underneath, so there is always a floor.
 */
export default function Prism({ onFail }) {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return undefined;

    const attrs = {
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,     // supersampled via backing-store scale instead
      depth: false,
      stencil: false,
      failIfMajorPerformanceCaveat: true,
    };
    const gl =
      canvas.getContext('webgl', attrs) || canvas.getContext('experimental-webgl', attrs);

    if (!gl) {
      setFailed(true);
      onFail?.();
      return undefined;
    }

    const prog = buildProgram(gl);
    if (!prog) {
      setFailed(true);
      onFail?.();
      return undefined;
    }

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);

    const loc = gl.getAttribLocation(prog, 'a');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    gl.useProgram(prog);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);   // premultiplied

    const uRes = gl.getUniformLocation(prog, 'uRes');
    const uTime = gl.getUniformLocation(prog, 'uTime');
    const uTilt = gl.getUniformLocation(prog, 'uTilt');

    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const tilt = { x: 0, y: 0 };
    let raf = 0;
    let visible = true;
    let start = performance.now();

    const resize = () => {
      /* 1.35x supersample, capped — cheaper than MSAA and softens the
         silhouette, which matters because the shader has no analytic AA */
      const scale = Math.min(window.devicePixelRatio || 1, 2) * 1.35;
      const w = Math.max(1, Math.round(wrap.clientWidth * scale));
      const h = Math.max(1, Math.round(wrap.clientHeight * scale));
      if (canvas.width === w && canvas.height === h) return;
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    };

    const draw = (t) => {
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, t);
      gl.uniform2f(uTilt, tilt.x, tilt.y);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const frame = (now) => {
      raf = 0;
      if (!visible) return;
      draw((now - start) / 1000);
      raf = requestAnimationFrame(frame);
    };

    resize();

    if (reduced) {
      draw(0);   // one honest still frame, no loop
    } else {
      raf = requestAnimationFrame(frame);
    }

    /* pause entirely once the hero has scrolled away */
    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        if (visible && !reduced && !raf) {
          start = performance.now() - 1000;   // resume without a time jump
          raf = requestAnimationFrame(frame);
        }
      },
      { rootMargin: '96px' },
    );
    io.observe(wrap);

    const ro = new ResizeObserver(() => {
      resize();
      if (reduced) draw(0);
    });
    ro.observe(wrap);

    let tiltRaf = 0;
    const onMove = (e) => {
      tilt.x = (e.clientX / window.innerWidth - 0.5) * 2;
      tilt.y = (e.clientY / window.innerHeight - 0.5) * 2;
      if (tiltRaf) return;
      tiltRaf = requestAnimationFrame(() => {
        tiltRaf = 0;
        window.dispatchEvent(new CustomEvent('prism-tilt', { detail: { ...tilt } }));
      });
    };
    if (!reduced && !matchMedia('(hover: none)').matches) {
      window.addEventListener('pointermove', onMove, { passive: true });
    }

    const onLost = (e) => {
      e.preventDefault();
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      setFailed(true);
      onFail?.();
    };
    canvas.addEventListener('webglcontextlost', onLost);

    return () => {
      io.disconnect();
      ro.disconnect();
      window.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('webglcontextlost', onLost);
      if (raf) cancelAnimationFrame(raf);
      if (tiltRaf) cancelAnimationFrame(tiltRaf);
      gl.deleteProgram(prog);
      gl.deleteBuffer(buf);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, [onFail]);

  return (
    <div className="prism-gl" ref={wrapRef} aria-hidden data-failed={failed || undefined}>
      <canvas ref={canvasRef} />
    </div>
  );
}
