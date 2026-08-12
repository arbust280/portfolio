/**
 * The hero's optical element, as a single fragment shader.
 *
 * This replaces three.js + drei's MeshTransmissionMaterial (257 KB gzip)
 * with ~4 KB of raw WebGL. It is also *more* on-concept: rather than a
 * generic chromatic-aberration fudge, it traces a ray through a real
 * triangular prism with a wavelength-dependent index of refraction, and
 * tints each sample with the exact five band colours the page uses. The
 * spectrum leaving the prism is literally the spectrum running down the
 * page.
 *
 * Geometry is an analytic convex-polyhedron intersection (three side
 * planes + two caps), not a raymarch — exact, ~20 ops, and cheap enough
 * to run once per wavelength sample.
 */

export const VERT = `
attribute vec2 a;
void main() { gl_Position = vec4(a, 0.0, 1.0); }
`;

export const FRAG = `
precision highp float;

uniform vec2  uRes;
uniform float uTime;
uniform vec2  uTilt;

#define SAMPLES 14

/* triangle inradius and half-depth */
const float R = 0.60;
const float H = 0.40;

/* the page's five bands, violet -> red (410, 470, 530, 590, 700 nm) */
const vec3 B0 = vec3(0.702, 0.420, 1.000);
const vec3 B1 = vec3(0.361, 0.541, 1.000);
const vec3 B2 = vec3(0.361, 1.000, 0.561);
const vec3 B3 = vec3(1.000, 0.722, 0.302);
const vec3 B4 = vec3(1.000, 0.361, 0.302);

vec3 bandColor(float t) {
  t = clamp(t, 0.0, 1.0) * 4.0;
  if (t < 1.0) return mix(B0, B1, smoothstep(0.0, 1.0, t));
  if (t < 2.0) return mix(B1, B2, smoothstep(0.0, 1.0, t - 1.0));
  if (t < 3.0) return mix(B2, B3, smoothstep(0.0, 1.0, t - 2.0));
  return mix(B3, B4, smoothstep(0.0, 1.0, t - 3.0));
}

mat3 rotX(float a) { float c = cos(a), s = sin(a); return mat3(1.0, 0.0, 0.0, 0.0, c, s, 0.0, -s, c); }
mat3 rotY(float a) { float c = cos(a), s = sin(a); return mat3(c, 0.0, -s, 0.0, 1.0, 0.0, s, 0.0, c); }
mat3 rotZ(float a) { float c = cos(a), s = sin(a); return mat3(c, s, 0.0, -s, c, 0.0, 0.0, 0.0, 1.0); }

/* one half-space of the convex body, folded into the running near/far span */
void slab(vec3 n, float d, vec3 ro, vec3 rd,
          inout float tN, inout float tF, inout vec3 nN, inout vec3 nF, inout bool ok) {
  float dn = dot(rd, n);
  float ds = dot(ro, n) + d;
  if (abs(dn) < 1e-6) {
    if (ds > 0.0) ok = false;   // parallel and outside
    return;
  }
  float t = -ds / dn;
  if (dn < 0.0) { if (t > tN) { tN = t; nN = n; } }
  else          { if (t < tF) { tF = t; nF = n; } }
}

/* equilateral triangular prism, point-up in XY, extruded along Z */
bool hitPrism(vec3 ro, vec3 rd, out float tN, out float tF, out vec3 nN, out vec3 nF) {
  tN = -1e9; tF = 1e9;
  nN = vec3(0.0); nF = vec3(0.0);
  bool ok = true;

  slab(vec3( 0.00000, -1.0, 0.0), -R, ro, rd, tN, tF, nN, nF, ok);
  slab(vec3( 0.86603,  0.5, 0.0), -R, ro, rd, tN, tF, nN, nF, ok);
  slab(vec3(-0.86603,  0.5, 0.0), -R, ro, rd, tN, tF, nN, nF, ok);
  slab(vec3( 0.0, 0.0,  1.0), -H, ro, rd, tN, tF, nN, nF, ok);
  slab(vec3( 0.0, 0.0, -1.0), -H, ro, rd, tN, tF, nN, nF, ok);

  return ok && tN <= tF && tF > 0.0;
}

/* the room the prism has to bend: a near-black void with three sources,
   echoing the lightformers the three.js version used */
vec3 env(vec3 rd) {
  /* Broad sources, not tight specular lobes — with narrow highlights most
     refracted rays land on empty black and the glass reads as grey stone. */
  float key  = pow(max(dot(rd, normalize(vec3( 0.45,  0.55,  0.60))), 0.0), 4.0);
  float fill = pow(max(dot(rd, normalize(vec3(-0.65, -0.10,  0.45))), 0.0), 2.5);
  float rim  = pow(max(dot(rd, normalize(vec3( 0.10, -0.85, -0.40))), 0.0), 3.5);

  /* a cold gradient sky so every exit direction carries something */
  vec3 c = mix(vec3(0.030, 0.034, 0.062), vec3(0.10, 0.11, 0.21), rd.y * 0.5 + 0.5);
  c += vec3(1.00, 0.97, 0.92) * key  * 2.8;
  c += vec3(0.30, 0.50, 1.00) * fill * 1.15;
  c += vec3(0.85, 0.40, 1.00) * rim  * 0.95;
  return c;
}

void main() {
  vec2 uv = (gl_FragCoord.xy * 2.0 - uRes) / min(uRes.x, uRes.y);

  vec3 ro = vec3(0.0, 0.0, 3.0);
  vec3 rd = normalize(vec3(uv * 0.62, -1.0));

  /* Oscillate rather than spin. A continuous turn swings the rectangular
     side faces into view and the silhouette stops reading as a triangle;
     rocking inside ±30° keeps the triangular face toward the reader. */
  float a = 0.16 + sin(uTime * 0.24) * 0.42;
  float bx = uTilt.y * 0.40;
  float bz = -uTilt.x * 0.34;
  mat3 rot = rotY(a) * rotX(bx) * rotZ(bz);
  mat3 inv = rotZ(-bz) * rotX(-bx) * rotY(-a);   // GLSL ES 1.0 has no transpose()

  vec3 roO = inv * ro;
  vec3 rdO = inv * rd;

  vec3 outc = vec3(0.0);
  float alpha = 0.0;

  float tN, tF; vec3 nN, nF;
  if (hitPrism(roO, rdO, tN, tF, nN, nF)) {
    alpha = 1.0;
    vec3 entry = roO + rdO * tN;

    vec3 col = vec3(0.0);
    for (int i = 0; i < SAMPLES; i++) {
      float s = (float(i) + 0.5) / float(SAMPLES);   // 0 violet .. 1 red
      float ior = mix(1.74, 1.40, s);                 // violet bends most
      vec3 tint = bandColor(s);

      vec3 dirOut;
      vec3 rdi = refract(rdO, nN, 1.0 / ior);
      if (dot(rdi, rdi) < 0.5) {
        dirOut = reflect(rdO, nN);                    // total internal reflection
      } else {
        vec3 p = entry + rdi * 1e-3;
        float t2N, t2F; vec3 n2N, n2F;
        if (hitPrism(p, rdi, t2N, t2F, n2N, n2F)) {
          vec3 rdo = refract(rdi, -n2F, ior);         // exit face normal faces out
          dirOut = (dot(rdo, rdo) < 0.5) ? reflect(rdi, -n2F) : rdo;
        } else {
          dirOut = rdi;
        }
      }
      col += env(rot * dirOut) * tint;
    }
    col /= float(SAMPLES);

    /* Schlick: grazing angles mirror the room instead of transmitting it */
    float f = pow(1.0 - max(dot(-rdO, nN), 0.0), 5.0);
    f = 0.04 + 0.96 * f;
    col = mix(col, env(rot * reflect(rdO, nN)), f * 0.55);

    /* edges are where dispersion is visible — lift them */
    col += bandColor(fract(uTime * 0.05 + uv.x * 0.5)) * f * 0.5;

    outc = col;
  }

  /* additive halo so the element seats into the page instead of cutting out */
  float halo = exp(-length(uv) * 2.6) * 0.13;
  vec3 glow = mix(vec3(0.55, 0.62, 1.0), vec3(1.0, 0.85, 0.95), 0.5 + 0.5 * sin(uTime * 0.3));

  /* premultiplied: rgb carries light even where alpha is 0 */
  gl_FragColor = vec4(outc * alpha + glow * halo, alpha);
}
`;

/** Compile, link and return the program, or null if anything fails. */
export function buildProgram(gl) {
  const compile = (type, src) => {
    const sh = gl.createShader(type);
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
      gl.deleteShader(sh);
      return null;
    }
    return sh;
  };

  const vs = compile(gl.VERTEX_SHADER, VERT);
  const fs = compile(gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return null;

  const prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  gl.deleteShader(vs);
  gl.deleteShader(fs);

  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    gl.deleteProgram(prog);
    return null;
  }
  return prog;
}
