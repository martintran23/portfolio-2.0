"use client";

import { useEffect, useRef } from "react";

const skyVertex = `
attribute vec2 aClip;
varying vec2 vUv;
void main() {
  vUv = aClip * 0.5 + 0.5;
  gl_Position = vec4(aClip, 0.0, 1.0);
}
`;

const skyFragment = `
precision highp float;
varying vec2 vUv;
uniform float uTime;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += noise(p) * a;
    p = p * 2.02 + vec2(1.7, 9.2);
    a *= 0.5;
  }
  return v;
}

vec3 srgb(vec3 c) {
  return pow(max(c, 0.0), vec3(0.4545));
}

void main() {
  vec2 uv = vec2(vUv.x, 1.0 - vUv.y);
  float y = uv.y;

  vec3 zenith = vec3(0.005, 0.177, 0.680);
  vec3 high = vec3(0.039, 0.330, 0.797);
  vec3 mid = vec3(0.184, 0.488, 0.859);
  vec3 low = vec3(0.511, 0.694, 0.908);
  vec3 horizon = vec3(0.767, 0.859, 0.941);
  vec3 shadowCol = vec3(0.339, 0.442, 0.573);
  vec3 bodyCol = vec3(0.723, 0.782, 0.843);
  vec3 litCol = vec3(0.974, 0.983, 1.0);

  vec3 sky = mix(zenith, high, smoothstep(0.0, 0.26, y));
  sky = mix(sky, mid, smoothstep(0.1, 0.42, y));
  sky = mix(sky, low, smoothstep(0.28, 0.62, y));
  sky = mix(sky, horizon, smoothstep(0.5, 0.9, y));

  float band = smoothstep(0.0, 0.05, y) * (1.0 - smoothstep(0.46, 0.74, y));
  vec2 farP = vec2(uv.x * 1.35 + uTime * 0.03, y * 0.7);
  float farWarp = fbm(farP + vec2(2.2, 5.0));
  float farN = fbm(farP + farWarp * vec2(0.32, 0.1));
  float farShade = fbm(farP + vec2(0.24, 0.1));
  float farMask = smoothstep(0.39, 0.52, farN);
  float farLight = clamp(0.2 + (farN - farShade) * 4.0, 0.0, 1.0);
  vec3 farCol = mix(shadowCol, litCol, farLight * farLight);
  sky = mix(sky, farCol, farMask * band * 0.88);

  vec2 nearP = vec2(uv.x * 2.5 + uTime * 0.055, y * 1.3 + uTime * 0.004);
  vec2 nearWarp = vec2(fbm(nearP + vec2(3.3, 1.1)), fbm(nearP + vec2(7.7, 4.4)));
  vec2 nearQ = nearP + (nearWarp - 0.45) * vec2(0.4, 0.3);
  float nearN = fbm(nearQ);
  float nearShade = fbm(nearQ + vec2(0.18, 0.08));
  float nearMask = smoothstep(0.43, 0.57, nearN);
  float nearLight = clamp(0.1 + (nearN - nearShade) * 4.2, 0.0, 1.0);
  vec3 nearCol = mix(shadowCol, litCol, smoothstep(0.0, 0.85, nearLight));
  nearCol = mix(bodyCol, nearCol, 0.8);
  sky = mix(sky, nearCol, nearMask * band * 0.95);

  gl_FragColor = vec4(srgb(sky), 1.0);
}
`;

const landVertex = `
attribute vec2 aUv;
uniform mat4 uViewProj;
uniform float uTime;
varying vec3 vWorld;
varying vec3 vNormal;
varying float vFar;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += noise(p) * a;
    p = p * 2.03 + vec2(3.1, 1.7);
    a *= 0.5;
  }
  return v;
}

float terrain(vec2 xz) {
  float far = clamp((2.4 - xz.y) / 10.0, 0.0, 1.0);
  vec2 d = (xz - vec2(-4.8, -5.2)) * vec2(0.24, 0.3);
  float hill = exp(-dot(d, d)) * 1.05;
  hill *= smoothstep(0.12, 0.78, far);
  hill *= mix(1.0, 0.45, smoothstep(-0.6, 4.2, xz.x));
  float roll = sin(xz.x * 0.22) * 0.03 + sin(xz.y * 0.18) * 0.02;
  roll += (fbm(xz * 0.16) - 0.5) * 0.07;
  roll += (fbm(xz * 1.7 + 2.0) - 0.5) * 0.018;
  return hill + roll;
}

void main() {
  float x = (aUv.x - 0.5) * 18.0;
  float z = mix(4.2, -8.4, aUv.y);
  float y = terrain(vec2(x, z));
  float e = 0.07;
  float dx = terrain(vec2(x + e, z)) - terrain(vec2(x - e, z));
  float dz = terrain(vec2(x, z + e)) - terrain(vec2(x, z - e));
  vec3 normal = normalize(vec3(-dx, e * 2.0, -dz));
  vec4 world = vec4(x, y, z, 1.0);
  vWorld = world.xyz;
  vNormal = normal;
  vFar = clamp((3.2 - z) / 11.0, 0.0, 1.0);
  gl_Position = uViewProj * world;
}
`;

const landFragment = `
precision highp float;
varying vec3 vWorld;
varying vec3 vNormal;
varying float vFar;
uniform float uTime;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += noise(p) * a;
    p *= 2.05;
    a *= 0.5;
  }
  return v;
}

vec3 srgb(vec3 c) { return pow(max(c, 0.0), vec3(0.4545)); }

void main() {
  vec3 n = normalize(vNormal);
  float detail = smoothstep(0.9, 0.08, vFar);
  float broad = fbm(vWorld.xz * 1.35);
  float clump = fbm(vWorld.xz * 4.2 + 2.0);
  float fine = fbm(vWorld.xz * vec2(14.0, 24.0));

  vec3 grass = mix(vec3(0.1, 0.27, 0.06), vec3(0.18, 0.36, 0.08), broad);
  grass = mix(grass, vec3(0.24, 0.42, 0.1), clump * 0.16);
  grass *= 0.96 + fine * 0.08;

  float bump = fbm(vWorld.xz * vec2(34.0, 70.0));
  vec3 bumped = normalize(n + vec3((bump - 0.5) * 0.45, 0.15, (fine - 0.5) * 0.28) * detail);
  vec3 sun = normalize(vec3(-0.35, 0.9, 0.22));
  float wrap = clamp(dot(bumped, sun) * 0.45 + 0.55, 0.0, 1.0);
  float ao = smoothstep(0.15, 0.85, n.y);
  vec3 ambient = mix(vec3(0.16, 0.22, 0.11), vec3(0.58, 0.68, 0.74), clamp(bumped.y * 0.5 + 0.55, 0.0, 1.0));
  float cloudShade = fbm(vWorld.xz * vec2(0.045, 0.028) + vec2(uTime * 0.045, 0.2));
  vec3 color = grass * ambient * (0.84 + cloudShade * 0.1) * mix(0.88, 1.0, ao);
  color += grass * vec3(1.0, 0.97, 0.88) * pow(wrap, 1.2) * 0.42;

  color = mix(color, vec3(0.62, 0.76, 0.9), smoothstep(0.66, 1.0, vFar) * 0.26);
  gl_FragColor = vec4(srgb(color), 1.0);
}
`;

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) throw new Error("Could not create shader");
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader) ?? "Shader failed";
    gl.deleteShader(shader);
    throw new Error(log);
  }
  return shader;
}

function program(gl: WebGLRenderingContext, vertex: string, fragment: string) {
  const prog = gl.createProgram();
  if (!prog) throw new Error("Could not create program");
  gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, vertex));
  gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, fragment));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(prog) ?? "Program failed");
  }
  return prog;
}

function perspective(fov: number, aspect: number, near: number, far: number) {
  const f = 1 / Math.tan(fov / 2);
  const nf = 1 / (near - far);
  const m = new Float32Array(16);
  m[0] = f / aspect;
  m[5] = f;
  m[10] = (far + near) * nf;
  m[11] = -1;
  m[14] = 2 * far * near * nf;
  return m;
}

function lookAt(eye: number[], target: number[], up: number[]) {
  const z = normalize([eye[0] - target[0], eye[1] - target[1], eye[2] - target[2]]);
  const x = normalize(cross(up, z));
  const y = cross(z, x);
  const m = new Float32Array(16);
  m[0] = x[0];
  m[1] = y[0];
  m[2] = z[0];
  m[4] = x[1];
  m[5] = y[1];
  m[6] = z[1];
  m[8] = x[2];
  m[9] = y[2];
  m[10] = z[2];
  m[12] = -dot(x, eye);
  m[13] = -dot(y, eye);
  m[14] = -dot(z, eye);
  m[15] = 1;
  return m;
}

function multiply(a: Float32Array, b: Float32Array) {
  const o = new Float32Array(16);
  for (let c = 0; c < 4; c += 1) {
    for (let r = 0; r < 4; r += 1) {
      o[c * 4 + r] =
        a[r] * b[c * 4] +
        a[4 + r] * b[c * 4 + 1] +
        a[8 + r] * b[c * 4 + 2] +
        a[12 + r] * b[c * 4 + 3];
    }
  }
  return o;
}

function cross(a: number[], b: number[]) {
  return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
}

function dot(a: number[], b: number[]) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

const grassVertex = `
attribute vec3 aPos;
attribute float aTip;
attribute vec3 aTint;
uniform mat4 uViewProj;
uniform float uTime;
varying float vTip;
varying vec3 vTint;
void main() {
  vTip = aTip;
  vTint = aTint;
  float depth = clamp((1.5 - aPos.z) / 8.2, 0.0, 1.0);
  float scale = 1.0 - depth * 0.74;
  float flex = smoothstep(0.0, 0.28, aTip);
  float phase = aPos.x * 0.68 + aPos.z * 0.34;
  float wave = sin(phase - uTime * 2.5) - sin(phase);
  float local = aPos.x * 5.2 + aPos.z * 3.6;
  float flutter = sin(local + uTime * 5.1) - sin(local);
  float bend = (wave * 0.78 + flutter * 0.22) * flex * scale * 0.0072;
  vec3 pos = aPos;
  pos.x += bend * 0.9;
  pos.z += bend * 0.34;
  pos.y -= bend * bend * 14.0;
  gl_Position = uViewProj * vec4(pos, 1.0);
}
`;

const grassFragment = `
precision highp float;
varying float vTip;
varying vec3 vTint;
vec3 srgb(vec3 c) { return pow(max(c, 0.0), vec3(0.4545)); }
void main() {
  vec3 base = vec3(0.07, 0.22, 0.05);
  vec3 color = mix(base, vTint, smoothstep(0.15, 1.0, vTip));
  gl_FragColor = vec4(srgb(color), 1.0);
}
`;

function terrainHeight(x: number, z: number) {
  const far = Math.min(1, Math.max(0, (2.4 - z) / 10));
  const dx = (x + 4.8) * 0.24;
  const dz = (z + 5.2) * 0.3;
  let hill = Math.exp(-(dx * dx + dz * dz)) * 1.05;
  const grow = Math.min(1, Math.max(0, (far - 0.12) / 0.66));
  hill *= grow * grow * (3 - 2 * grow);
  const side = Math.min(1, Math.max(0, (x + 0.6) / 4.8));
  const shaped = side * side * (3 - 2 * side);
  hill *= 1 - shaped * 0.55;
  return hill + Math.sin(x * 0.22) * 0.03 + Math.sin(z * 0.18) * 0.02 + 0.012;
}

function buildGrass() {
  const tufts = 288000;
  const flowers = 11500;
  const verts = tufts * 6 + flowers * 18;
  const data = new Float32Array(verts * 7);
  let t = 11;
  const rnd = () => {
    t += 0x6d2b79f5;
    let n = Math.imul(t ^ (t >>> 15), 1 | t);
    n ^= n + Math.imul(n ^ (n >>> 7), 61 | n);
    return ((n ^ (n >>> 14)) >>> 0) / 4294967296;
  };
  let cursor = 0;
  const write = (x: number, y: number, z: number, tip: number, tint: number[]) => {
    data[cursor++] = x;
    data[cursor++] = y;
    data[cursor++] = z;
    data[cursor++] = tip;
    data[cursor++] = tint[0];
    data[cursor++] = tint[1];
    data[cursor++] = tint[2];
  };
  const greens = [
    [0.3, 0.48, 0.11],
    [0.4, 0.58, 0.14],
    [0.24, 0.42, 0.09],
  ];
  const petals = [
    [0.96, 0.84, 0.28],
    [0.97, 0.97, 0.93],
    [0.9, 0.48, 0.62],
    [0.62, 0.48, 0.86],
  ];
  const center = [0.98, 0.82, 0.22];
  const stem = [0.28, 0.46, 0.1];

  const place = () => {
    const farBand = rnd() < 0.34;
    const z = farBand ? -1.1 - rnd() * 6.4 : 1.4 - Math.pow(rnd(), 1.35) * 5.2;
    const spread = farBand ? 6.2 + (-1.1 - z) * 0.45 : 4.2 + (1.4 - z) * 1.15;
    const x = (rnd() - 0.5) * spread * 2;
    return { x, z, y: terrainHeight(x, z), farBand };
  };

  for (let i = 0; i < tufts; i += 1) {
    const { x, y, z } = place();
    const depth = Math.min(1, Math.max(0, (1.5 - z) / 8.2));
    const scale = 1 - depth * 0.74;
    const height = (0.03 + rnd() * 0.042) * scale;
    const width = (0.0042 + rnd() * 0.0032) * scale;
    const yaw = rnd() * Math.PI;
    const lean = (rnd() - 0.5) * 0.1 * scale;
    const tint = greens[Math.floor(rnd() * greens.length)];
    const tipX = x + Math.cos(yaw) * lean;
    const tipZ = z + Math.sin(yaw) * lean;
    for (let card = 0; card < 2; card += 1) {
      const angle = yaw + card * Math.PI * 0.5;
      const ox = Math.cos(angle) * width;
      const oz = Math.sin(angle) * width;
      write(x - ox, y, z - oz, 0, tint);
      write(x + ox, y, z + oz, 0, tint);
      write(tipX, y + height, tipZ, 1, tint);
    }
  }

  for (let i = 0; i < flowers; i += 1) {
    const { x, y, z } = place();
    const depth = Math.min(1, Math.max(0, (1.5 - z) / 8.2));
    const scale = 1 - depth * 0.74;
    const height = (0.022 + rnd() * 0.026) * scale;
    const bloom = height * 0.38;
    const stemHalf = 0.002 * scale;
    const petal = petals[Math.floor(rnd() * petals.length)];
    const yaw = rnd() * Math.PI * 2;
    write(x - stemHalf, y, z, 0, stem);
    write(x + stemHalf, y, z, 0, stem);
    write(x, y + height, z, 0.35, stem);
    const headY = y + height;
    const lift = 0.0025 * scale;
    for (let p = 0; p < 5; p += 1) {
      const a0 = yaw + (p / 5) * Math.PI * 2;
      const a1 = yaw + ((p + 0.72) / 5) * Math.PI * 2;
      write(x, headY + lift, z, 1, center);
      write(
        x + Math.cos(a0) * bloom,
        headY + lift,
        z + Math.sin(a0) * bloom * 0.72,
        1,
        petal,
      );
      write(
        x + Math.cos(a1) * bloom,
        headY + lift,
        z + Math.sin(a1) * bloom * 0.72,
        1,
        petal,
      );
    }
  }

  return { data, count: verts };
}

function normalize(v: number[]) {
  const length = Math.hypot(v[0], v[1], v[2]) || 1;
  return [v[0] / length, v[1] / length, v[2] / length];
}

export function IntroDesktopBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: true,
      depth: true,
    });
    if (!gl) return;

    let sky: WebGLProgram | null = null;
    let land: WebGLProgram | null = null;
    let grass: WebGLProgram | null = null;
    try {
      sky = program(gl, skyVertex, skyFragment);
      land = program(gl, landVertex, landFragment);
      grass = program(gl, grassVertex, grassFragment);
    } catch (error) {
      console.error(error);
    }
    if (!sky || !land) return;
    const skyTime = gl.getUniformLocation(sky, "uTime");
    const landTime = gl.getUniformLocation(land, "uTime");
    const viewProj = gl.getUniformLocation(land, "uViewProj");
    const grassView = grass ? gl.getUniformLocation(grass, "uViewProj") : null;
    const grassTime = grass ? gl.getUniformLocation(grass, "uTime") : null;

    const clip = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, clip);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);

    const cols = 240;
    const rows = 160;
    const grid = new Float32Array(cols * rows * 2);
    for (let z = 0; z < rows; z += 1) {
      for (let x = 0; x < cols; x += 1) {
        const i = (z * cols + x) * 2;
        grid[i] = x / (cols - 1);
        grid[i + 1] = z / (rows - 1);
      }
    }
    const indices = new Uint16Array((cols - 1) * (rows - 1) * 6);
    let offset = 0;
    for (let z = 0; z < rows - 1; z += 1) {
      for (let x = 0; x < cols - 1; x += 1) {
        const a = z * cols + x;
        indices[offset++] = a;
        indices[offset++] = a + cols;
        indices[offset++] = a + 1;
        indices[offset++] = a + 1;
        indices[offset++] = a + cols;
        indices[offset++] = a + cols + 1;
      }
    }
    const gridBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, gridBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, grid, gl.STATIC_DRAW);
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    const blades = buildGrass();
    const grassBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, grassBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, blades.data, gl.STATIC_DRAW);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let start = performance.now();
    let width = 0;
    let height = 0;

    const draw = (now: number) => {
      const time = reduce ? 0 : (now - start) / 1000;
      const sway = reduce ? 0 : Math.sin(time * 0.22) * 0.045;
      const aspect = width / Math.max(1, height);
      const proj = perspective((48 * Math.PI) / 180, aspect, 0.05, 40);
      const view = lookAt(
        [0.25 + sway, 0.78, 1.7],
        [-2.15, 0.5, -4.8],
        [0, 1, 0],
      );
      gl.viewport(0, 0, width, height);
      gl.disable(gl.DEPTH_TEST);
      gl.useProgram(sky);
      gl.uniform1f(skyTime, time);
      gl.bindBuffer(gl.ARRAY_BUFFER, clip);
      const skyPos = gl.getAttribLocation(sky, "aClip");
      gl.enableVertexAttribArray(skyPos);
      gl.vertexAttribPointer(skyPos, 2, gl.FLOAT, false, 0, 0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      gl.enable(gl.DEPTH_TEST);
      gl.clear(gl.DEPTH_BUFFER_BIT);
      gl.useProgram(land);
      gl.uniform1f(landTime, time);
      gl.uniformMatrix4fv(viewProj, false, multiply(proj, view));
      gl.bindBuffer(gl.ARRAY_BUFFER, gridBuffer);
      const landPos = gl.getAttribLocation(land, "aUv");
      gl.enableVertexAttribArray(landPos);
      gl.vertexAttribPointer(landPos, 2, gl.FLOAT, false, 0, 0);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
      gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);

      if (grass && grassView) {
        gl.useProgram(grass);
        gl.uniformMatrix4fv(grassView, false, multiply(proj, view));
        if (grassTime) gl.uniform1f(grassTime, time);
        gl.bindBuffer(gl.ARRAY_BUFFER, grassBuffer);
        const stride = 7 * 4;
        const pos = gl.getAttribLocation(grass, "aPos");
        const tip = gl.getAttribLocation(grass, "aTip");
        const tint = gl.getAttribLocation(grass, "aTint");
        gl.enableVertexAttribArray(pos);
        gl.vertexAttribPointer(pos, 3, gl.FLOAT, false, stride, 0);
        gl.enableVertexAttribArray(tip);
        gl.vertexAttribPointer(tip, 1, gl.FLOAT, false, stride, 12);
        gl.enableVertexAttribArray(tint);
        gl.vertexAttribPointer(tint, 3, gl.FLOAT, false, stride, 16);
        gl.drawArrays(gl.TRIANGLES, 0, blades.count);
      }
    };

    const frame = (now: number) => {
      draw(now);
      raf = requestAnimationFrame(frame);
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const nextW = Math.max(1, Math.round(rect.width * dpr));
      const nextH = Math.max(1, Math.round(rect.height * dpr));
      if (nextW === width && nextH === height) return;
      width = nextW;
      height = nextH;
      canvas.width = width;
      canvas.height = height;
      draw(performance.now());
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas.parentElement ?? canvas);
    if (!reduce) raf = requestAnimationFrame(frame);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
      gl.deleteProgram(sky);
      gl.deleteProgram(land);
      if (grass) gl.deleteProgram(grass);
      gl.deleteBuffer(clip);
      gl.deleteBuffer(gridBuffer);
      gl.deleteBuffer(indexBuffer);
      gl.deleteBuffer(grassBuffer);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="intro-desktop-bg absolute inset-0 h-full w-full bg-[#328af0]"
      aria-hidden
    />
  );
}
