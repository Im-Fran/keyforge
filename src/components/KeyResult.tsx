import { useState, useCallback, useEffect } from "react";
import { Icon } from "./Icon";
import { Button, Label, Chip, Segmented, StepHeading } from "./ui";
import { TOKEN_TYPES, entropyBits, type EntropyPool, type AlgoId } from "../lib/crypto";

interface KeyResultProps {
  pool: EntropyPool;
  defaultType: string;
  algo: AlgoId;
}

export function KeyResult({ pool, defaultType, algo }: KeyResultProps) {
  const types = TOKEN_TYPES;
  const [typeId, setTypeId] = useState(defaultType in types ? defaultType : "hex");
  const t = types[typeId];
  const [bits, setBits] = useState(256);
  const [digits, setDigits] = useState(6);
  const [key, setKey] = useState("");
  const [reveal, setReveal] = useState(true);
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);

  const generate = useCallback(async () => {
    setBusy(true);
    const nonce = new Uint8Array(16);
    crypto.getRandomValues(nonce);
    pool.add(nonce); pool.addNumber(performance.now());
    const need = t.bytesFor(bits);
    const bytes = await pool.digest(Math.max(16, need), { algo });
    const out = t.format(bytes, bits, digits);
    setKey(out);
    setBusy(false);
  }, [pool, t, bits, digits, algo]);

  useEffect(() => { generate(); }, [typeId, bits, digits, algo]); // eslint-disable-line

  const eff = entropyBits(typeId, bits, digits);
  const strength = eff >= 256
    ? { label: "Excelente", c: "var(--good)" }
    : eff >= 112 ? { label: "Fuerte", c: "var(--good)" }
    : eff >= 64 ? { label: "Moderada", c: "var(--warn)" }
    : { label: "Baja", c: "var(--warn)" };

  const copy = () => {
    navigator.clipboard?.writeText(key).then(() => {
      setCopied(true); setTimeout(() => setCopied(false), 1600);
    });
  };

  const download = () => {
    const blob = new Blob([key + "\n"], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `secret-${typeId}-${Date.now()}.txt`;
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <StepHeading
        title="Tu llave secreta está lista"
        sub="Generada localmente mezclando la entropía del sistema y tus movimientos. No se transmite ni se almacena en ningún lugar."
      />

      {/* Token type */}
      <div style={{ marginTop: 18 }}>
        <Label>Tipo de token</Label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 9 }}>
          {Object.entries(types).map(([id, def]) => (
            <Chip key={id} active={id === typeId} onClick={() => setTypeId(id)}>{def.label}</Chip>
          ))}
        </div>
      </div>

      {/* Strength / digits */}
      {t.strengths && (
        <div style={{ marginTop: 16 }}>
          <Label>Fuerza</Label>
          <Segmented options={t.strengths.map((b) => ({ value: b, label: `${b} bits` }))} value={bits} onChange={setBits} />
        </div>
      )}
      {typeId === "pin" && (
        <div style={{ marginTop: 16 }}>
          <Label>Dígitos</Label>
          <Segmented options={(t.digitsOptions ?? [4, 6, 8]).map((d) => ({ value: d, label: `${d} dígitos` }))} value={digits} onChange={setDigits} />
        </div>
      )}

      {/* The key */}
      <div style={{
        marginTop: 18, background: "var(--surface)", borderRadius: "var(--radius)",
        border: "1px solid var(--accent)", overflow: "hidden",
        boxShadow: "0 0 0 4px var(--accent-ring), 0 18px 40px -24px hsl(var(--shadow-c)/.3)",
      }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "10px 14px", borderBottom: "1px solid var(--border)", background: "var(--surface-2)",
        }}>
          <span style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 11.5, fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--text-3)" }}>
            <Icon name="lock" size={13} /> Secreto
          </span>
          <span className="mono" style={{ fontSize: 11.5, color: "var(--text-3)" }}>
            {algo} · {key.length} car · ~{eff} bits
          </span>
        </div>
        <div className="mono" style={{
          padding: "20px 18px", fontSize: 16, lineHeight: 1.7, wordBreak: "break-all", color: "var(--text)",
          minHeight: 64, display: "flex", alignItems: "center",
          filter: reveal ? "none" : "blur(7px)", transition: "filter .25s",
          userSelect: reveal ? "auto" : "none",
        }}>
          {busy ? <span style={{ color: "var(--text-3)" }}>generando…</span> : key}
        </div>
      </div>

      {/* Strength + actions */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 13, flexWrap: "wrap" }}>
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 7, fontSize: 12.5, fontWeight: 600,
          color: strength.c, padding: "6px 11px", borderRadius: 999, border: `1px solid ${strength.c}`,
          background: `color-mix(in oklch, ${strength.c} 10%, transparent)`,
        }}>
          <Icon name="shield" size={14} /> Resistencia {strength.label}
        </span>
        <span style={{ fontSize: 12.5, color: "var(--text-3)" }}>~{eff} bits de entropía</span>
        <div style={{ flex: 1 }} />
        <Button size="sm" variant="ghost" onClick={() => setReveal((r) => !r)}>
          <Icon name={reveal ? "eyeOff" : "eye"} size={15} /> {reveal ? "Ocultar" : "Mostrar"}
        </Button>
        <Button size="sm" variant="ghost" onClick={download}>
          <Icon name="download" size={15} /> Descargar
        </Button>
        <Button size="sm" variant="ghost" onClick={generate}>
          <Icon name="refresh" size={15} /> Regenerar
        </Button>
        <Button
          size="sm"
          variant={copied ? "soft" : "primary"}
          onClick={copy}
          style={copied ? { color: "var(--good)" } : undefined}
        >
          <Icon name={copied ? "check" : "copy"} size={15} /> {copied ? "Copiado" : "Copiar"}
        </Button>
      </div>
    </div>
  );
}
