import { useState, useRef, useCallback, useEffect } from "react";
import { Header } from "./components/Header";
import { Stepper } from "./components/Stepper";
import { SystemEntropy } from "./components/SystemEntropy";
import { HumanEntropy } from "./components/HumanEntropy";
import { KeyResult } from "./components/KeyResult";
import {
  TweaksPanel, TweakSection, TweakRow, TweakToggle, TweakSelect,
  useTweaks,
} from "./components/TweaksPanel";
import { Icon } from "./components/Icon";
import { EntropyPool, ALGOS, type AlgoId } from "./lib/crypto";

const ACCENT_PRESETS = [
  { hue: 280, name: "Índigo" },
  { hue: 255, name: "Azul" },
  { hue: 195, name: "Cian" },
  { hue: 155, name: "Verde" },
  { hue: 320, name: "Magenta" },
];

function AccentSwatches({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div style={{ display: "flex", gap: 9, flexWrap: "wrap" }}>
      {ACCENT_PRESETS.map((p) => {
        const active = p.hue === value;
        return (
          <button key={p.hue} title={p.name} onClick={() => onChange(p.hue)} style={{
            width: 34, height: 34, borderRadius: 9, cursor: "pointer", padding: 0,
            background: `oklch(0.6 0.2 ${p.hue})`,
            border: active ? "2px solid var(--text)" : "2px solid transparent",
            outline: active ? "none" : "1px solid var(--border)",
            boxShadow: active ? `0 0 0 3px oklch(0.6 0.2 ${p.hue} / .3)` : "none",
            transition: "transform .12s",
          }} />
        );
      })}
    </div>
  );
}

const TWEAK_DEFAULTS = {
  accentHue: 280,
  dark: false,
  defaultType: "hex",
  hashAlgo: "SHA-256",
};

export default function App() {
  const poolRef = useRef(new EntropyPool());
  const [step, setStepRaw] = useState(1);
  const [maxStep, setMaxStep] = useState(1);
  const goStep = useCallback((n: number) => {
    setStepRaw(n);
    setMaxStep((m) => Math.max(m, n));
  }, []);
  const [, setTick] = useState(0);
  const bump = useCallback(() => setTick((t) => (t + 1) % 1e9), []);
  const [sysDone, setSysDone] = useState(false);
  const [humanDone, setHumanDone] = useState(false);
  const [tweaksOpen, setTweaksOpen] = useState(false);

  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const theme = t.dark ? "dark" : "light";
  const accent = String(t.accentHue);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.style.setProperty("--hue", accent);
  }, [theme, accent]);

  const restart = () => {
    poolRef.current = new EntropyPool();
    setSysDone(false); setHumanDone(false); setStepRaw(1); setMaxStep(1); bump();
  };

  const cardStyle = {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    boxShadow: "0 1px 2px hsl(var(--shadow-c) / .05), 0 18px 40px -24px hsl(var(--shadow-c) / .28)",
  };

  return (
    <div style={{
      position: "relative", zIndex: 1, minHeight: "100%", display: "flex",
      flexDirection: "column", alignItems: "center", padding: "40px 22px 56px",
    }}>
      <div style={{ width: "100%", maxWidth: 620 }}>
        <Header
          theme={theme}
          setTheme={(v) => setTweak("dark", v === "dark")}
          algo={t.hashAlgo as AlgoId}
          setAlgo={(v) => setTweak("hashAlgo", v)}
          onOpenTweaks={() => setTweaksOpen((o) => !o)}
        />

        <div style={{ ...cardStyle, padding: "26px 26px 24px" }}>
          <Stepper step={step} maxStep={maxStep} onJump={(n) => setStepRaw(n)} />
          <div style={{ borderTop: "1px solid var(--border-2)", margin: "0 -26px 22px", paddingTop: 22 }} />

          {/* Pasos 1 y 2 siempre montados para conservar estado */}
          <div style={{ display: step === 1 ? "block" : "none" }}>
            <SystemEntropy
              pool={poolRef.current}
              done={sysDone}
              bump={bump}
              onDone={(advance) => {
                if (advance === true) goStep(2);
                else setSysDone(true);
              }}
            />
          </div>
          <div style={{ display: step === 2 ? "block" : "none" }}>
            <HumanEntropy
              pool={poolRef.current}
              done={humanDone}
              bump={bump}
              accent={accent}
              onDone={(advance) => {
                if (advance === true) goStep(3);
                else setHumanDone(true);
              }}
            />
          </div>
          {step === 3 && (
            <KeyResult
              key={t.defaultType}
              pool={poolRef.current}
              defaultType={t.defaultType}
              algo={t.hashAlgo as AlgoId}
            />
          )}
        </div>

        {/* Footer */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 16, padding: "0 4px" }}>
          <div style={{ fontSize: 12.5, color: "var(--text-3)", display: "flex", alignItems: "center", gap: 7 }}>
            <Icon name="lock" size={13} /> Todo ocurre en tu navegador · 100% offline
          </div>
          {step > 1 ? (
            <button
              onClick={step === 3 ? restart : () => setStepRaw(step - 1)}
              style={{
                background: "none", border: "none", cursor: "pointer", fontFamily: "inherit",
                fontSize: 13, fontWeight: 600, color: "var(--text-2)", padding: "6px 4px",
              }}
            >
              {step === 3 ? "↺ Empezar de nuevo" : "← Atrás"}
            </button>
          ) : <span />}
        </div>
      </div>

      {/* Tweaks Panel */}
      <TweaksPanel open={tweaksOpen} onClose={() => setTweaksOpen(false)}>
        <TweakSection label="Apariencia" />
        <TweakRow label="Color de acento">
          <AccentSwatches value={t.accentHue} onChange={(v) => setTweak("accentHue", v)} />
        </TweakRow>
        <TweakToggle label="Modo oscuro" value={t.dark} onChange={(v) => setTweak("dark", v)} />
        <TweakSection label="Generador" />
        <TweakSelect
          label="Tipo por defecto"
          value={t.defaultType}
          options={[
            { value: "hex",    label: "Hexadecimal" },
            { value: "base64", label: "Base64 URL-safe" },
            { value: "apikey", label: "API key alfanumérica" },
            { value: "uuid",   label: "UUID v4" },
            { value: "pin",    label: "PIN numérico" },
          ]}
          onChange={(v) => setTweak("defaultType", v)}
        />
        <TweakSection label="Seguridad" />
        <TweakSelect
          label="Algoritmo de derivación"
          value={t.hashAlgo}
          options={ALGOS.map((a) => ({ value: a.id, label: a.label }))}
          onChange={(v) => setTweak("hashAlgo", v)}
        />
      </TweaksPanel>
    </div>
  );
}
