import { useState, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Header } from "./components/Header";
import { Stepper } from "./components/Stepper";
import { SystemEntropy } from "./components/SystemEntropy";
import { HumanEntropy } from "./components/HumanEntropy";
import { KeyResult } from "./components/KeyResult";
import {
  TweaksPanel, TweakSection, TweakRow, TweakToggle, TweakSelect,
} from "./components/TweaksPanel";
import { useTweaks } from "./hooks/useTweaks";
import { Icon } from "./components/Icon";
import { EntropyPool, ALGOS, type AlgoId } from "./lib/crypto";

const ACCENT_PRESETS = [
  { hue: 280, key: "indigo" },
  { hue: 255, key: "blue" },
  { hue: 195, key: "cyan" },
  { hue: 155, key: "green" },
  { hue: 320, key: "magenta" },
];

function AccentSwatches({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const { t } = useTranslation();
  return (
    <div style={{ display: "flex", gap: 9, flexWrap: "wrap" }}>
      {ACCENT_PRESETS.map((p) => {
        const active = p.hue === value;
        return (
          <button key={p.hue} title={t(`accents.${p.key}`)} onClick={() => onChange(p.hue)} style={{
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
  const { t } = useTranslation();
  const [pool, setPool] = useState(() => new EntropyPool());
  const [step, setStepRaw] = useState(1);
  const [maxStep, setMaxStep] = useState(1);
  const goStep = useCallback((n: number) => {
    setStepRaw(n);
    setMaxStep((m) => Math.max(m, n));
  }, []);
  const [, setTick] = useState(0);
  const bump = useCallback(() => setTick((tk) => (tk + 1) % 1e9), []);
  const [sysDone, setSysDone] = useState(false);
  const [humanDone, setHumanDone] = useState(false);
  const [tweaksOpen, setTweaksOpen] = useState(false);

  const [tw, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const theme = tw.dark ? "dark" : "light";
  const accent = String(tw.accentHue);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.style.setProperty("--hue", accent);
  }, [theme, accent]);

  const restart = () => {
    setPool(new EntropyPool());
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
          algo={tw.hashAlgo as AlgoId}
          setAlgo={(v) => setTweak("hashAlgo", v)}
          onOpenTweaks={() => setTweaksOpen((o) => !o)}
        />

        <div style={{ ...cardStyle, padding: "26px 26px 24px" }}>
          <Stepper step={step} maxStep={maxStep} onJump={(n) => setStepRaw(n)} />
          <div style={{ borderTop: "1px solid var(--border-2)", margin: "0 -26px 22px", paddingTop: 22 }} />

          <div style={{ display: step === 1 ? "block" : "none" }}>
            <SystemEntropy
              pool={pool}
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
              pool={pool}
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
              key={tw.defaultType}
              pool={pool}
              defaultType={tw.defaultType}
              algo={tw.hashAlgo as AlgoId}
            />
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 16, padding: "0 4px" }}>
          <div style={{ fontSize: 12.5, color: "var(--text-3)", display: "flex", alignItems: "center", gap: 7 }}>
            <Icon name="lock" size={13} /> {t("footer.offline")}
          </div>
          {step > 1 ? (
            <button
              onClick={step === 3 ? restart : () => setStepRaw(step - 1)}
              style={{
                background: "none", border: "none", cursor: "pointer", fontFamily: "inherit",
                fontSize: 13, fontWeight: 600, color: "var(--text-2)", padding: "6px 4px",
              }}
            >
              {step === 3 ? t("footer.restart") : t("footer.back")}
            </button>
          ) : <span />}
        </div>
      </div>

      <TweaksPanel open={tweaksOpen} onClose={() => setTweaksOpen(false)}>
        <TweakSection label={t("tweaks.sections.appearance")} />
        <TweakRow label={t("tweaks.rows.accentColor")}>
          <AccentSwatches value={tw.accentHue} onChange={(v) => setTweak("accentHue", v)} />
        </TweakRow>
        <TweakToggle label={t("tweaks.rows.darkMode")} value={tw.dark} onChange={(v) => setTweak("dark", v)} />
        <TweakSection label={t("tweaks.sections.generator")} />
        <TweakSelect
          label={t("tweaks.rows.defaultType")}
          value={tw.defaultType}
          options={[
            { value: "hex",    label: t("keyResult.types.hex") },
            { value: "base64", label: t("keyResult.types.base64") },
            { value: "apikey", label: t("keyResult.types.apikey") },
            { value: "uuid",   label: t("keyResult.types.uuid") },
            { value: "pin",    label: t("keyResult.types.pin") },
          ]}
          onChange={(v) => setTweak("defaultType", v)}
        />
        <TweakSection label={t("tweaks.sections.security")} />
        <TweakSelect
          label={t("tweaks.rows.derivationAlgo")}
          value={tw.hashAlgo}
          options={ALGOS.map((a) => ({ value: a.id, label: a.label }))}
          onChange={(v) => setTweak("hashAlgo", v)}
        />
      </TweaksPanel>
    </div>
  );
}
