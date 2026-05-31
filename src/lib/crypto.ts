export type AlgoId = "SHA-256" | "SHA-512" | "PBKDF2";

export interface AlgoMeta {
  id: AlgoId;
  label: string;
  hint: string;
  tag: string;
}

export interface SourceResult {
  bytes: Uint8Array;
  detail: string;
}

export interface LocalSource {
  id: string;
  label: string;
  hint: string;
  collect: () => SourceResult;
}

export interface TokenType {
  label: string;
  mono: boolean;
  bytesFor: (bits: number) => number;
  format: (bytes: Uint8Array, bits: number, digits?: number) => string;
  strengths: number[] | null;
  fixed?: number;
  digitsOptions?: number[];
}

function numToBytes(n: number): Uint8Array {
  const buf = new ArrayBuffer(8);
  new DataView(buf).setFloat64(0, n);
  return new Uint8Array(buf);
}

function strToBytes(s: string): Uint8Array {
  return new TextEncoder().encode(String(s));
}

function concatBytes(chunks: Uint8Array[]): Uint8Array {
  let len = 0;
  for (const c of chunks) len += c.length;
  const out = new Uint8Array(len);
  let off = 0;
  for (const c of chunks) { out.set(c, off); off += c.length; }
  return out;
}

export class EntropyPool {
  chunks: Uint8Array[] = [];
  byteCount = 0;
  private fp = 0x811c9dc5;

  private mixFp(byte: number) {
    this.fp ^= byte & 0xff;
    this.fp = Math.imul(this.fp, 0x01000193) >>> 0;
  }

  add(bytes: Uint8Array): this {
    this.chunks.push(bytes);
    this.byteCount += bytes.length;
    const step = Math.max(1, (bytes.length / 8) | 0);
    for (let i = 0; i < bytes.length; i += step) this.mixFp(bytes[i]);
    return this;
  }

  addNumber(n: number): this { return this.add(numToBytes(n)); }
  addString(s: string): this { return this.add(strToBytes(s)); }

  fingerprint(): string {
    return ("00000000" + (this.fp >>> 0).toString(16)).slice(-8);
  }

  snapshotBytes(n: number): Uint8Array {
    const all = concatBytes(this.chunks);
    return all.subarray(Math.max(0, all.length - n));
  }

  async digest(lengthBytes: number, opts: { algo?: AlgoId; iterations?: number } = {}): Promise<Uint8Array> {
    const algo = opts.algo ?? "SHA-256";
    const pool = concatBytes(this.chunks);

    if (algo === "PBKDF2") {
      const iterations = opts.iterations ?? 210000;
      const salt = new Uint8Array(await crypto.subtle.digest("SHA-256", pool));
      const keyMat = await crypto.subtle.importKey(
        "raw", pool.length ? pool : salt, "PBKDF2", false, ["deriveBits"]
      );
      const bits = await crypto.subtle.deriveBits(
        { name: "PBKDF2", salt, iterations, hash: "SHA-256" },
        keyMat, Math.max(16, lengthBytes) * 8
      );
      return new Uint8Array(bits).subarray(0, lengthBytes);
    }

    const seed = new Uint8Array(await crypto.subtle.digest(algo, pool));
    const out = new Uint8Array(lengthBytes);
    let offset = 0, counter = 0;
    while (offset < lengthBytes) {
      const block = new Uint8Array(seed.length + 4);
      block.set(seed, 0);
      block[seed.length + 0] = (counter >>> 24) & 0xff;
      block[seed.length + 1] = (counter >>> 16) & 0xff;
      block[seed.length + 2] = (counter >>> 8) & 0xff;
      block[seed.length + 3] = counter & 0xff;
      const h = new Uint8Array(await crypto.subtle.digest(algo, block));
      const take = Math.min(h.length, lengthBytes - offset);
      out.set(h.subarray(0, take), offset);
      offset += take;
      counter++;
    }
    return out;
  }
}

export function localSources(): LocalSource[] {
  return [
    {
      id: "csprng",
      label: "crypto.getRandomValues",
      hint: "256 bits del CSPRNG del sistema",
      collect() {
        const b = new Uint8Array(32);
        crypto.getRandomValues(b);
        return {
          bytes: b,
          detail: Array.from(b.subarray(0, 6)).map((x) => x.toString(16).padStart(2, "0")).join(" ") + " …",
        };
      },
    },
    {
      id: "hires",
      label: "performance.now()",
      hint: "Reloj de alta resolución",
      collect() {
        const t = performance.now();
        return { bytes: numToBytes(t), detail: t.toFixed(4) + " ms" };
      },
    },
    {
      id: "clock",
      label: "Date.now()",
      hint: "Marca de tiempo del sistema",
      collect() {
        const t = Date.now();
        return { bytes: numToBytes(t), detail: new Date(t).toISOString() };
      },
    },
    {
      id: "screen",
      label: "Pantalla & viewport",
      hint: "Resolución, densidad de píxeles",
      collect() {
        const s = `${screen.width}x${screen.height}@${window.devicePixelRatio || 1}|${innerWidth}x${innerHeight}`;
        return { bytes: strToBytes(s), detail: s };
      },
    },
    {
      id: "agent",
      label: "Plataforma & idioma",
      hint: "navigator: UA, idioma, núcleos",
      collect() {
        const s = `${navigator.userAgent}|${navigator.language}|${navigator.hardwareConcurrency || "?"}c|tz${new Date().getTimezoneOffset()}`;
        return {
          bytes: strToBytes(s),
          detail: `${navigator.platform || "web"} · ${navigator.hardwareConcurrency || "?"} núcleos`,
        };
      },
    },
    {
      id: "mem",
      label: "Heap & jitter",
      hint: "Memoria y ruido de temporización",
      collect() {
        let acc = 0;
        const t0 = performance.now();
        for (let i = 0; i < 50000; i++) acc += Math.sin(i) * Math.random();
        const dt = performance.now() - t0;
        const mem = ((performance as unknown as { memory?: { usedJSHeapSize?: number } }).memory?.usedJSHeapSize) || 0;
        return {
          bytes: concatBytes([numToBytes(dt), numToBytes(acc), numToBytes(mem)]),
          detail: `jitter ${dt.toFixed(3)} ms`,
        };
      },
    },
  ];
}

const B64URL = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
const ALNUM  = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

export function toHex(bytes: Uint8Array): string {
  let s = "";
  for (const b of bytes) s += b.toString(16).padStart(2, "0");
  return s;
}

function toBase64Url(bytes: Uint8Array): string {
  let s = "";
  for (let i = 0; i < bytes.length; i += 3) {
    const a = bytes[i], b = i + 1 < bytes.length ? bytes[i + 1] : 0, c = i + 2 < bytes.length ? bytes[i + 2] : 0;
    const n = (a << 16) | (b << 8) | c;
    s += B64URL[(n >>> 18) & 63] + B64URL[(n >>> 12) & 63];
    if (i + 1 < bytes.length) s += B64URL[(n >>> 6) & 63];
    if (i + 2 < bytes.length) s += B64URL[n & 63];
  }
  return s;
}

function toCharset(bytes: Uint8Array, charset: string, count: number): string {
  let s = "";
  for (let i = 0; i < count; i++) s += charset[bytes[i % bytes.length] % charset.length];
  return s;
}

function toUuidV4(bytes: Uint8Array): string {
  const b = bytes.slice(0, 16);
  b[6] = (b[6] & 0x0f) | 0x40;
  b[8] = (b[8] & 0x3f) | 0x80;
  const h = toHex(b);
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20, 32)}`;
}

function toPin(bytes: Uint8Array, digits: number): string {
  let s = "";
  for (let i = 0; i < digits; i++) s += (bytes[i % bytes.length] % 10).toString();
  return s;
}

export const TOKEN_TYPES: Record<string, TokenType> = {
  hex: {
    label: "Hexadecimal",
    mono: true,
    bytesFor: (bits) => bits / 8,
    format: (bytes) => toHex(bytes),
    strengths: [128, 256, 512],
  },
  base64: {
    label: "Base64 URL-safe",
    mono: true,
    bytesFor: (bits) => bits / 8,
    format: (bytes) => toBase64Url(bytes),
    strengths: [128, 256, 512],
  },
  apikey: {
    label: "API key alfanumérica",
    mono: true,
    bytesFor: (bits) => Math.ceil(bits / 8),
    format: (bytes, bits) => toCharset(bytes, ALNUM, Math.ceil(bits / Math.log2(ALNUM.length))),
    strengths: [128, 256, 512],
  },
  uuid: {
    label: "UUID v4",
    mono: true,
    fixed: 122,
    bytesFor: () => 16,
    format: (bytes) => toUuidV4(bytes),
    strengths: null,
  },
  pin: {
    label: "PIN numérico",
    mono: true,
    bytesFor: () => 8,
    format: (bytes, _bits, digits = 6) => toPin(bytes, digits),
    strengths: null,
    digitsOptions: [4, 6, 8],
  },
};

export function entropyBits(typeId: string, bits: number, digits: number): number {
  if (typeId === "uuid") return 122;
  if (typeId === "pin") return Math.round(digits * Math.log2(10));
  return bits;
}

export const ALGOS: AlgoMeta[] = [
  { id: "SHA-256", label: "SHA-256", hint: "Rápido y estándar · predeterminado", tag: "Estándar" },
  { id: "SHA-512", label: "SHA-512", hint: "Hash más ancho de 512 bits", tag: "Ancho" },
  { id: "PBKDF2",  label: "PBKDF2",  hint: "Endurecido · 210 000 iteraciones (key stretching)", tag: "Reforzado" },
];

export function bytesFromDrawable(
  srcEl: HTMLImageElement | HTMLVideoElement,
  w: number,
  h: number
): { bytes: Uint8Array; w: number; h: number; thumb: string } {
  const cw = 80, ch = Math.max(1, Math.round((cw * (h || 1)) / (w || 1)));
  const canvas = document.createElement("canvas");
  canvas.width = cw; canvas.height = ch;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(srcEl, 0, 0, cw, ch);
  const data = ctx.getImageData(0, 0, cw, ch).data;
  const bytes = new Uint8Array(data.length);
  bytes.set(data);
  return { bytes, w: cw, h: ch, thumb: canvas.toDataURL("image/jpeg", 0.6) };
}
