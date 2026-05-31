import { useRef, useState, useEffect, useCallback } from "react";
import { Icon } from "./Icon";
import { Button, PoolBar, StepHeading } from "./ui";
import type { EntropyPool } from "../lib/crypto";

const HUMAN_TARGET = 480;

interface Particle {
  x: number; y: number; r: number; life: number; vx: number; vy: number;
}

interface HumanEntropyProps {
  pool: EntropyPool;
  onDone: (advance?: true) => void;
  done: boolean;
  bump: () => void;
  accent: string;
}

export function HumanEntropy({ pool, onDone, done, bump, accent }: HumanEntropyProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const partsRef = useRef<Particle[]>([]);
  const lastRef = useRef<{ x: number; y: number } | null>(null);
  const [progress, setProgress] = useState(0);
  const progRef = useRef(0);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let raf: number, w = 0, h = 0;

    function resize() {
      const r = wrapRef.current!.getBoundingClientRect();
      w = r.width; h = r.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      canvas.style.width = w + "px"; canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrapRef.current!);

    function loop() {
      ctx.clearRect(0, 0, w, h);
      const parts = partsRef.current;
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i];
        p.life -= 0.018;
        p.x += p.vx; p.y += p.vy; p.vx *= 0.96; p.vy *= 0.96;
        if (p.life <= 0) { parts.splice(i, 1); continue; }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * p.life, 0, Math.PI * 2);
        ctx.fillStyle = `oklch(0.6 0.2 ${accent} / ${p.life * 0.7})`;
        ctx.fill();
      }
      if (lastRef.current && parts.length > 1) {
        ctx.strokeStyle = `oklch(0.6 0.2 ${accent} / 0.25)`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let i = Math.max(0, parts.length - 14); i < parts.length; i++) {
          const p = parts[i];
          if (i === Math.max(0, parts.length - 14)) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        }
        ctx.stroke();
      }
      raf = requestAnimationFrame(loop);
    }
    loop();
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [accent]);

  const sample = useCallback((clientX: number, clientY: number, ev: React.MouseEvent | React.TouchEvent) => {
    const r = wrapRef.current!.getBoundingClientRect();
    const x = clientX - r.left, y = clientY - r.top;
    const last = lastRef.current;
    let dist = 0;
    if (last) dist = Math.hypot(x - last.x, y - last.y);
    lastRef.current = { x, y };
    if (dist < 2 && last) return;
    pool.addNumber(x); pool.addNumber(y);
    pool.addNumber(ev.nativeEvent.timeStamp || performance.now());
    pool.addNumber(dist);
    bump();
    partsRef.current.push({
      x, y, r: 3.2 + Math.random() * 3, life: 1,
      vx: (Math.random() - 0.5) * 1.2, vy: (Math.random() - 0.5) * 1.2,
    });
    if (partsRef.current.length > 220) partsRef.current.splice(0, 40);
    if (progRef.current < HUMAN_TARGET) {
      progRef.current += 1;
      const pct = Math.min(1, progRef.current / HUMAN_TARGET);
      setProgress(pct);
      if (pct >= 1) onDone();
    }
  }, [pool, bump, onDone]);

  const pct = Math.round(progress * 100);
  const full = progress >= 1;

  return (
    <div>
      <StepHeading
        title="Añade tu propio azar"
        sub="Mueve el cursor dentro del recuadro de forma errática. Cada micro-movimiento, su velocidad y su tiempo exacto son impredecibles incluso para ti — los mezclamos con la entropía del sistema."
      />

      <div
        ref={wrapRef}
        onMouseEnter={() => setActive(true)}
        onMouseLeave={() => { setActive(false); lastRef.current = null; }}
        onMouseMove={(e) => sample(e.clientX, e.clientY, e)}
        onTouchMove={(e) => { const t = e.touches[0]; if (t) sample(t.clientX, t.clientY, e); }}
        style={{
          position: "relative", height: 268, marginTop: 18, borderRadius: 14, overflow: "hidden",
          cursor: full ? "default" : "crosshair",
          border: `1.5px ${full ? "solid var(--good)" : active ? "solid var(--accent)" : "dashed var(--border)"}`,
          background: "radial-gradient(120% 120% at 50% 0%, var(--surface-2), var(--surface))",
          transition: "border-color .3s",
        }}
      >
        <canvas ref={canvasRef} style={{ position: "absolute", inset: 0 }} />
        <div style={{
          position: "absolute", inset: 0, display: "grid", placeItems: "center",
          pointerEvents: "none", textAlign: "center", padding: 24,
          opacity: progress > 0.04 ? 0 : 1, transition: "opacity .4s",
        }}>
          <div>
            <div style={{
              width: 52, height: 52, borderRadius: "50%", display: "grid", placeItems: "center",
              border: "1px solid var(--border)", margin: "0 auto 10px",
              animation: "pulseRing 2s infinite", color: "var(--text-3)",
            }}>
              <Icon name="cursor" size={22} />
            </div>
            <div style={{ fontWeight: 600, color: "var(--text-2)" }}>Mueve el mouse aquí dentro</div>
            <div style={{ fontSize: 12.5, color: "var(--text-3)", marginTop: 3 }}>cuanto más errático, mejor</div>
          </div>
        </div>
        {full && (
          <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", pointerEvents: "none", animation: "fadeUp .4s both" }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 9, padding: "9px 16px", borderRadius: 999,
              background: "var(--good-soft)", color: "var(--good)", fontWeight: 700, fontSize: 14,
              border: "1px solid var(--good)",
            }}>
              <Icon name="check" size={17} /> Entropía suficiente
            </div>
          </div>
        )}
      </div>

      <div style={{ marginTop: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 7 }}>
          <span style={{ fontSize: 12.5, fontWeight: 600, color: "var(--text-2)" }}>Recolección de entropía humana</span>
          <span className="mono" style={{ fontSize: 13, fontWeight: 700, color: full ? "var(--good)" : "var(--accent)" }}>{pct}%</span>
        </div>
        <div style={{ height: 9, borderRadius: 999, background: "var(--surface-2)", border: "1px solid var(--border)", overflow: "hidden" }}>
          <div style={{
            height: "100%", width: `${pct}%`, borderRadius: 999,
            background: full ? "var(--good)" : "linear-gradient(90deg, var(--accent), var(--accent-2))",
            transition: "width .15s linear, background .3s",
          }} />
        </div>
      </div>

      <PoolBar byteCount={pool.byteCount} fingerprint={pool.fingerprint()} />

      <div style={{ marginTop: 20, display: "flex", justifyContent: "flex-end" }}>
        <Button onClick={() => onDone(true)} disabled={!full}>
          {full ? <><span>Generar llave</span> <Icon name="arrow" size={16} /></> : `Sigue moviendo… ${pct}%`}
        </Button>
      </div>
    </div>
  );
}
