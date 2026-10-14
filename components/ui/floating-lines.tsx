"use client"

import { useEffect, useRef } from 'react';

// Raw WebGL2 rather than three.js. All this draws is one full-screen quad with
// a fragment shader — three.js was ~500 KB of JS (the heaviest bundle on the
// site) to set up a scene, camera and mesh the shader never uses, and parsing
// it was the largest main-thread task on the homepage. WebGL2 because the
// line loops below take uniform bounds, which GLSL ES 1.00 forbids.

// Two triangles covering clip space — the whole canvas.
const QUAD = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]);

const vertexShader = `#version 300 es
in vec2 position;

void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragmentShader = `#version 300 es
precision highp float;

out vec4 outColor;

uniform float iTime;
uniform vec3  iResolution;
uniform float animationSpeed;

uniform bool enableTop;
uniform bool enableMiddle;
uniform bool enableBottom;

uniform int topLineCount;
uniform int middleLineCount;
uniform int bottomLineCount;

uniform float topLineDistance;
uniform float middleLineDistance;
uniform float bottomLineDistance;

uniform vec3 topWavePosition;
uniform vec3 middleWavePosition;
uniform vec3 bottomWavePosition;

uniform vec2 iMouse;
uniform bool interactive;
uniform float bendRadius;
uniform float bendStrength;
uniform float bendInfluence;

uniform bool parallax;
uniform float parallaxStrength;
uniform vec2 parallaxOffset;

uniform vec3 lineGradient[8];
uniform int lineGradientCount;

const vec3 BLACK = vec3(0.0);
const vec3 PINK  = vec3(233.0, 71.0, 245.0) / 255.0;
const vec3 BLUE  = vec3(47.0,  75.0, 162.0) / 255.0;

mat2 rotate(float r) {
  return mat2(cos(r), sin(r), -sin(r), cos(r));
}

vec3 background_color(vec2 uv) {
  vec3 col = vec3(0.0);

  float y = sin(uv.x - 0.2) * 0.3 - 0.1;
  float m = uv.y - y;

  col += mix(BLUE, BLACK, smoothstep(0.0, 1.0, abs(m)));
  col += mix(PINK, BLACK, smoothstep(0.0, 1.0, abs(m - 0.8)));
  return col * 0.5;
}

vec3 getLineColor(float t, vec3 baseColor) {
  if (lineGradientCount <= 0) {
    return baseColor;
  }

  vec3 gradientColor;

  if (lineGradientCount == 1) {
    gradientColor = lineGradient[0];
  } else {
    float clampedT = clamp(t, 0.0, 0.9999);
    float scaled = clampedT * float(lineGradientCount - 1);
    int idx = int(floor(scaled));
    float f = fract(scaled);
    int idx2 = min(idx + 1, lineGradientCount - 1);

    vec3 c1 = lineGradient[idx];
    vec3 c2 = lineGradient[idx2];

    gradientColor = mix(c1, c2, f);
  }

  return gradientColor * 0.5;
}

  float wave(vec2 uv, float offset, vec2 screenUv, vec2 mouseUv, bool shouldBend) {
  float time = iTime * animationSpeed;

  float x_offset   = offset;
  float x_movement = time * 0.1;
  float amp        = sin(offset + time * 0.2) * 0.3;
  float y          = sin(uv.x + x_offset + x_movement) * amp;

  if (shouldBend) {
    vec2 d = screenUv - mouseUv;
    float influence = exp(-dot(d, d) * bendRadius); // radial falloff around cursor
    float bendOffset = (mouseUv.y - screenUv.y) * influence * bendStrength * bendInfluence;
    y += bendOffset;
  }

  float m = uv.y - y;
  return 0.0175 / max(abs(m) + 0.01, 1e-3) + 0.01;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  vec2 baseUv = (2.0 * fragCoord - iResolution.xy) / iResolution.y;
  baseUv.y *= -1.0;

  if (parallax) {
    baseUv += parallaxOffset;
  }

  vec3 col = vec3(0.0);

  vec3 b = lineGradientCount > 0 ? vec3(0.0) : background_color(baseUv);

  vec2 mouseUv = vec2(0.0);
  if (interactive) {
    mouseUv = (2.0 * iMouse - iResolution.xy) / iResolution.y;
    mouseUv.y *= -1.0;
  }

  if (enableBottom) {
    for (int i = 0; i < bottomLineCount; ++i) {
      float fi = float(i);
      float t = fi / max(float(bottomLineCount - 1), 1.0);
      vec3 lineCol = getLineColor(t, b);

      float angle = bottomWavePosition.z * log(length(baseUv) + 1.0);
      vec2 ruv = baseUv * rotate(angle);
      col += lineCol * wave(
        ruv + vec2(bottomLineDistance * fi + bottomWavePosition.x, bottomWavePosition.y),
        1.5 + 0.2 * fi,
        baseUv,
        mouseUv,
        interactive
      ) * 0.2;
    }
  }

  if (enableMiddle) {
    for (int i = 0; i < middleLineCount; ++i) {
      float fi = float(i);
      float t = fi / max(float(middleLineCount - 1), 1.0);
      vec3 lineCol = getLineColor(t, b);

      float angle = middleWavePosition.z * log(length(baseUv) + 1.0);
      vec2 ruv = baseUv * rotate(angle);
      col += lineCol * wave(
        ruv + vec2(middleLineDistance * fi + middleWavePosition.x, middleWavePosition.y),
        2.0 + 0.15 * fi,
        baseUv,
        mouseUv,
        interactive
      );
    }
  }

  if (enableTop) {
    for (int i = 0; i < topLineCount; ++i) {
      float fi = float(i);
      float t = fi / max(float(topLineCount - 1), 1.0);
      vec3 lineCol = getLineColor(t, b);

      float angle = topWavePosition.z * log(length(baseUv) + 1.0);
      vec2 ruv = baseUv * rotate(angle);
      ruv.x *= -1.0;
      col += lineCol * wave(
        ruv + vec2(topLineDistance * fi + topWavePosition.x, topWavePosition.y),
        1.0 + 0.2 * fi,
        baseUv,
        mouseUv,
        interactive
      ) * 0.1;
    }
  }

  fragColor = vec4(col, 1.0);
}

void main() {
  vec4 color = vec4(0.0);
  mainImage(color, gl_FragCoord.xy);
  outColor = color;
}
`;

const MAX_GRADIENT_STOPS = 8;

type WavePosition = {
  x: number;
  y: number;
  rotate: number;
};

type FloatingLinesProps = {
  linesGradient?: string[];
  enabledWaves?: Array<'top' | 'middle' | 'bottom'>;
  lineCount?: number | number[];
  lineDistance?: number | number[];
  topWavePosition?: WavePosition;
  middleWavePosition?: WavePosition;
  bottomWavePosition?: WavePosition;
  animationSpeed?: number;
  interactive?: boolean;
  bendRadius?: number;
  bendStrength?: number;
  mouseDamping?: number;
  parallax?: boolean;
  parallaxStrength?: number;
  mixBlendMode?: React.CSSProperties['mixBlendMode'];
};

function hexToRgb(hex: string): [number, number, number] {
  let value = hex.trim();

  if (value.startsWith('#')) {
    value = value.slice(1);
  }

  let r = 255;
  let g = 255;
  let b = 255;

  if (value.length === 3) {
    r = parseInt(value[0] + value[0], 16);
    g = parseInt(value[1] + value[1], 16);
    b = parseInt(value[2] + value[2], 16);
  } else if (value.length === 6) {
    r = parseInt(value.slice(0, 2), 16);
    g = parseInt(value.slice(2, 4), 16);
    b = parseInt(value.slice(4, 6), 16);
  }

  return [r / 255, g / 255, b / 255];
}

// Deliberately doesn't read COMPILE_STATUS: any status query makes the main
// thread wait for the GPU process to finish compiling. Errors are reported
// once linking is known to be done (see init).
function compile(gl: WebGL2RenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return shader;
}

export default function FloatingLines({
  linesGradient,
  enabledWaves = ['top', 'middle', 'bottom'],
  lineCount = [6],
  lineDistance = [5],
  topWavePosition,
  middleWavePosition,
  bottomWavePosition = { x: 2.0, y: -0.7, rotate: -1 },
  animationSpeed = 1,
  interactive = true,
  bendRadius = 5.0,
  bendStrength = -0.5,
  mouseDamping = 0.05,
  parallax = true,
  parallaxStrength = 0.2,
  mixBlendMode = 'screen'
}: FloatingLinesProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const getLineCount = (waveType: 'top' | 'middle' | 'bottom'): number => {
    if (typeof lineCount === 'number') return lineCount;
    if (!enabledWaves.includes(waveType)) return 0;
    const index = enabledWaves.indexOf(waveType);
    return lineCount[index] ?? 6;
  };

  const getLineDistance = (waveType: 'top' | 'middle' | 'bottom'): number => {
    if (typeof lineDistance === 'number') return lineDistance;
    if (!enabledWaves.includes(waveType)) return 0.1;
    const index = enabledWaves.indexOf(waveType);
    return lineDistance[index] ?? 0.1;
  };

  const topLineCount = enabledWaves.includes('top') ? getLineCount('top') : 0;
  const middleLineCount = enabledWaves.includes('middle') ? getLineCount('middle') : 0;
  const bottomLineCount = enabledWaves.includes('bottom') ? getLineCount('bottom') : 0;

  const topLineDistance = enabledWaves.includes('top') ? getLineDistance('top') * 0.01 : 0.01;
  const middleLineDistance = enabledWaves.includes('middle') ? getLineDistance('middle') * 0.01 : 0.01;
  const bottomLineDistance = enabledWaves.includes('bottom') ? getLineDistance('bottom') * 0.01 : 0.01;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const canvas = document.createElement('canvas');
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';

    // No antialias: a full-screen quad has no geometry edges to smooth, and
    // the multisample buffer would only cost GPU memory.
    const gl = canvas.getContext('webgl2', { antialias: false, alpha: false, powerPreference: 'low-power' });
    // No WebGL2 (very old browsers, some locked-down GPUs): the backdrop is
    // decoration, so render nothing rather than a broken canvas.
    if (!gl) return;
    container.appendChild(canvas);

    let active = true;
    let program: WebGLProgram | null = null;
    let buffer: WebGLBuffer | null = null;
    let loc: Record<string, WebGLUniformLocation | null> = {};

    const gradient = new Float32Array(MAX_GRADIENT_STOPS * 3).fill(1);
    const stops = (linesGradient ?? []).slice(0, MAX_GRADIENT_STOPS);
    stops.forEach((hex, i) => gradient.set(hexToRgb(hex), i * 3));

    // KHR_parallel_shader_compile lets the shader compile on a background
    // thread while we poll for completion. Without it, the first status query
    // blocked the main thread for ~200ms on a mid-range phone — the single
    // largest task on the homepage. Browsers without the extension fall back
    // to the blocking path.
    const parallel = gl.getExtension('KHR_parallel_shader_compile');
    let pollTimer = 0;

    // Builds the program and, once the GPU has finished compiling it, sets
    // every uniform that doesn't change per frame and starts the loop. Runs
    // again after a context restore, since a lost context drops all GPU
    // objects.
    const init = () => {
      const vs = compile(gl, gl.VERTEX_SHADER, vertexShader);
      const fs = compile(gl, gl.FRAGMENT_SHADER, fragmentShader);
      const p = gl.createProgram();
      if (!vs || !fs || !p) return;
      gl.attachShader(p, vs);
      gl.attachShader(p, fs);
      gl.linkProgram(p);

      const whenLinked = () => {
        pollTimer = 0;
        if (!active || contextLost) return;
        if (parallel && !gl.getProgramParameter(p, parallel.COMPLETION_STATUS_KHR)) {
          pollTimer = window.setTimeout(whenLinked, 50);
          return;
        }
        if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
          if (!gl.isContextLost()) {
            console.error(
              'FloatingLines shader:',
              gl.getShaderInfoLog(vs) || gl.getShaderInfoLog(fs) || gl.getProgramInfoLog(p)
            );
          }
          return;
        }
        gl.deleteShader(vs);
        gl.deleteShader(fs);
        setUp(p);
        setSize();
        sync();
      };
      whenLinked();
    };

    const setUp = (p: WebGLProgram) => {
      program = p;
      gl.useProgram(p);

      buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, QUAD, gl.STATIC_DRAW);
      const position = gl.getAttribLocation(p, 'position');
      gl.enableVertexAttribArray(position);
      gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

      const u = (name: string) => gl.getUniformLocation(p, name);
      loc = Object.fromEntries(
        ['iTime', 'iResolution', 'iMouse', 'bendInfluence', 'parallaxOffset'].map((name) => [name, u(name)])
      );

      gl.uniform1f(u('animationSpeed'), animationSpeed);
      gl.uniform1i(u('enableTop'), enabledWaves.includes('top') ? 1 : 0);
      gl.uniform1i(u('enableMiddle'), enabledWaves.includes('middle') ? 1 : 0);
      gl.uniform1i(u('enableBottom'), enabledWaves.includes('bottom') ? 1 : 0);
      gl.uniform1i(u('topLineCount'), topLineCount);
      gl.uniform1i(u('middleLineCount'), middleLineCount);
      gl.uniform1i(u('bottomLineCount'), bottomLineCount);
      gl.uniform1f(u('topLineDistance'), topLineDistance);
      gl.uniform1f(u('middleLineDistance'), middleLineDistance);
      gl.uniform1f(u('bottomLineDistance'), bottomLineDistance);
      gl.uniform3f(
        u('topWavePosition'),
        topWavePosition?.x ?? 10.0,
        topWavePosition?.y ?? 0.5,
        topWavePosition?.rotate ?? -0.4
      );
      gl.uniform3f(
        u('middleWavePosition'),
        middleWavePosition?.x ?? 5.0,
        middleWavePosition?.y ?? 0.0,
        middleWavePosition?.rotate ?? 0.2
      );
      gl.uniform3f(
        u('bottomWavePosition'),
        bottomWavePosition?.x ?? 2.0,
        bottomWavePosition?.y ?? -0.7,
        bottomWavePosition?.rotate ?? 0.4
      );
      gl.uniform1i(u('interactive'), interactive ? 1 : 0);
      gl.uniform1f(u('bendRadius'), bendRadius);
      gl.uniform1f(u('bendStrength'), bendStrength);
      gl.uniform1i(u('parallax'), parallax ? 1 : 0);
      gl.uniform1f(u('parallaxStrength'), parallaxStrength);
      gl.uniform3fv(u('lineGradient'), gradient);
      gl.uniform1i(u('lineGradientCount'), stops.length);
    };

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Sized here and on resize only — never inside the render loop, where
    // touching canvas.width reallocates the drawing buffer every frame.
    const setSize = () => {
      if (!active) return;
      const width = container.clientWidth || 1;
      const height = container.clientHeight || 1;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
      if (program) gl.uniform3f(loc.iResolution, canvas.width, canvas.height, 1);
    };

    // Mouse and parallax state, eased toward their targets each frame.
    const targetMouse = [-1000, -1000];
    const currentMouse = [-1000, -1000];
    let targetInfluence = 0;
    let currentInfluence = 0;
    const targetParallax = [0, 0];
    const currentParallax = [0, 0];

    const handlePointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      targetMouse[0] = x * dpr;
      targetMouse[1] = (rect.height - y) * dpr;
      targetInfluence = 1.0;

      if (parallax) {
        targetParallax[0] = ((x - rect.width / 2) / rect.width) * parallaxStrength;
        targetParallax[1] = (-(y - rect.height / 2) / rect.height) * parallaxStrength;
      }
    };

    const handlePointerLeave = () => {
      targetInfluence = 0.0;
    };

    let raf = 0;
    let contextLost = false;
    let onScreen = false;
    const start = performance.now();

    const renderLoop = () => {
      raf = 0;
      if (!active || contextLost || !program) return;

      gl.uniform1f(loc.iTime, (performance.now() - start) / 1000);

      if (interactive) {
        currentMouse[0] += (targetMouse[0] - currentMouse[0]) * mouseDamping;
        currentMouse[1] += (targetMouse[1] - currentMouse[1]) * mouseDamping;
        gl.uniform2f(loc.iMouse, currentMouse[0], currentMouse[1]);

        currentInfluence += (targetInfluence - currentInfluence) * mouseDamping;
        gl.uniform1f(loc.bendInfluence, currentInfluence);
      }

      if (parallax) {
        currentParallax[0] += (targetParallax[0] - currentParallax[0]) * mouseDamping;
        currentParallax[1] += (targetParallax[1] - currentParallax[1]) * mouseDamping;
        gl.uniform2f(loc.parallaxOffset, currentParallax[0], currentParallax[1]);
      }

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      raf = requestAnimationFrame(renderLoop);
    };

    // Only animate while the hero is on screen and the tab is visible — the
    // shader is the most expensive thing on the page per frame, and nobody
    // sees it once they've scrolled past.
    const sync = () => {
      const shouldRun = active && !contextLost && onScreen && !document.hidden;
      if (shouldRun && !raf) raf = requestAnimationFrame(renderLoop);
      if (!shouldRun && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };

    const handleContextLost = (event: Event) => {
      // preventDefault() is what allows the browser to restore the context.
      event.preventDefault();
      contextLost = true;
      program = null;
      sync();
    };

    const handleContextRestored = () => {
      contextLost = false;
      if (active) init();
    };

    setSize();
    init();

    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(setSize) : null;
    ro?.observe(container);

    const io = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      sync();
    });
    io.observe(container);

    if (interactive) {
      canvas.addEventListener('pointermove', handlePointerMove);
      canvas.addEventListener('pointerleave', handlePointerLeave);
    }
    canvas.addEventListener('webglcontextlost', handleContextLost, false);
    canvas.addEventListener('webglcontextrestored', handleContextRestored, false);
    document.addEventListener('visibilitychange', sync);

    return () => {
      active = false;
      if (raf) cancelAnimationFrame(raf);
      window.clearTimeout(pollTimer);

      ro?.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', sync);
      canvas.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('pointerleave', handlePointerLeave);
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      canvas.removeEventListener('webglcontextrestored', handleContextRestored);

      if (buffer) gl.deleteBuffer(buffer);
      if (program) gl.deleteProgram(program);
      // Free the context now instead of waiting for GC — browsers cap the
      // number of live WebGL contexts, and theme switches remount this.
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      canvas.remove();
    };
  }, [
    linesGradient,
    enabledWaves,
    lineCount,
    lineDistance,
    topWavePosition,
    middleWavePosition,
    bottomWavePosition,
    animationSpeed,
    interactive,
    bendRadius,
    bendStrength,
    mouseDamping,
    parallax,
    parallaxStrength,
    topLineCount,
    middleLineCount,
    bottomLineCount,
    topLineDistance,
    middleLineDistance,
    bottomLineDistance
  ]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden floating-lines-container"
      style={{
        mixBlendMode: mixBlendMode
      }}
    />
  );
}
