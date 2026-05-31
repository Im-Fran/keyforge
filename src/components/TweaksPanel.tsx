import { useState, useRef, useEffect, useCallback, type ReactNode } from "react";

// ---- useTweaks ---------------------------------------------------------------
export type TweakValues = {
  accentHue: number;
  dark: boolean;
  defaultType: string;
  hashAlgo: string;
};

export function useTweaks(defaults: TweakValues): [TweakValues, (key: keyof TweakValues, val: unknown) => void] {
  const [values, setValues] = useState<TweakValues>(defaults);
  const setTweak = useCallback((key: keyof TweakValues, val: unknown) => {
    setValues((prev) => ({ ...prev, [key]: val }));
  }, []);
  return [values, setTweak];
}

// ---- TweaksPanel -------------------------------------------------------------
interface TweaksPanelProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

export function TweaksPanel({ open, onClose, children }: TweaksPanelProps) {
  const dragRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef({ x: 16, y: 16 });
  const PAD = 16;

  const clampToViewport = useCallback(() => {
    const panel = dragRef.current;
    if (!panel) return;
    const w = panel.offsetWidth, h = panel.offsetHeight;
    const maxRight = Math.max(PAD, window.innerWidth - w - PAD);
    const maxBottom = Math.max(PAD, window.innerHeight - h - PAD);
    offsetRef.current = {
      x: Math.min(maxRight, Math.max(PAD, offsetRef.current.x)),
      y: Math.min(maxBottom, Math.max(PAD, offsetRef.current.y)),
    };
    panel.style.right = offsetRef.current.x + "px";
    panel.style.bottom = offsetRef.current.y + "px";
  }, []);

  useEffect(() => {
    if (!open) return;
    clampToViewport();
    const ro = new ResizeObserver(clampToViewport);
    ro.observe(document.documentElement);
    return () => ro.disconnect();
  }, [open, clampToViewport]);

  const onDragStart = (e: React.MouseEvent) => {
    const panel = dragRef.current;
    if (!panel) return;
    const r = panel.getBoundingClientRect();
    const sx = e.clientX, sy = e.clientY;
    const startRight = window.innerWidth - r.right;
    const startBottom = window.innerHeight - r.bottom;
    const move = (ev: MouseEvent) => {
      offsetRef.current = {
        x: startRight - (ev.clientX - sx),
        y: startBottom - (ev.clientY - sy),
      };
      clampToViewport();
    };
    const up = () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  };

  if (!open) return null;
  return (
    <div
      ref={dragRef}
      className="twk-panel"
      style={{ right: offsetRef.current.x, bottom: offsetRef.current.y, animation: "fadeUp .18s both" }}
    >
      <div className="twk-hd" onMouseDown={onDragStart}>
        <b>Tweaks</b>
        <button className="twk-x" aria-label="Cerrar" onMouseDown={(e) => e.stopPropagation()} onClick={onClose}>
          ✕
        </button>
      </div>
      <div className="twk-body">{children}</div>
    </div>
  );
}

// ---- TweakSection ------------------------------------------------------------
export function TweakSection({ label }: { label: string }) {
  return <div className="twk-sect">{label}</div>;
}

// ---- TweakRow ----------------------------------------------------------------
export function TweakRow({ label, children, inline = false }: { label: string; children: ReactNode; inline?: boolean }) {
  return (
    <div className={inline ? "twk-row twk-row-h" : "twk-row"}>
      <div className="twk-lbl"><span>{label}</span></div>
      {children}
    </div>
  );
}

// ---- TweakToggle -------------------------------------------------------------
export function TweakToggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="twk-row twk-row-h">
      <div className="twk-lbl"><span>{label}</span></div>
      <button type="button" className="twk-toggle" data-on={value ? "1" : "0"}
        role="switch" aria-checked={!!value} onClick={() => onChange(!value)}>
        <i />
      </button>
    </div>
  );
}

// ---- TweakSelect -------------------------------------------------------------
interface SelectOption { value: string; label: string; }
export function TweakSelect({
  label, value, options, onChange,
}: { label: string; value: string; options: SelectOption[]; onChange: (v: string) => void }) {
  return (
    <TweakRow label={label}>
      <select className="twk-field" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </TweakRow>
  );
}
