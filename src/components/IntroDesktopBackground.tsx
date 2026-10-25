"use client";

import { useEffect, useRef } from "react";

export const introLandscape = {
  skyTop: "#1260E8",
  skyUpper: "#1974F2",
  skyMid: "#328AF0",
  skyLower: "#78ADF0",
  skyHorizon: "#93BEF2",
  leftY: 0.51,
  crestX: 0.33,
  crestY: 0.46,
  rightY: 0.6,
  cloudFarSpeed: 1.8,
  cloudMidSpeed: 3.4,
  cloudNearSpeed: 5.6,
};

type Rng = () => number;

const grassPalette = [
  { t: 0, r: 36, g: 73, b: 21 },
  { t: 0.16, r: 40, g: 84, b: 23 },
  { t: 0.32, r: 53, g: 107, b: 25 },
  { t: 0.5, r: 79, g: 140, b: 28 },
  { t: 0.68, r: 105, g: 165, b: 31 },
  { t: 0.84, r: 139, g: 189, b: 32 },
  { t: 1, r: 154, g: 205, b: 36 },
];

function mulberry32(seed: number): Rng {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let n = Math.imul(t ^ (t >>> 15), 1 | t);
    n ^= n + Math.imul(n ^ (n >>> 7), 61 | n);
    return ((n ^ (n >>> 14)) >>> 0) / 4294967296;
  };
}

function hash32(x: number, y: number, seed: number) {
  let n =
    Math.imul(x | 0, 374761393) ^
    Math.imul(y | 0, 668265263) ^
    Math.imul(seed | 0, 1442695041);
  n = Math.imul(n ^ (n >>> 13), 1274126177);
  return ((n ^ (n >>> 16)) >>> 0) / 4294967296;
}

function fade(t: number) {
  return t * t * t * (t * (t * 6 - 15) + 10);
}

function valueNoise(x: number, y: number, seed: number) {
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const fx = fade(x - x0);
  const fy = fade(y - y0);
  const a = hash32(x0, y0, seed);
  const b = hash32(x0 + 1, y0, seed);
  const c = hash32(x0, y0 + 1, seed);
  const d = hash32(x0 + 1, y0 + 1, seed);
  return a + (b - a) * fx + (c - a) * fy + (a - b - c + d) * fx * fy;
}

function fbm(x: number, y: number, seed: number, octaves = 4) {
  let value = 0;
  let amp = 0.5;
  let freq = 1;
  let norm = 0;
  for (let i = 0; i < octaves; i += 1) {
    value += valueNoise(x * freq, y * freq, seed + i * 19) * amp;
    norm += amp;
    amp *= 0.5;
    freq *= 2.02;
  }
  return value / norm;
}

function mixPalette(t: number) {
  const x = Math.min(1, Math.max(0, t));
  let i = 0;
  while (i < grassPalette.length - 2 && x > grassPalette[i + 1].t) i += 1;
  const a = grassPalette[i];
  const b = grassPalette[i + 1];
  const u = (x - a.t) / (b.t - a.t || 1);
  return {
    r: a.r + (b.r - a.r) * u,
    g: a.g + (b.g - a.g) * u,
    b: a.b + (b.b - a.b) * u,
  };
}

function makeCanvas(width: number, height: number) {
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(width));
  canvas.height = Math.max(1, Math.round(height));
  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) throw new Error("Canvas 2D is not available");
  return { canvas, ctx };
}

function cubic(p0: number, p1: number, p2: number, p3: number, t: number) {
  const u = 1 - t;
  return u * u * u * p0 + 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t * p3;
}

function buildHillTop(w: number, h: number) {
  const { leftY, crestX, crestY, rightY } = introLandscape;
  const top = new Float32Array(w);
  top.fill(h);
  const segs = [
    [
      [0, leftY],
      [0.13, leftY - 0.018],
      [crestX - 0.1, crestY + 0.004],
      [crestX, crestY],
    ],
    [
      [crestX, crestY],
      [crestX + 0.18, crestY + 0.006],
      [0.74, rightY - 0.012],
      [1, rightY],
    ],
  ] as const;

  for (const [p0, p1, p2, p3] of segs) {
    for (let i = 0; i <= 2400; i += 1) {
      const t = i / 2400;
      const x = Math.round(cubic(p0[0], p1[0], p2[0], p3[0], t) * (w - 1));
      const y = cubic(p0[1], p1[1], p2[1], p3[1], t) * h;
      if (x >= 0 && x < w && y < top[x]) top[x] = y;
    }
  }

  for (let x = 1; x < w; x += 1) {
    if (top[x] === h) top[x] = top[x - 1];
  }
  for (let x = w - 2; x >= 0; x -= 1) {
    if (top[x] === h) top[x] = top[x + 1];
  }
  return top;
}

function drawSky(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const vertical = ctx.createLinearGradient(0, 0, 0, h * 0.64);
  vertical.addColorStop(0, introLandscape.skyTop);
  vertical.addColorStop(0.22, introLandscape.skyUpper);
  vertical.addColorStop(0.5, introLandscape.skyMid);
  vertical.addColorStop(0.82, introLandscape.skyLower);
  vertical.addColorStop(1, introLandscape.skyHorizon);
  ctx.fillStyle = vertical;
  ctx.fillRect(0, 0, w, h);

  const side = ctx.createLinearGradient(0, 0, w, 0);
  side.addColorStop(0, "rgba(255,255,255,0.06)");
  side.addColorStop(0.4, "rgba(255,255,255,0)");
  side.addColorStop(1, "rgba(8,48,150,0.05)");
  ctx.fillStyle = side;
  ctx.fillRect(0, 0, w, h * 0.64);
}

function paintDensityField(
  width: number,
  height: number,
  densityAt: (x: number, y: number) => number,
  lightAt: (x: number, y: number, density: number) => number,
) {
  const { canvas, ctx } = makeCanvas(width, height);
  const image = ctx.createImageData(width, height);
  const { data } = image;
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const density = densityAt(x, y);
      if (density <= 0) continue;
      const light = lightAt(x, y, density);
      const i = (y * width + x) * 4;
      data[i] = 255;
      data[i + 1] = 255 - (1 - light) * 12;
      data[i + 2] = 255 - (1 - light) * 36;
      data[i + 3] = Math.round(Math.min(1, density) * 255);
    }
  }
  ctx.putImageData(image, 0, 0);
  return canvas;
}

function drawCumulus(
  ctx: CanvasRenderingContext2D,
  rng: Rng,
  cx: number,
  cy: number,
  scale: number,
  kind: "full" | "broken" | "wispy",
) {
  const lobes = 5 + Math.floor(rng() * (kind === "wispy" ? 3 : 7));
  const specs = Array.from({ length: lobes }, () => ({
    x: (rng() - 0.5) * scale * (kind === "broken" ? 1.8 : 1.35),
    y: (rng() - 0.62) * scale * (kind === "wispy" ? 0.28 : 0.48),
    rx: scale * (0.18 + rng() * (kind === "wispy" ? 0.28 : 0.42)),
    ry: scale * (0.1 + rng() * (kind === "wispy" ? 0.12 : 0.22)),
    w: 0.55 + rng() * 0.7,
  }));
  const width = Math.ceil(scale * 3.2);
  const height = Math.ceil(scale * 1.7);
  const seed = Math.floor(rng() * 1000);
  const threshold = kind === "wispy" ? 0.42 : 0.5;
  const cloud = paintDensityField(
    width,
    height,
    (x, y) => {
      const lx = x - width / 2;
      const ly = y - height / 2;
      let density = 0;
      for (const lobe of specs) {
        const dx = (lx - lobe.x) / lobe.rx;
        const dy = (ly - lobe.y) / lobe.ry;
        const r2 = dx * dx + dy * dy;
        if (r2 < 2.1) density += lobe.w * (1 - r2 / 2.1) ** 2;
      }
      const n = fbm(x / (scale * 0.22), y / (scale * 0.16), seed, 4);
      density *= 0.62 + n * 0.7;
      if (kind === "broken" && n < 0.38) density *= 0.35;
      return Math.max(0, (density - threshold) * 1.55);
    },
    (x, y) => {
      const nx = 0.5 - x / width;
      const ny = 0.55 - y / height;
      return Math.min(1, Math.max(0.35, 0.62 + ny * 0.5 + nx * 0.18));
    },
  );
  ctx.drawImage(cloud, cx - width / 2, cy - height / 2);
}

function drawCirrusBand(
  ctx: CanvasRenderingContext2D,
  rng: Rng,
  x: number,
  y: number,
  length: number,
  thickness: number,
) {
  const width = Math.ceil(length);
  const height = Math.ceil(thickness * 3.2);
  const seed = Math.floor(rng() * 800);
  const tilt = -0.2 + rng() * 0.12;
  const band = paintDensityField(
    width,
    height,
    (px, py) => {
      const u = px / width;
      const v = (py - height / 2) / thickness;
      const warp = fbm(u * 3.2, py / 10, seed, 4);
      const filament = fbm(u * 7 + warp * 2.4, v * 1.6, seed + 4, 4);
      const envelope = Math.exp(-((v - (warp - 0.5) * 0.8) ** 2) * 1.6);
      const gaps = filament > 0.5 ? filament : 0;
      return Math.max(0, (gaps - 0.5) * envelope * 1.45);
    },
    () => 0.92,
  );
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(tilt);
  ctx.globalAlpha = 0.78;
  ctx.drawImage(band, 0, -height / 2);
  ctx.restore();
}

function paintCloudLayer(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  layer: "far" | "mid" | "near",
) {
  if (layer === "far") {
    const rng = mulberry32(811);
    drawCirrusBand(ctx, rng, w * 0.24, h * 0.068, w * 0.36, h * 0.013);
    drawCirrusBand(ctx, rng, w * 0.44, h * 0.105, w * 0.26, h * 0.01);
    drawCirrusBand(ctx, rng, w * 0.62, h * 0.048, w * 0.2, h * 0.009);
    drawCumulus(ctx, rng, w * 0.2, h * 0.4, w * 0.028, "wispy");
    drawCumulus(ctx, rng, w * 0.41, h * 0.43, w * 0.02, "wispy");
    drawCumulus(ctx, rng, w * 0.68, h * 0.415, w * 0.022, "broken");
    return;
  }

  if (layer === "mid") {
    const rng = mulberry32(1409);
    drawCumulus(ctx, rng, w * 0.04, h * 0.07, w * 0.07, "broken");
    drawCumulus(ctx, rng, w * 0.16, h * 0.045, w * 0.038, "wispy");
    drawCumulus(ctx, rng, w * 0.34, h * 0.195, w * 0.032, "broken");
    drawCumulus(ctx, rng, w * 0.54, h * 0.28, w * 0.07, "full");
    drawCirrusBand(ctx, rng, w * 0.3, h * 0.13, w * 0.22, h * 0.012);
    return;
  }

  const rng = mulberry32(2207);
  drawCumulus(ctx, rng, w * 0.8, h * 0.21, w * 0.09, "full");
  drawCumulus(ctx, rng, w * 0.93, h * 0.11, w * 0.055, "broken");
  drawCumulus(ctx, rng, w * 0.88, h * 0.3, w * 0.03, "wispy");
  drawCumulus(ctx, rng, w * 0.07, h * 0.15, w * 0.04, "broken");
}

function renderLand(w: number, h: number) {
  const { canvas, ctx } = makeCanvas(w, h);
  const top = buildHillTop(w, h);
  const image = ctx.createImageData(w, h);
  const { data } = image;

  for (let x = 0; x < w; x += 1) {
    const ridge = top[x];
    const slope =
      (top[Math.min(w - 1, x + 3)] - top[Math.max(0, x - 3)]) / 6 / h;
    const u = x / w;

    for (let y = Math.max(0, Math.floor(ridge) - 1); y < h; y += 1) {
      const edge = ridge - y;
      if (edge > 1) continue;

      const v = y / h;
      const span = h - ridge;
      const depth = span > 1 ? (y - ridge) / span : 1;
      const nBroad = fbm(u * 1.7, v * 1.25, 3, 5);
      const nMid = fbm(u * 4.8 + nBroad * 0.35, v * 3.6, 11, 4);
      const nFine = fbm(u * 22, v * 14 + u * 3, 29, 3);
      const nGrain = fbm(u * 64, v * 36 + u * 8, 47, 2);

      let light = 0.62;
      light += (1 - depth) * 0.22;
      light -= depth * 0.3;
      light -= u * 0.1;
      light += (1 - u) * (1 - depth) * 0.16;
      light -= slope * 1.8;
      light += (nBroad - 0.5) * 0.2;
      light += (nMid - 0.5) * 0.11;
      light += (nFine - 0.5) * (0.05 + depth * 0.06);
      light += (nGrain - 0.5) * (0.028 + depth * 0.055);

      const contour = Math.sin(
        (y - ridge) * (0.045 + depth * 0.05) + nMid * 5.5,
      );
      light += contour * (0.012 + depth * 0.018);

      const color = mixPalette(light);
      let { r, g, b } = color;

      const bloom = hash32(x, y, 77);
      const flowerChance = Math.max(0, depth - 0.38) ** 2 * 0.014;
      if (bloom < flowerChance) {
        const warmth = bloom / Math.max(flowerChance, 1e-6);
        r = r * 0.45 + (210 + warmth * 30) * 0.55;
        g = g * 0.45 + (190 + warmth * 20) * 0.55;
        b = b * 0.55 + 70 * 0.45;
      }

      const i = (y * w + x) * 4;
      data[i] = r;
      data[i + 1] = g;
      data[i + 2] = b;
      data[i + 3] = edge > 0 ? Math.round((1 - edge) * 255) : 255;
    }
  }

  ctx.putImageData(image, 0, 0);
  return canvas;
}

function drawClouds(
  ctx: CanvasRenderingContext2D,
  layer: HTMLCanvasElement,
  offset: number,
  w: number,
) {
  const x = -((offset % w) + w) % w;
  ctx.drawImage(layer, x, 0);
  ctx.drawImage(layer, x + w, 0);
}

export function IntroDesktopBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const view = canvas.getContext("2d", { alpha: false });
    if (!view) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let far: HTMLCanvasElement | null = null;
    let mid: HTMLCanvasElement | null = null;
    let near: HTMLCanvasElement | null = null;
    let land: HTMLCanvasElement | null = null;
    let sky: HTMLCanvasElement | null = null;
    let width = 0;
    let height = 0;
    let raf = 0;
    let last = performance.now();
    let farX = 0;
    let midX = 0;
    let nearX = 0;

    const paint = (now: number) => {
      const dt = Math.min(48, now - last) / 1000;
      last = now;
      if (!reduce && width) {
        farX += introLandscape.cloudFarSpeed * dt;
        midX += introLandscape.cloudMidSpeed * dt;
        nearX += introLandscape.cloudNearSpeed * dt;
      }
      if (sky && land && far && mid && near) {
        view.drawImage(sky, 0, 0);
        drawClouds(view, far, farX, width);
        drawClouds(view, mid, midX, width);
        drawClouds(view, near, nearX, width);
        view.drawImage(land, 0, 0);
      }
      if (!reduce) raf = requestAnimationFrame(paint);
    };

    const rebuild = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const nextW = Math.max(1, Math.round(rect.width * dpr));
      const nextH = Math.max(1, Math.round(rect.height * dpr));
      if (nextW === width && nextH === height) return;
      width = nextW;
      height = nextH;
      canvas.width = width;
      canvas.height = height;

      const skyLayer = makeCanvas(width, height);
      drawSky(skyLayer.ctx, width, height);
      sky = skyLayer.canvas;

      const farLayer = makeCanvas(width, height);
      paintCloudLayer(farLayer.ctx, width, height, "far");
      far = farLayer.canvas;

      const midLayer = makeCanvas(width, height);
      paintCloudLayer(midLayer.ctx, width, height, "mid");
      mid = midLayer.canvas;

      const nearLayer = makeCanvas(width, height);
      paintCloudLayer(nearLayer.ctx, width, height, "near");
      near = nearLayer.canvas;

      land = renderLand(width, height);

      view.drawImage(sky, 0, 0);
      drawClouds(view, far, farX, width);
      drawClouds(view, mid, midX, width);
      drawClouds(view, near, nearX, width);
      view.drawImage(land, 0, 0);
    };

    rebuild();
    const observer = new ResizeObserver(rebuild);
    observer.observe(canvas.parentElement ?? canvas);
    if (!reduce) raf = requestAnimationFrame(paint);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="intro-desktop-bg absolute inset-0 h-full w-full"
      aria-hidden
    />
  );
}
