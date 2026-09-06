/**
 * Hero ambient — Balsa UI Gradient Studio "obsidian-fold" ribbon, ported to
 * vanilla WebGL (no Three/Vue). Config from Gradient Studio export; effect:none
 * so we only need the single ribbon pass.
 *
 * https://balsa-ui.com/tools/gradient-studio
 */

import { prefersReducedMotion } from './tokens.js';

/** @type {const} Studio background config (schema 3). */
export const STUDIO_BACKGROUND = {
  schemaVersion: 3,
  preset: 'obsidian-fold',
  seed: 1847,
  colorMode: 'custom',
  colors: ['#1A1714', '#1E1C19', '#262320', '#35322E', '#4A4641'],
  speed: 0.465,
  scale: 0.73,
  warp: 1.36,
  wave: 1.05,
  softness: 0.5,
  grain: 0.09,
  grainSize: 1.15,
  contrast: 1.12,
  brightness: -0.01,
  direction: 180,
  quality: 'auto',
  fieldOctaves: 4,
  fieldFrequency: 0.78,
  noiseAmount: 0.05,
  noiseOctaves: 4,
  noiseFrequency: 1.1,
  warpFrequency: 1.05,
  pattern: 'ribbon',
  patternDensity: 2.35,
  patternCenterX: 0,
  patternCenterY: 0,
  patternComplexity: 4,
};

const SHADER_SEED_MOD = 65521;

const VERT = `
precision highp float;
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

/* Fragment shader: Balsa ribbon pattern (gradient-background-shader.ts).
   Octave counts are float uniforms — more reliable than int on WebGL1/ANGLE. */
const FRAG = `
precision highp float;

varying vec2 vUv;
uniform vec2 uResolution;
uniform float uTime;
uniform float uSeed;
uniform float uScale;
uniform float uWarp;
uniform float uWave;
uniform float uSoftness;
uniform float uGrain;
uniform float uGrainPixels;
uniform float uSourceGrain;
uniform float uContrast;
uniform float uBrightness;
uniform float uDirection;
uniform float uFieldFrequency;
uniform float uNoiseFrequency;
uniform float uNoiseAmount;
uniform float uWarpFrequency;
uniform float uPatternDensity;
uniform vec2 uPatternCenter;
uniform float uPatternComplexity;
uniform float uFieldOctaves;
uniform float uNoiseOctaves;
uniform float uColorCount;
uniform vec3 uColors[6];

const float TAU = 6.2831853;

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32 + uSeed * 0.00017);
  return fract(p.x * p.y);
}

float grainHash(vec2 p) {
  vec3 q = fract(vec3(p.xyx) * 0.1031);
  q += dot(q, q.yzx + 33.33);
  return fract((q.x + q.y) * q.z);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash21(i), hash21(i + vec2(1.0, 0.0)), u.x),
    mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0)), u.x),
    u.y
  ) * 2.0 - 1.0;
}

float fieldFbm(vec2 p) {
  float total = 0.0;
  float amplitude = 0.54;
  mat2 rotation = mat2(0.80, -0.60, 0.60, 0.80);
  for (int octave = 0; octave < 4; octave++) {
    if (float(octave) >= uFieldOctaves) break;
    total += amplitude * noise(p);
    p = rotation * p * 2.03 + vec2(13.1, 7.7);
    amplitude *= 0.51;
  }
  return total;
}

float surfaceNoiseFbm(vec2 p) {
  float total = 0.0;
  float amplitude = 0.54;
  mat2 rotation = mat2(0.80, -0.60, 0.60, 0.80);
  for (int octave = 0; octave < 6; octave++) {
    if (float(octave) >= uNoiseOctaves) break;
    total += amplitude * noise(p);
    p = rotation * p * 2.03 + vec2(7.1, 11.7);
    amplitude *= 0.51;
  }
  return total;
}

vec3 colorRamp(float value) {
  float scaled = clamp(value, 0.0, 0.9999) * max(uColorCount - 1.0, 1.0);
  float indexF = floor(scaled);
  float amount = smoothstep(0.0, 1.0, fract(scaled));
  vec3 left = uColors[0];
  vec3 right = uColors[1];
  if (indexF < 0.5) { left = uColors[0]; right = uColors[1]; }
  else if (indexF < 1.5) { left = uColors[1]; right = uColors[2]; }
  else if (indexF < 2.5) { left = uColors[2]; right = uColors[3]; }
  else if (indexF < 3.5) { left = uColors[3]; right = uColors[4]; }
  else { left = uColors[4]; right = uColors[5]; }
  return mix(left, right, amount);
}

float ridgeShape(float phase) {
  float ridge = 1.0 - abs(sin(phase));
  return pow(clamp(ridge, 0.0, 1.0), mix(4.8, 1.25, uSoftness));
}

float shapeField(float field) {
  return mix(smoothstep(-0.05, 1.05, field), field, uSoftness * 0.45);
}

float patternField(vec2 p, vec2 warped, vec2 q, vec2 r, float terrain, float phase) {
  float ridgePhase = warped.y * uPatternDensity
    + r.x * 2.8
    + terrain * 1.55
    + sin(warped.x * 1.4 + q.y * 2.0) * 0.36;
  float ridge = ridgeShape(ridgePhase);
  float broad = terrain * 0.34 + r.y * 0.24 + q.x * 0.13;
  float field = 0.5 + broad + (ridge - 0.28) * uWave * 0.34;
  return shapeField(field);
}

void main() {
  vec2 uv = vUv - 0.5;
  uv.x *= uResolution.x / max(uResolution.y, 1.0);

  float angle = radians(uDirection);
  mat2 flowRotation = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
  vec2 p = flowRotation * uv * uScale;
  float phase = uTime * 0.12;

  vec2 q = vec2(
    fieldFbm(p * uWarpFrequency + vec2(phase, -phase * 0.41)),
    fieldFbm(p * uWarpFrequency + vec2(5.2, 1.3) + vec2(-phase * 0.34, phase * 0.63))
  );
  vec2 warped = p + q * uWarp * 0.72;
  vec2 r = vec2(
    fieldFbm(warped * uFieldFrequency + q * 0.85 + vec2(1.7, 9.2)),
    fieldFbm(warped * uFieldFrequency - q * 0.65 + vec2(8.3, 2.8))
  );

  float terrain = fieldFbm(warped * uFieldFrequency + r * 0.76);
  float field = patternField(p, warped, q, r, terrain, phase);
  field = (field - 0.5) * uContrast + 0.5 + uBrightness;

  vec3 color = colorRamp(field);
  vec2 surfaceNoisePosition = flowRotation * uv * uNoiseFrequency * 6.0;
  surfaceNoisePosition += vec2(uSeed * 0.0013, -uSeed * 0.0009);
  float surfaceNoise = surfaceNoiseFbm(surfaceNoisePosition);
  color += surfaceNoise * uNoiseAmount;

  float grainCell = max(0.35, uGrainPixels);
  vec2 grainCoord = floor(gl_FragCoord.xy / grainCell);
  float grain = grainHash(grainCoord + vec2(uSeed * 0.013, uSeed * 0.029)) - 0.5;
  color += grain * uGrain * uSourceGrain;

  float dither = (grainHash(gl_FragCoord.xy + 17.0) - 0.5) / 255.0;
  color += dither;
  gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
}
`;

function normalizeSeed(seed) {
  const integer = Number.isFinite(seed) ? Math.trunc(seed) : 0;
  return ((integer % SHADER_SEED_MOD) + SHADER_SEED_MOD) % SHADER_SEED_MOD;
}

function parseHex(hex) {
  const raw = String(hex || '#000000').replace('#', '');
  const full = raw.length === 3
    ? raw.split('').map((c) => c + c).join('')
    : raw.padEnd(6, '0').slice(0, 6);
  const n = Number.parseInt(full, 16);
  return [
    ((n >> 16) & 255) / 255,
    ((n >> 8) & 255) / 255,
    (n & 255) / 255,
  ];
}

function compile(gl, type, source) {
  const shader = gl.createShader(type);
  if (!shader) throw new Error('WebGL shader create failed');
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(shader) || 'compile error';
    gl.deleteShader(shader);
    throw new Error(info);
  }
  return shader;
}

function qualityProfile(quality, width) {
  if (quality === 'low' || (quality === 'auto' && width <= 480)) {
    return { pixelRatioScale: 0.62, maxPixelRatio: 1, fps: 24 };
  }
  if (quality === 'high') {
    return { pixelRatioScale: 1, maxPixelRatio: 1.5, fps: 30 };
  }
  return { pixelRatioScale: 0.82, maxPixelRatio: 1.25, fps: 30 };
}

/**
 * Mount the studio ribbon as a full-bleed layer on #hero-media (behind the
 * scene frame). Survives rebuilds via teardown/recreate from main.js.
 * @returns {() => void} teardown
 */
export function heroGradient(root = document) {
  const media = root.querySelector('#hero-media');
  if (!media) return () => {};

  media.classList.add('has-hero-gradient');

  let canvas = media.querySelector(':scope > .hero-media__gradient');
  if (!canvas) {
    // Prefer relocating a frame-nested canvas from an older mount.
    const nested = media.querySelector('.hero-media__gradient');
    canvas = nested || document.createElement('canvas');
    canvas.className = 'hero-media__gradient';
    canvas.setAttribute('aria-hidden', 'true');
    media.insertBefore(canvas, media.firstChild);
  }

  const gl = canvas.getContext('webgl', {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: 'high-performance',
    preserveDrawingBuffer: false,
  }) || canvas.getContext('experimental-webgl', {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    preserveDrawingBuffer: false,
  });

  if (!gl) {
    console.warn('[heroGradient] WebGL unavailable');
    canvas.remove();
    media.classList.add('has-hero-gradient-fallback');
    return () => { media.classList.remove('has-hero-gradient', 'has-hero-gradient-fallback'); };
  }

  const cfg = STUDIO_BACKGROUND;
  let program;
  let raf = 0;
  let disposed = false;
  let elapsed = 0;
  let lastTs = 0;
  let lastDraw = 0;
  let width = 0;
  let height = 0;
  let profile = qualityProfile(cfg.quality, 1);
  let inView = true;
  let visible = document.visibilityState !== 'hidden';
  const reduce = prefersReducedMotion();

  try {
    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(program) || 'link failed');
    }
  } catch (err) {
    console.warn('[heroGradient]', err);
    canvas.remove();
    media.classList.add('has-hero-gradient-fallback');
    return () => { media.classList.remove('has-hero-gradient', 'has-hero-gradient-fallback'); };
  }

  gl.useProgram(program);
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1,
  ]), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(program, 'aPos');
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const loc = (name) => gl.getUniformLocation(program, name);
  const uni = {
    uResolution: loc('uResolution'),
    uTime: loc('uTime'),
    uSeed: loc('uSeed'),
    uScale: loc('uScale'),
    uWarp: loc('uWarp'),
    uWave: loc('uWave'),
    uSoftness: loc('uSoftness'),
    uGrain: loc('uGrain'),
    uGrainPixels: loc('uGrainPixels'),
    uSourceGrain: loc('uSourceGrain'),
    uContrast: loc('uContrast'),
    uBrightness: loc('uBrightness'),
    uDirection: loc('uDirection'),
    uFieldFrequency: loc('uFieldFrequency'),
    uNoiseFrequency: loc('uNoiseFrequency'),
    uNoiseAmount: loc('uNoiseAmount'),
    uWarpFrequency: loc('uWarpFrequency'),
    uPatternDensity: loc('uPatternDensity'),
    uPatternCenter: loc('uPatternCenter'),
    uPatternComplexity: loc('uPatternComplexity'),
    uFieldOctaves: loc('uFieldOctaves'),
    uNoiseOctaves: loc('uNoiseOctaves'),
    uColorCount: loc('uColorCount'),
    uColors: loc('uColors[0]'),
  };

  const colors = cfg.colors.map(parseHex);
  while (colors.length < 6) colors.push(colors[colors.length - 1] || [0, 0, 0]);
  const flat = new Float32Array(18);
  colors.slice(0, 6).forEach((c, i) => {
    flat[i * 3] = c[0];
    flat[i * 3 + 1] = c[1];
    flat[i * 3 + 2] = c[2];
  });

  function pushStatics() {
    gl.uniform1f(uni.uSeed, normalizeSeed(cfg.seed));
    gl.uniform1f(uni.uScale, cfg.scale);
    gl.uniform1f(uni.uWarp, cfg.warp);
    gl.uniform1f(uni.uWave, cfg.wave);
    gl.uniform1f(uni.uSoftness, cfg.softness);
    gl.uniform1f(uni.uGrain, cfg.grain);
    gl.uniform1f(uni.uSourceGrain, 1);
    gl.uniform1f(uni.uContrast, cfg.contrast);
    gl.uniform1f(uni.uBrightness, cfg.brightness);
    gl.uniform1f(uni.uDirection, cfg.direction);
    gl.uniform1f(uni.uFieldFrequency, cfg.fieldFrequency);
    gl.uniform1f(uni.uNoiseFrequency, cfg.noiseFrequency);
    gl.uniform1f(uni.uNoiseAmount, cfg.noiseAmount);
    gl.uniform1f(uni.uWarpFrequency, cfg.warpFrequency);
    gl.uniform1f(uni.uPatternDensity, cfg.patternDensity);
    gl.uniform2f(uni.uPatternCenter, cfg.patternCenterX, cfg.patternCenterY);
    gl.uniform1f(uni.uPatternComplexity, cfg.patternComplexity);
    gl.uniform1f(uni.uFieldOctaves, cfg.fieldOctaves);
    gl.uniform1f(uni.uNoiseOctaves, cfg.noiseOctaves);
    gl.uniform1f(uni.uColorCount, Math.max(2, Math.min(6, cfg.colors.length)));
    gl.uniform3fv(uni.uColors, flat);
  }
  pushStatics();

  function pixelRatio() {
    const dpr = window.devicePixelRatio || 1;
    return Math.min(dpr, profile.maxPixelRatio) * profile.pixelRatioScale;
  }

  function resize() {
    if (disposed) return false;
    const nextW = Math.max(1, media.clientWidth || Math.round(media.getBoundingClientRect().width) || window.innerWidth);
    const nextH = Math.max(1, media.clientHeight || Math.round(media.getBoundingClientRect().height) || window.innerHeight);
    profile = qualityProfile(cfg.quality, nextW);
    const pr = pixelRatio();
    const bw = Math.max(1, Math.round(nextW * pr));
    const bh = Math.max(1, Math.round(nextH * pr));
    if (nextW === width && nextH === height && canvas.width === bw && canvas.height === bh) return false;
    width = nextW;
    height = nextH;
    canvas.width = bw;
    canvas.height = bh;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    gl.viewport(0, 0, bw, bh);
    gl.uniform2f(uni.uResolution, width, height);
    const grainPixels = Math.max(1, cfg.grainSize * (bw / Math.max(1, width)));
    gl.uniform1f(uni.uGrainPixels, grainPixels);
    return true;
  }

  function draw(timeSec) {
    if (disposed) return;
    resize();
    gl.uniform1f(uni.uTime, timeSec);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  function shouldAnimate() {
    return !reduce && !disposed && visible && inView;
  }

  function tick(ts) {
    raf = 0;
    if (!shouldAnimate()) return;
    const delta = lastTs ? Math.min(0.1, (ts - lastTs) / 1000) : 0;
    lastTs = ts;
    elapsed += delta;
    const interval = 1000 / profile.fps;
    if (!lastDraw || ts - lastDraw >= interval) {
      draw(elapsed * cfg.speed);
      lastDraw = ts;
    }
    raf = requestAnimationFrame(tick);
  }

  function sync() {
    if (shouldAnimate()) {
      if (!raf) raf = requestAnimationFrame(tick);
      return;
    }
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    lastTs = 0;
    draw(elapsed * cfg.speed);
  }

  resize();
  draw(0);
  media.classList.add('is-gradient-ready');

  const onVis = () => {
    visible = document.visibilityState !== 'hidden';
    sync();
  };
  document.addEventListener('visibilitychange', onVis);

  const io = typeof IntersectionObserver !== 'undefined'
    ? new IntersectionObserver((entries) => {
      inView = entries[0]?.isIntersecting ?? true;
      sync();
    }, { rootMargin: '120px', threshold: 0 })
    : null;
  io?.observe(media);

  const onLost = (e) => {
    e.preventDefault();
    media.classList.add('has-hero-gradient-fallback');
    media.classList.remove('is-gradient-ready');
  };
  const onRestored = () => {
    media.classList.remove('has-hero-gradient-fallback');
    pushStatics();
    resize();
    draw(elapsed * cfg.speed);
    media.classList.add('is-gradient-ready');
    sync();
  };
  canvas.addEventListener('webglcontextlost', onLost);
  canvas.addEventListener('webglcontextrestored', onRestored);

  sync();

  return () => {
    disposed = true;
    if (raf) cancelAnimationFrame(raf);
    document.removeEventListener('visibilitychange', onVis);
    canvas.removeEventListener('webglcontextlost', onLost);
    canvas.removeEventListener('webglcontextrestored', onRestored);
    io?.disconnect();
    try { gl.getExtension('WEBGL_lose_context')?.loseContext(); } catch { /* ignore */ }
    canvas.remove();
    media.classList.remove('has-hero-gradient', 'has-hero-gradient-fallback', 'is-gradient-ready');
  };
}
