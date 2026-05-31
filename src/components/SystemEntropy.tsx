import { useState, useRef, useCallback, useEffect } from "react";
import { Icon } from "./Icon";
import { Button, IconBtn, Spinner, PoolBar, StepHeading, truncate } from "./ui";
import { localSources, bytesFromDrawable, type EntropyPool } from "../lib/crypto";

interface RowState {
  id: string;
  label: string;
  hint: string;
  icon: "bolt" | "image" | "camera";
  kind: "default" | "image" | "camera";
  collect?: () => { bytes: Uint8Array; detail: string };
  status: "idle" | "busy" | "done";
  detail: string;
  bytes: Uint8Array | null;
  thumb: string | null;
}

function hexDump(bytes: Uint8Array, max = 256): string {
  const n = Math.min(bytes.length, max);
  let out = "";
  for (let i = 0; i < n; i += 16) {
    const off = i.toString(16).padStart(6, "0");
    let hex = "", asc = "";
    for (let j = 0; j < 16; j++) {
      if (i + j < n) {
        const b = bytes[i + j];
        hex += b.toString(16).padStart(2, "0") + " ";
        asc += b >= 32 && b < 127 ? String.fromCharCode(b) : "·";
      } else hex += "   ";
    }
    out += `${off}  ${hex} ${asc}\n`;
  }
  if (bytes.length > max) out += `…  (+${bytes.length - max} bytes más)\n`;
  return out;
}

function InfoModal({ row, onClose }: { row: RowState | null; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  if (!row) return null;
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 50, display: "grid", placeItems: "center", padding: 22,
      background: "hsl(var(--shadow-c) / .45)", backdropFilter: "blur(3px)", animation: "fadeUp .2s both",
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)",
        boxShadow: "0 1px 2px hsl(var(--shadow-c)/.05), 0 18px 40px -24px hsl(var(--shadow-c)/.28)",
        width: "100%", maxWidth: 540, maxHeight: "82vh", overflow: "hidden",
        display: "flex", flexDirection: "column", animation: "pop .25s both",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 18px", borderBottom: "1px solid var(--border)" }}>
          <div style={{
            width: 34, height: 34, borderRadius: 9, display: "grid", placeItems: "center",
            flex: "none", background: "var(--accent-soft)", color: "var(--accent)",
          }}>
            <Icon name={row.icon} size={17} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="mono" style={{ fontWeight: 700, fontSize: 14.5 }}>{row.label}</div>
            <div style={{ fontSize: 12, color: "var(--text-3)" }}>{row.bytes ? row.bytes.length : 0} bytes aportados al pool</div>
          </div>
          <IconBtn name="x" onClick={onClose} title="Cerrar" />
        </div>
        <div style={{ padding: "16px 18px", overflow: "auto" }}>
          {row.thumb && (
            <img src={row.thumb} alt="" style={{
              width: 96, height: "auto", borderRadius: 8, border: "1px solid var(--border)",
              marginBottom: 14, imageRendering: "pixelated",
            }} />
          )}
          <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: ".07em", textTransform: "uppercase", color: "var(--text-3)" }}>
            Valor leído
          </div>
          <div className="mono" style={{ fontSize: 12.5, color: "var(--text-2)", marginTop: 6, marginBottom: 16, wordBreak: "break-all", lineHeight: 1.5 }}>
            {row.detail || "—"}
          </div>
          <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: ".07em", textTransform: "uppercase", color: "var(--text-3)" }}>
            Volcado hexadecimal
          </div>
          <pre className="mono" style={{
            margin: "8px 0 0", fontSize: 11.5, lineHeight: 1.5, color: "var(--text-2)", whiteSpace: "pre",
            overflow: "auto", padding: "12px 14px", borderRadius: 10, background: "var(--surface-2)",
            border: "1px solid var(--border)", maxHeight: 260,
          }}>
            {row.bytes ? hexDump(row.bytes) : "(sin datos)"}
          </pre>
        </div>
      </div>
    </div>
  );
}

function CameraPanel({ onCapture, onCancel }: { onCapture: (r: { bytes: Uint8Array; w: number; h: number; thumb: string }) => void; onCancel: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [err, setErr] = useState("");
  const [ready, setReady] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    let cancelled = false;
    navigator.mediaDevices?.getUserMedia({ video: { width: 320, height: 240 }, audio: false })
      .then((stream) => {
        if (cancelled) { stream.getTracks().forEach((t) => t.stop()); return; }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          setReady(true);
        }
      })
      .catch(() => setErr("No se pudo acceder a la cámara. Revisa los permisos del navegador."));
    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const stop = () => streamRef.current?.getTracks().forEach((t) => t.stop());
  const snap = () => {
    const v = videoRef.current;
    if (!v) return;
    const r = bytesFromDrawable(v, v.videoWidth || 320, v.videoHeight || 240);
    stop();
    onCapture(r);
  };

  return (
    <div style={{ marginTop: 8, padding: 14, borderRadius: 12, border: "1px solid var(--accent)", background: "var(--surface)" }}>
      {err ? (
        <div style={{ fontSize: 13, color: "var(--warn)", display: "flex", alignItems: "center", gap: 8 }}>
          <Icon name="camera" size={15} /> {err}
        </div>
      ) : (
        <div style={{ position: "relative", borderRadius: 9, overflow: "hidden", background: "#000", aspectRatio: "4/3" }}>
          <video ref={videoRef} muted playsInline style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transform: "scaleX(-1)" }} />
          {!ready && <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", color: "#fff" }}><Spinner /></div>}
        </div>
      )}
      <div style={{ display: "flex", gap: 9, marginTop: 11, justifyContent: "flex-end" }}>
        <Button size="sm" variant="ghost" onClick={() => { stop(); onCancel(); }}>Cancelar</Button>
        <Button size="sm" onClick={snap} disabled={!ready || !!err}>
          <Icon name="camera" size={15} /> Capturar fotograma
        </Button>
      </div>
    </div>
  );
}

interface SystemEntropyProps {
  pool: EntropyPool;
  onDone: (advance?: true) => void;
  done: boolean;
  bump: () => void;
}

export function SystemEntropy({ pool, onDone, done, bump }: SystemEntropyProps) {
  const [rows, setRows] = useState<RowState[]>(() =>
    localSources().map((s) => ({
      id: s.id, label: s.label, hint: s.hint, icon: "bolt" as const,
      kind: "default" as const, collect: s.collect,
      status: "idle" as const, detail: "", bytes: null, thumb: null,
    }))
  );
  const [running, setRunning] = useState(false);
  const [infoRow, setInfoRow] = useState<RowState | null>(null);
  const [camOpen, setCamOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const regenTargetRef = useRef<string | null>(null);

  const patch = useCallback((id: string, fields: Partial<RowState>) =>
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...fields } : r))), []);

  const run = useCallback(() => {
    if (running) return;
    setRunning(true);
    const defaults = rows.filter((r) => r.kind === "default" && r.status === "idle");
    if (!defaults.length) { setRunning(false); onDone(); return; }
    defaults.forEach((row, i) => {
      setTimeout(() => {
        patch(row.id, { status: "busy" });
        setTimeout(() => {
          const res = row.collect!();
          pool.add(res.bytes); bump();
          patch(row.id, { status: "done", detail: res.detail, bytes: res.bytes });
          if (i === defaults.length - 1) { setRunning(false); onDone(); }
        }, 230);
      }, i * 260);
    });
  }, [running, rows, pool, bump, onDone, patch]);

  const regen = useCallback((row: RowState) => {
    if (row.kind === "image") { regenTargetRef.current = "image"; fileRef.current?.click(); return; }
    if (row.kind === "camera") { setCamOpen(true); return; }
    patch(row.id, { status: "busy" });
    setTimeout(() => {
      const res = row.collect!();
      pool.add(res.bytes); bump();
      patch(row.id, { status: "done", detail: res.detail, bytes: res.bytes });
    }, 280);
  }, [pool, bump, patch]);

  const remove = useCallback((id: string) => setRows((rs) => rs.filter((r) => r.id !== id)), []);

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const img = new Image();
    img.onload = () => {
      const r = bytesFromDrawable(img, img.naturalWidth, img.naturalHeight);
      pool.add(r.bytes); bump();
      const detail = `${file.name} · ${r.w}×${r.h} px muestreados · ${r.bytes.length} bytes`;
      setRows((rs) => {
        const exists = rs.some((x) => x.id === "image");
        const newRow: RowState = {
          id: "image", label: "Imagen subida", hint: "Píxeles de tu imagen", icon: "image",
          kind: "image", status: "done", detail, bytes: r.bytes, thumb: r.thumb, collect: undefined,
        };
        return exists ? rs.map((x) => (x.id === "image" ? newRow : x)) : [...rs, newRow];
      });
      URL.revokeObjectURL(img.src);
    };
    img.src = URL.createObjectURL(file);
  };

  const onCameraCapture = (r: { bytes: Uint8Array; w: number; h: number; thumb: string }) => {
    setCamOpen(false);
    pool.add(r.bytes); bump();
    const detail = `Fotograma en vivo · ${r.w}×${r.h} px · ${r.bytes.length} bytes`;
    setRows((rs) => {
      const exists = rs.some((x) => x.id === "camera");
      const newRow: RowState = {
        id: "camera", label: "Cámara en vivo", hint: "Fotograma capturado", icon: "camera",
        kind: "camera", status: "done", detail, bytes: r.bytes, thumb: r.thumb, collect: undefined,
      };
      return exists ? rs.map((x) => (x.id === "camera" ? newRow : x)) : [...rs, newRow];
    });
  };

  const hasImage = rows.some((r) => r.id === "image");
  const hasCamera = rows.some((r) => r.id === "camera");

  return (
    <div>
      <StepHeading
        title="Recolecta aleatoriedad de tu dispositivo"
        sub="Leemos fuentes locales no predecibles: el generador criptográfico del navegador, relojes de alta precisión, ruido de temporización y características del entorno. Nada sale de tu equipo."
      />
      <div style={{ display: "grid", gap: 8, marginTop: 18 }}>
        {rows.map((row) => {
          const st = row.status;
          return (
            <div key={row.id} style={{
              display: "flex", alignItems: "center", gap: 13, padding: "11px 12px 11px 16px",
              borderRadius: 12, border: "1px solid var(--border)",
              background: st === "done" ? "var(--surface-2)" : "var(--surface)",
              transition: "background .3s, border-color .3s",
              opacity: st === "idle" && running ? 0.55 : 1,
            }}>
              <div style={{
                width: 30, height: 30, borderRadius: 8, flex: "none", display: "grid", placeItems: "center",
                background: st === "done" ? "var(--good-soft)" : "var(--surface-2)",
                color: st === "done" ? "var(--good)" : "var(--text-3)",
                border: "1px solid var(--border-2)", overflow: "hidden",
              }}>
                {row.thumb && st === "done"
                  ? <img src={row.thumb} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", imageRendering: "pixelated" }} />
                  : st === "busy" ? <Spinner />
                  : st === "done" ? <div style={{ animation: "pop .3s both" }}><Icon name="check" size={16} /></div>
                  : <Icon name={row.icon} size={15} />}
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div className="mono" style={{ fontSize: 13.5, fontWeight: 600, color: "var(--text)", display: "flex", alignItems: "center", gap: 7 }}>
                  {row.label}
                  {row.kind !== "default" && (
                    <span style={{
                      fontSize: 9.5, fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase",
                      color: "var(--accent)", background: "var(--accent-soft)", padding: "2px 6px", borderRadius: 5,
                    }}>opcional</span>
                  )}
                </div>
                <div style={{ fontSize: 12, color: "var(--text-3)", marginTop: 1 }} className={st === "done" ? "mono" : ""}>
                  {st === "done" && row.detail ? truncate(row.detail, 50) : row.hint}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, flex: "none" }}>
                {st === "done" && (
                  <>
                    <IconBtn name="info" title="Ver detalle de los valores" onClick={() => setInfoRow(row)} />
                    <IconBtn name="refresh" title="Regenerar esta fuente" tone="accent" onClick={() => regen(row)} />
                    {row.kind !== "default" && <IconBtn name="x" title="Quitar" onClick={() => remove(row.id)} />}
                  </>
                )}
                {st === "busy" && <span style={{ fontSize: 11, color: "var(--text-3)", padding: "0 6px" }}>…</span>}
                {st === "idle" && !running && <span style={{ fontSize: 11, color: "var(--text-3)", padding: "0 6px" }}>—</span>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Optional entropy */}
      <div style={{ marginTop: 14 }}>
        <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--text-3)", marginBottom: 9 }}>
          Añadir más entropía · opcional
        </div>
        <div style={{ display: "flex", gap: 9, flexWrap: "wrap" }}>
          <Button size="sm" variant="soft" onClick={() => { regenTargetRef.current = null; fileRef.current?.click(); }}>
            <Icon name="image" size={15} /> {hasImage ? "Cambiar imagen" : "Subir imagen"}
          </Button>
          <Button size="sm" variant="soft" onClick={() => setCamOpen(true)}>
            <Icon name="camera" size={15} /> {hasCamera ? "Recapturar cámara" : "Usar cámara"}
          </Button>
        </div>
        <input ref={fileRef} type="file" accept="image/*" onChange={onFile} style={{ display: "none" }} />
        {camOpen && <CameraPanel onCapture={onCameraCapture} onCancel={() => setCamOpen(false)} />}
      </div>

      <PoolBar byteCount={pool.byteCount} fingerprint={pool.fingerprint()} />

      <div style={{ marginTop: 20, display: "flex", justifyContent: "flex-end" }}>
        {!done ? (
          <Button onClick={run} disabled={running}>
            {running ? "Recolectando…" : <><span>Recolectar entropía del sistema</span> <Icon name="bolt" size={16} /></>}
          </Button>
        ) : (
          <Button onClick={() => onDone(true)}>
            Continuar <Icon name="arrow" size={16} />
          </Button>
        )}
      </div>

      <InfoModal row={infoRow} onClose={() => setInfoRow(null)} />
    </div>
  );
}
