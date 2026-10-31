import { useEffect, useRef } from 'react'

const VERT = `#version 300 es
in vec2 p;
void main() { gl_Position = vec4(p, 0.0, 1.0); }`

// Domain-warped fbm drawn as drifting contour lines on paper. Colors mirror the @theme tokens in styles.css.
const FRAG = `#version 300 es
precision highp float;
uniform vec2 res;
uniform float t;
out vec4 o;

const vec3 PAPER = vec3(0.969, 0.957, 0.933);
const vec3 RAISED = vec3(0.937, 0.914, 0.875);
const vec3 INK = vec3(0.122, 0.106, 0.086);
const vec3 RED = vec3(0.706, 0.137, 0.094);

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++) { v += a * noise(p); p = p * 2.03 + 17.0; a *= 0.5; }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / res.y;
  float s = t * 0.025;
  vec2 q = vec2(fbm(uv * 1.6 + s), fbm(uv * 1.6 - s + 5.2));
  float h = fbm(uv * 1.2 + 1.8 * q + vec2(s * 0.6, -s * 0.4));

  float bands = h * 14.0;
  float d = abs(fract(bands) - 0.5) / fwidth(bands);
  float line = 1.0 - clamp(d - 0.5, 0.0, 1.0);
  bool red = floor(bands) == 7.0; // one contour level drawn in redline red

  vec3 col = mix(PAPER, RAISED, smoothstep(0.35, 0.75, h));
  col = mix(col, red ? RED : INK, line * (red ? 0.2 : 0.1));
  o = vec4(col, 1.0);
}`

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!
  gl.shaderSource(s, src)
  gl.compileShader(s)
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? 'shader compile failed')
  return s
}

export function ShaderBackground({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    let gl: WebGL2RenderingContext | null = null
    try {
      gl = canvas?.getContext('webgl2', { antialias: false, alpha: false }) ?? null
    } catch {
      // jsdom / no GPU: the section's paper background shows through
    }
    if (!canvas || !gl) return

    let prog: WebGLProgram
    try {
      prog = gl.createProgram()!
      gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT))
      gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG))
      gl.linkProgram(prog)
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog) ?? 'link failed')
    } catch (e) {
      console.warn('[ShaderBackground]', e)
      return
    }
    gl.useProgram(prog)

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW) // one oversized triangle
    const loc = gl.getAttribLocation(prog, 'p')
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)
    const uRes = gl.getUniformLocation(prog, 'res')
    const uT = gl.getUniformLocation(prog, 't')

    const still = window.matchMedia('(prefers-reduced-motion: reduce)')
    const start = performance.now()
    let raf = 0
    let visible = true

    const draw = () => {
      gl.uniform2f(uRes, canvas.width, canvas.height)
      gl.uniform1f(uT, still.matches ? 40 : (performance.now() - start) / 1000)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    }
    const loop = () => {
      draw()
      raf = visible && !still.matches ? requestAnimationFrame(loop) : 0
    }
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(loop)
    }

    const ro = new ResizeObserver(() => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5) // full retina res buys nothing on soft lines
      canvas.width = Math.round(canvas.clientWidth * dpr)
      canvas.height = Math.round(canvas.clientHeight * dpr)
      gl.viewport(0, 0, canvas.width, canvas.height)
      kick()
    })
    ro.observe(canvas)

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      if (visible) kick()
    })
    io.observe(canvas)
    still.addEventListener('change', kick)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      still.removeEventListener('change', kick)
    }
  }, [])

  return <canvas ref={ref} aria-hidden="true" className={`pointer-events-none ${className}`} />
}
