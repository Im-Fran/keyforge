import { useState, useRef, useEffect } from "react";
import { Icon } from "./Icon";
import { Button } from "./ui";
import { ALGOS, type AlgoId } from "../lib/crypto";

// ---- SettingsPopover --------------------------------------------------------
function SettingsPopover({ algo, setAlgo }: { algo: AlgoId; setAlgo: (a: AlgoId) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    window.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDoc); window.removeEventListener("keydown", onKey); };
  }, [open]);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <Button size="icon" variant={open ? "soft" : "ghost"} onClick={() => setOpen((o) => !o)}>
        <Icon name="settings" size={17} />
      </Button>
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 10px)", right: 0, zIndex: 40, width: 312,
          background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)",
          boxShadow: "0 1px 2px hsl(var(--shadow-c)/.05), 0 18px 40px -24px hsl(var(--shadow-c)/.28)",
          padding: 14, animation: "fadeUp .18s both",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <Icon name="shield" size={15} />
            <span style={{ fontWeight: 700, fontSize: 14 }}>Fuerza de la entropía</span>
          </div>
          <p style={{ margin: "0 0 12px", fontSize: 12, color: "var(--text-3)", lineHeight: 1.5 }}>
            Algoritmo con el que se deriva la llave a partir del pool de entropía.
          </p>
          <div style={{ display: "grid", gap: 7 }}>
            {ALGOS.map((a) => {
              const on = a.id === algo;
              return (
                <button key={a.id} onClick={() => setAlgo(a.id as AlgoId)} style={{
                  textAlign: "left", display: "flex", alignItems: "center", gap: 11,
                  padding: "10px 12px", borderRadius: 10, cursor: "pointer", fontFamily: "inherit",
                  transition: "all .15s",
                  border: `1px solid ${on ? "var(--accent)" : "var(--border)"}`,
                  background: on ? "var(--accent-soft)" : "var(--surface)",
                  boxShadow: on ? "0 0 0 3px var(--accent-ring)" : "none",
                }}>
                  <div style={{
                    width: 18, height: 18, borderRadius: "50%", flex: "none", display: "grid", placeItems: "center",
                    border: `2px solid ${on ? "var(--accent)" : "var(--border)"}`,
                    background: on ? "var(--accent)" : "transparent",
                  }}>
                    {on && <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#fff" }} />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="mono" style={{ fontSize: 13.5, fontWeight: 700, color: on ? "var(--accent)" : "var(--text)" }}>
                      {a.label}
                    </div>
                    <div style={{ fontSize: 11.5, color: "var(--text-3)", marginTop: 1 }}>{a.hint}</div>
                  </div>
                  <span style={{
                    fontSize: 9.5, fontWeight: 700, letterSpacing: ".05em", textTransform: "uppercase",
                    color: "var(--text-3)", border: "1px solid var(--border)", borderRadius: 5,
                    padding: "2px 6px", flex: "none",
                  }}>
                    {a.tag}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ---- Header -----------------------------------------------------------------
interface HeaderProps {
  theme: string;
  setTheme: (t: string) => void;
  algo: AlgoId;
  setAlgo: (a: AlgoId) => void;
  onOpenTweaks: () => void;
}

export function Header({ theme, setTheme, algo, setAlgo, onOpenTweaks }: HeaderProps) {
  return (
    <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 30 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 11, display: "grid", placeItems: "center",
          color: "#fff", background: "linear-gradient(150deg, var(--accent), var(--accent-2))",
          boxShadow: "0 6px 16px -6px var(--accent)",
        }}>
          <Icon name="key" size={21} />
        </div>
        <div>
          <div style={{ fontWeight: 800, fontSize: 18, letterSpacing: "-.02em" }}>Keyforge</div>
          <div style={{ fontSize: 12, color: "var(--text-3)", marginTop: -1 }}>Generador de tokens secretos</div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span className="mono" style={{
          display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11.5, fontWeight: 600,
          color: "var(--text-2)", padding: "7px 11px", borderRadius: 999,
          border: "1px solid var(--border)", background: "var(--surface)",
        }}>
          <Icon name="shield" size={13} /> CSPRNG local · sin servidor
        </span>
        <SettingsPopover algo={algo} setAlgo={setAlgo} />
        <Button size="icon" variant="ghost" title="Tweaks" onClick={onOpenTweaks}>
          <Icon name="sliders" size={17} />
        </Button>
        <Button size="icon" variant="ghost" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
          <Icon name={theme === "dark" ? "sun" : "moon"} size={17} />
        </Button>
      </div>
    </header>
  );
}
