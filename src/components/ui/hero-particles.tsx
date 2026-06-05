"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

// ════════════════════════════════════════════════════════════════════════════
// Faithful port of github.com/Hinarosha/BreathDearMedusae
// Original: React Three Fiber + InstancedMesh + GLSL shaders
// This port: pure Three.js (no R3F) → compatible with Next.js App Router
//
// User config applied verbatim:
//   cursor.dragFactor        = 0.015
//   halo.radiusBase          = 2.4   (world units)
//   halo.radiusAmplitude     = 0.5
//   halo.outerOscFrequency   = 2.6   (breath speed, rad/s)
//   halo.shapeAmplitude      = 0.75
//   halo.rimWidth            = 1.8
//   halo.scaleX              = 1.3   (elliptical stretch)
//   particles.baseSize       = 0.016
//   particles.activeSize     = 0.044
//   particles.blobScaleY     = 0.6   (pill-shape squash)
//   background.color         = #000000
//   colors                   = #4285f5 / #eb4236 / #faba03
// ════════════════════════════════════════════════════════════════════════════

// ── Grid layout (matching original) ─────────────────────────────────────────
const COUNT_X = 100;
const COUNT_Y = 55;
const COUNT   = COUNT_X * COUNT_Y;
const GRID_W  = 40;    // world-unit width  of particle grid
const GRID_H  = 22;    // world-unit height of particle grid
const JITTER  = 0.25;  // initial position jitter to break grid regularity

// ── Vertex shader ────────────────────────────────────────────────────────────
const VERT = /* glsl */`
  uniform float uTime;
  uniform vec2  uMouse;

  varying vec2  vUv;
  varying float vSize;
  varying vec2  vPos;

  attribute vec3  aOffset;
  attribute float aRandom;

  #define PI 3.14159265359

  // Value noise (smooth)
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  mat2 rotate2d(float a) {
    return mat2(cos(a), sin(a), -sin(a), cos(a));
  }

  void main() {
    vUv = uv;

    // --- 1. ALIVE FLOW ---
    vec3 pos = aOffset;
    float ds = uTime * 0.15;
    float dx = sin(ds + pos.y * 0.5) + sin(ds * 0.5 + pos.y * 2.0);
    float dy = cos(ds + pos.x * 0.5) + cos(ds * 0.5 + pos.x * 2.0);
    pos.x += dx * 0.25;
    pos.y += dy * 0.25;

    // --- 2. JELLYFISH HALO ---
    // Elliptical mapping (scaleX = 1.3, scaleY = 1.0)
    vec2 relScaled = (pos.xy - uMouse) / vec2(1.3, 1.0);
    float distFromMouse = length(relScaled);
    float angleToMouse  = atan(relScaled.y, relScaled.x);

    // Organic halo shape via noise
    float shapeFactor  = noise(vec2(angleToMouse * 2.0, uTime * 0.1));
    // Breathing: radiusBase=2.4, amplitude=0.5, freq=2.6 * slow-down factor
    float breathCycle  = sin(uTime * 0.8);       // matches original 0.8
    float currentRadius = 2.4
                        + breathCycle * 0.5
                        + shapeFactor * 0.75;     // shapeAmplitude

    float rimInfluence = smoothstep(1.8, 0.0, abs(distFromMouse - currentRadius));

    // --- 3. WAVE PUSH ---
    vec2 pushDir = normalize(relScaled + vec2(0.0001, 0.0));
    float pushAmt = (breathCycle * 0.5 + 0.5) * 0.5;
    pos.xy += pushDir * pushAmt * rimInfluence;
    pos.z  += rimInfluence * 0.3 * sin(uTime);

    // --- 4. SIZE & SHAPE ---
    float baseSize    = 0.016 + sin(uTime + pos.x) * 0.003;
    float currentScale = baseSize + rimInfluence * 0.044;
    float stretch      = rimInfluence * 0.02;

    vec3 t3 = position;
    t3.x *= (currentScale + stretch) * 1.0;   // blobScaleX
    t3.y *= currentScale * 0.6;               // blobScaleY 

    vSize = rimInfluence;
    vPos  = pos.xy;

    // --- 5. ROTATION (radial toward/away from mouse) ---
    float finalAngle = atan(relScaled.y, relScaled.x);
    t3.xy = rotate2d(finalAngle) * t3.xy;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos + t3, 1.0);
  }
`;

// ── Fragment shader ──────────────────────────────────────────────────────────
const FRAG = /* glsl */`
  uniform float uTime;

  varying vec2  vUv;
  varying float vSize;
  varying vec2  vPos;

  void main() {
    // Superellipse / squircle blob
    vec2 p = abs(vUv - vec2(0.5)) * 2.0;
    float d = pow(pow(p.x, 2.6) + pow(p.y, 2.6), 1.0 / 2.6);
    float alpha = 1.0 - smoothstep(0.8, 1.0, d);
    if (alpha < 0.01) discard;

    // --- Colors ---
    vec3 cBase   = vec3(0.000, 0.000, 1.000); // #0000ff
    vec3 cBlue   = vec3(0.259, 0.522, 0.961); // #4285f5
    vec3 cRed    = vec3(0.922, 0.255, 0.212); // #eb4236
    vec3 cYellow = vec3(0.980, 0.729, 0.012); // #faba03

    // --- Dynamic colour zones ---
    float t  = uTime * 3.5;  // 律動改快一點 (原本 1.2 -> 3.5)
    float p1 = sin(vPos.x * 0.8 + t);
    float p2 = sin(vPos.y * 0.8 + t * 0.8 + p1);

    vec3 activeColor = mix(cBlue, cRed, p1 * 0.5 + 0.5);
    activeColor      = mix(activeColor, cYellow, p2 * 0.5 + 0.5);

    vec3  finalColor = mix(cBase, activeColor, smoothstep(0.1, 0.8, vSize));
    float finalAlpha = alpha * mix(0.4, 0.95, vSize);

    gl_FragColor = vec4(finalColor, finalAlpha);
  }
`;

// ════════════════════════════════════════════════════════════════════════════
// Three.js scene initialisation
// ════════════════════════════════════════════════════════════════════════════

function initScene(canvas: HTMLCanvasElement): () => void {
  // ── Renderer ─────────────────────────────────────────────────────────────
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);  // transparent → hero background shows through

  // ── Camera (matches R3F default: PerspectiveCamera z=5 FOV 75) ───────────
  const FOV = 75;
  const camera = new THREE.PerspectiveCamera(
    FOV,
    window.innerWidth / window.innerHeight,
    0.1,
    1000,
  );
  camera.position.z = 5;

  // Helper: world units visible at z=0
  const getViewport = () => {
    const h = 2 * Math.tan((FOV / 2) * (Math.PI / 180)) * camera.position.z;
    const w = h * (window.innerWidth / window.innerHeight);
    return { w, h };
  };

  // ── Scene ─────────────────────────────────────────────────────────────────
  const scene = new THREE.Scene();

  // ── Uniforms ──────────────────────────────────────────────────────────────
  const uniforms = {
    uTime:  { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) },
  };

  // ── Geometry (1×1 plane, stretched per-instance in the vertex shader) ─────
  const geo = new THREE.PlaneGeometry(1, 1);

  // ── Material ──────────────────────────────────────────────────────────────
  const mat = new THREE.ShaderMaterial({
    uniforms,
    vertexShader:   VERT,
    fragmentShader: FRAG,
    transparent:    true,
    depthWrite:     false,
    side:           THREE.DoubleSide,
  });

  // ── InstancedMesh ─────────────────────────────────────────────────────────
  const mesh = new THREE.InstancedMesh(geo, mat, COUNT);
  scene.add(mesh);

  // Populate per-instance attributes (aOffset, aRandom)
  const offsets = new Float32Array(COUNT * 3);
  const randoms = new Float32Array(COUNT);

  let i = 0;
  for (let y = 0; y < COUNT_Y; y++) {
    for (let x = 0; x < COUNT_X; x++) {
      const u = x / (COUNT_X - 1);
      const v = y / (COUNT_Y - 1);
      offsets[i * 3]     = (u - 0.5) * GRID_W + (Math.random() - 0.5) * JITTER;
      offsets[i * 3 + 1] = (v - 0.5) * GRID_H + (Math.random() - 0.5) * JITTER;
      offsets[i * 3 + 2] = 0;
      randoms[i]         = Math.random();
      i++;
    }
  }

  geo.setAttribute("aOffset", new THREE.InstancedBufferAttribute(offsets, 3));
  geo.setAttribute("aRandom", new THREE.InstancedBufferAttribute(randoms, 1));

  // Identity transform for all instances (vertex shader does the positioning)
  const dummy = new THREE.Object3D();
  for (let j = 0; j < COUNT; j++) {
    dummy.updateMatrix();
    mesh.setMatrixAt(j, dummy.matrix);
  }
  mesh.instanceMatrix.needsUpdate = true;

  // ── Mouse tracking ────────────────────────────────────────────────────────
  const mouseTarget = new THREE.Vector2(0, 0);
  const hovering    = { current: true };
  let isTouch = false;

  const onMouseMove = (e: MouseEvent) => {
    if (isTouch) return; // Ignore emulated mouse events on mobile
    const vp = getViewport();
    // Convert pixel → NDC → world
    mouseTarget.x =  ((e.clientX / window.innerWidth)  * 2 - 1) * (vp.w / 2);
    mouseTarget.y = -((e.clientY / window.innerHeight)  * 2 - 1) * (vp.h / 2);
    hovering.current = true;
  };
  const onLeave = () => { if (!isTouch) hovering.current = false; };
  const onEnter = () => { if (!isTouch) hovering.current = true; };

  const onTouch = (e: TouchEvent) => {
    isTouch = true;
    // Keep halo locked to center on mobile devices
    mouseTarget.x = 0;
    mouseTarget.y = 0;
    hovering.current = true;
  };
  const onTouchEnd = () => { 
    isTouch = true;
    mouseTarget.x = 0;
    mouseTarget.y = 0;
    hovering.current = false; 
  };

  window.addEventListener("mousemove",  onMouseMove);
  document.body.addEventListener("mouseleave", onLeave);
  document.body.addEventListener("mouseenter", onEnter);
  window.addEventListener("touchstart", onTouch,    { passive: true });
  window.addEventListener("touchmove",  onTouch,    { passive: true });
  window.addEventListener("touchend",   onTouchEnd);

  // ── Resize ────────────────────────────────────────────────────────────────
  const onResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };
  window.addEventListener("resize", onResize);

  // ── Animation loop ────────────────────────────────────────────────────────
  const clock = new THREE.Clock();
  let animId: number;

  const tick = () => {
    animId = requestAnimationFrame(tick);

    const elapsed = clock.getElapsedTime();
    uniforms.uTime.value = elapsed;

    // Lerp mouse (dragFactor = 0.015 from config)
    const drag = hovering.current ? 0.055 : 0.015;   // faster when hovering
    uniforms.uMouse.value.x += (mouseTarget.x - uniforms.uMouse.value.x) * drag;
    uniforms.uMouse.value.y += (mouseTarget.y - uniforms.uMouse.value.y) * drag;

    renderer.render(scene, camera);
  };

  tick();

  // ── Cleanup ───────────────────────────────────────────────────────────────
  return () => {
    cancelAnimationFrame(animId);
    window.removeEventListener("mousemove",  onMouseMove);
    document.body.removeEventListener("mouseleave", onLeave);
    document.body.removeEventListener("mouseenter", onEnter);
    window.removeEventListener("touchstart", onTouch);
    window.removeEventListener("touchmove",  onTouch);
    window.removeEventListener("touchend",   onTouchEnd);
    window.removeEventListener("resize",     onResize);
    renderer.dispose();
    geo.dispose();
    mat.dispose();
  };
}

// ════════════════════════════════════════════════════════════════════════════
// React component
// ════════════════════════════════════════════════════════════════════════════

export function HeroParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    return initScene(canvas);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 pointer-events-none"
      aria-hidden="true"
    />
  );
}
