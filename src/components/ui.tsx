import { useState, type CSSProperties, type ReactNode } from "react";
import { Icon, type IconName } from "./Icon";

// ---- Button ------------------------------------------------------------------
interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "ghost" | "soft";
  disabled?: boolean;
  size?: "md" | "sm" | "icon";
  style?: CSSProperties;
  full?: boolean;
  title?: string;
}

export function Button({ children, onClick, variant = "primary", disabled, size = "md", style, full, title }: ButtonProps) {
  const [hover, setHover] = useState(false);
  const sizes: Record<string, CSSProperties> = {
    md:   { padding: "0 18px", height: 46, fontSize: 15, borderRadius: 11 },
    sm:   { padding: "0 13px", height: 38, fontSize: 13.5, borderRadius: 9 },
    icon: { width: 42, height: 42, padding: "0", borderRadius: 11, fontSize: 14 },
  };
  const variants: Record<string, CSSProperties> = {
    primary: {
      background: disabled ? "var(--border)" : hover ? "var(--accent-2)" : "var(--accent)",
      color: disabled ? "var(--text-3)" : "#fff",
      border: "1px solid transparent",
      boxShadow: disabled ? "none" : "0 1px 2px hsl(var(--shadow-c)/.18), 0 8px 18px -10px var(--accent)",
    },
    ghost: {
      background: hover ? "var(--surface-2)" : "transparent",
      color: "var(--text-2)",
      border: "1px solid var(--border)",
    },
    soft: {
      background: hover ? "var(--accent-soft)" : "var(--surface-2)",
      color: "var(--accent)",
      border: "1px solid var(--border)",
    },
  };
  return (
    <button
      onClick={disabled ? undefined : onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      disabled={disabled}
      title={title}
      style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        gap: 8, fontFamily: "inherit", fontWeight: 600, cursor: disabled ? "not-allowed" : "pointer",
        transition: "background .18s, box-shadow .18s, transform .12s, color .18s",
        transform: hover && !disabled ? "translateY(-1px)" : "none",
        width: full ? "100%" : (sizes[size] as CSSProperties).width,
        whiteSpace: "nowrap",
        ...sizes[size], ...variants[variant], ...style,
      }}
    >
      {children}
    </button>
  );
}

// ---- IconBtn -----------------------------------------------------------------
interface IconBtnProps {
  name: IconName;
  onClick?: () => void;
  title?: string;
  tone?: "accent" | "default";
}

export function IconBtn({ name, onClick, title, tone }: IconBtnProps) {
  const [h, setH] = useState(false);
  return (
    <button
      title={title}
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        width: 30, height: 30, borderRadius: 8, flex: "none", cursor: "pointer",
        display: "grid", placeItems: "center", border: "1px solid var(--border)",
        transition: "all .15s", background: h ? "var(--surface-2)" : "transparent",
        color: tone === "accent" ? "var(--accent)" : "var(--text-3)",
      }}
    >
      <Icon name={name} size={15} />
    </button>
  );
}

// ---- Spinner -----------------------------------------------------------------
export function Spinner() {
  return (
    <div style={{
      width: 15, height: 15, borderRadius: "50%", border: "2px solid var(--border)",
      borderTopColor: "var(--accent)", animation: "spin .7s linear infinite",
    }} />
  );
}

// ---- Label -------------------------------------------------------------------
export function Label({ children }: { children: ReactNode }) {
  return (
    <div style={{
      fontSize: 11.5, fontWeight: 700, letterSpacing: ".07em",
      textTransform: "uppercase", color: "var(--text-3)",
    }}>
      {children}
    </div>
  );
}

// ---- Chip --------------------------------------------------------------------
export function Chip({ children, active, onClick }: { children: ReactNode; active: boolean; onClick: () => void }) {
  const [h, setH] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        fontFamily: "inherit", fontSize: 13.5, fontWeight: 600, padding: "9px 14px",
        borderRadius: 10, cursor: "pointer", transition: "all .16s",
        border: `1px solid ${active ? "transparent" : "var(--border)"}`,
        background: active ? "var(--accent)" : h ? "var(--surface-2)" : "var(--surface)",
        color: active ? "#fff" : "var(--text-2)",
        boxShadow: active ? "0 6px 14px -8px var(--accent)" : "none",
      }}
    >
      {children}
    </button>
  );
}

// ---- Segmented ---------------------------------------------------------------
interface SegOption { value: number; label: string; }

export function Segmented({ options, value, onChange }: { options: SegOption[]; value: number; onChange: (v: number) => void }) {
  return (
    <div style={{
      display: "inline-flex", gap: 4, padding: 4, marginTop: 9, borderRadius: 12,
      background: "var(--surface-2)", border: "1px solid var(--border)",
    }}>
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button key={o.value} onClick={() => onChange(o.value)} style={{
            fontFamily: "inherit", fontSize: 13, fontWeight: 600, padding: "8px 16px",
            borderRadius: 8, cursor: "pointer", border: "none", transition: "all .18s",
            background: active ? "var(--surface)" : "transparent",
            color: active ? "var(--accent)" : "var(--text-3)",
            boxShadow: active ? "0 1px 3px hsl(var(--shadow-c)/.12)" : "none",
          }}>
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

// ---- PoolBar -----------------------------------------------------------------
export function PoolBar({ byteCount, fingerprint }: { byteCount: number; fingerprint: string }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12, marginTop: 16, padding: "11px 14px",
      borderRadius: 11, background: "var(--surface-2)", border: "1px dashed var(--border)",
    }}>
      <Icon name="bolt" size={14} />
      <span style={{ fontSize: 12.5, color: "var(--text-2)", fontWeight: 600 }}>Pool de entropía</span>
      <span className="mono" style={{ fontSize: 12.5, color: "var(--text-3)" }}>{byteCount} bytes</span>
      <div style={{ flex: 1 }} />
      <span style={{ fontSize: 11, color: "var(--text-3)", fontWeight: 600 }}>huella</span>
      <span className="mono" style={{ fontSize: 13, fontWeight: 700, color: "var(--accent)", letterSpacing: ".05em" }}>
        {fingerprint}
      </span>
    </div>
  );
}

// ---- StepHeading -------------------------------------------------------------
export function StepHeading({ title, sub }: { title: string; sub: string }) {
  return (
    <div>
      <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, letterSpacing: "-.02em" }}>{title}</h2>
      <p style={{ margin: "8px 0 0", fontSize: 14.5, lineHeight: 1.55, color: "var(--text-2)", maxWidth: 560 }}>{sub}</p>
    </div>
  );
}

