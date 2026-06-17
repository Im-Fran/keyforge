import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { Icon, type IconName } from "./Icon";

const STEPS: { n: number; key: "system" | "human" | "result"; icon: IconName }[] = [
  { n: 1, key: "system", icon: "cpu" },
  { n: 2, key: "human", icon: "cursor" },
  { n: 3, key: "result", icon: "key" },
];

interface StepperProps {
  step: number;
  maxStep: number;
  onJump: (n: number) => void;
}

export function Stepper({ step, maxStep, onJump }: StepperProps) {
  const { t } = useTranslation();
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 22 }}>
      {STEPS.map((s, i) => {
        const done = step > s.n, active = step === s.n;
        const reachable = s.n <= maxStep;
        return (
          <Fragment key={s.n}>
            <button
              onClick={() => reachable && s.n !== step && onJump(s.n)}
              disabled={!reachable}
              title={reachable ? (s.n === step ? "" : t("stepper.goTo", { n: s.n })) : t("stepper.unavailable")}
              style={{
                display: "flex", alignItems: "center", gap: 11, flex: "none",
                padding: "4px 6px", margin: "-4px -2px", borderRadius: 10,
                border: "none", background: "transparent", fontFamily: "inherit",
                cursor: reachable && s.n !== step ? "pointer" : "default",
                transition: "background .15s",
              }}
              onMouseEnter={(e) => { if (reachable && s.n !== step) (e.currentTarget as HTMLButtonElement).style.background = "var(--surface-2)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
            >
              <div style={{
                width: 36, height: 36, borderRadius: 10, display: "grid", placeItems: "center",
                flex: "none", transition: "all .3s",
                background: done ? "var(--good-soft)" : active ? "var(--accent)" : "var(--surface-2)",
                color: done ? "var(--good)" : active ? "#fff" : "var(--text-3)",
                border: `1px solid ${active ? "transparent" : "var(--border)"}`,
                boxShadow: active ? "0 6px 16px -8px var(--accent)" : "none",
              }}>
                {done
                  ? <div style={{ animation: "pop .3s both" }}><Icon name="check" size={18} /></div>
                  : <Icon name={s.icon} size={17} />}
              </div>
              <div style={{ minWidth: 0, textAlign: "left" }}>
                <div style={{
                  fontSize: 10.5, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase",
                  color: active || done ? "var(--accent)" : "var(--text-3)",
                }}>
                  {t("stepper.stepLabel", { n: s.n })}
                </div>
                <div style={{
                  fontSize: 13.5, fontWeight: 600, whiteSpace: "nowrap",
                  color: active || done ? "var(--text)" : "var(--text-3)",
                }}>
                  {t(`stepper.steps.${s.key}`)}
                </div>
              </div>
            </button>
            {i < STEPS.length - 1 && (
              <div style={{ flex: 1, height: 2, margin: "0 14px", borderRadius: 2, background: "var(--border)", position: "relative", overflow: "hidden" }}>
                <div style={{
                  position: "absolute", inset: 0, background: "var(--accent)", transformOrigin: "left",
                  transform: `scaleX(${step > s.n ? 1 : 0})`, transition: "transform .5s cubic-bezier(.2,.7,.2,1)",
                }} />
              </div>
            )}
          </Fragment>
        );
      })}
    </div>
  );
}
