const en = {
  header: {
    subtitle: "Secret token generator",
    badge: "Local CSPRNG · no server",
    settings: {
      title: "Entropy strength",
      description:
        "Algorithm used to derive the key from the entropy pool.",
    },
    tooltips: {
      tweaks: "Tweaks",
      toggleTheme: "Toggle theme",
    },
  },
  stepper: {
    stepLabel: "Step {{n}}",
    goTo: "Go to step {{n}}",
    unavailable: "Not available yet",
    steps: {
      system: "System entropy",
      human: "Human entropy",
      result: "Your key",
    },
  },
  systemEntropy: {
    title: "Collect randomness from your device",
    sub: "We read unpredictable local sources: the browser's cryptographic generator, high-precision clocks, timing noise, and environment characteristics. Nothing leaves your device.",
    optional: "optional",
    addMore: "Add more entropy · optional",
    uploadImage: "Upload image",
    changeImage: "Change image",
    useCamera: "Use camera",
    recaptureCamera: "Recapture camera",
    collecting: "Collecting…",
    collectBtn: "Collect system entropy",
    continueBtn: "Continue",
    modal: {
      bytesContributed: "{{n}} bytes contributed to pool",
      valueRead: "Value read",
      hexDump: "Hex dump",
      noData: "(no data)",
      close: "Close",
    },
    camera: {
      error: "Could not access the camera. Check your browser permissions.",
      cancel: "Cancel",
      capture: "Capture frame",
    },
    iconTooltips: {
      info: "View value details",
      regen: "Regenerate this source",
      remove: "Remove",
    },
    imageRow: {
      label: "Uploaded image",
      hint: "Pixels from your image",
      detail: "{{name}} · {{w}}×{{h}} px sampled · {{bytes}} bytes",
    },
    cameraRow: {
      label: "Live camera",
      hint: "Captured frame",
      detail: "Live frame · {{w}}×{{h}} px · {{bytes}} bytes",
    },
    hexDumpMore: "…  (+{{n}} more bytes)",
    sources: {
      csprng: {
        label: "crypto.getRandomValues",
        hint: "256 bits from system CSPRNG",
      },
      hires: {
        label: "performance.now()",
        hint: "High-resolution clock",
      },
      clock: {
        label: "Date.now()",
        hint: "System timestamp",
      },
      screen: {
        label: "Screen & viewport",
        hint: "Resolution, pixel density",
      },
      agent: {
        label: "Platform & language",
        hint: "navigator: UA, language, cores",
      },
      mem: {
        label: "Heap & jitter",
        hint: "Memory and timing noise",
      },
    },
  },
  humanEntropy: {
    title: "Add your own randomness",
    sub: "Move the cursor inside the box erratically. Each micro-movement, its speed, and its exact timing are unpredictable even to you — we mix them with the system entropy.",
    moveHere: "Move the mouse in here",
    erratic: "the more erratic, the better",
    collecting: "Human entropy collection",
    sufficient: "Sufficient entropy",
    keepMoving: "Keep moving… {{pct}}%",
    generateBtn: "Generate key",
  },
  keyResult: {
    title: "Your secret key is ready",
    sub: "Generated locally by mixing system entropy and your movements. It is never transmitted or stored anywhere.",
    tokenType: "Token type",
    strength: "Strength",
    digits: "Digits",
    bits: "{{n}} bits",
    digitCount: "{{n}} digits",
    secret: "Secret",
    keyMeta: "{{algo}} · {{chars}} chars · ~{{bits}} bits",
    generating: "generating…",
    resistance: "Resistance {{label}}",
    entropyBits: "~{{n}} bits of entropy",
    hide: "Hide",
    show: "Show",
    download: "Download",
    regenerate: "Regenerate",
    copy: "Copy",
    copied: "Copied",
    strength_levels: {
      excellent: "Excellent",
      strong: "Strong",
      moderate: "Moderate",
      low: "Low",
    },
    types: {
      hex: "Hexadecimal",
      base64: "Base64 URL-safe",
      apikey: "Alphanumeric API key",
      uuid: "UUID v4",
      pin: "Numeric PIN",
    },
  },
  tweaks: {
    title: "Tweaks",
    close: "Close",
    sections: {
      appearance: "Appearance",
      generator: "Generator",
      security: "Security",
    },
    rows: {
      accentColor: "Accent color",
      darkMode: "Dark mode",
      defaultType: "Default type",
      derivationAlgo: "Derivation algorithm",
      language: "Language",
    },
  },
  algos: {
    "SHA-256": {
      hint: "Fast and standard · default",
      tag: "Standard",
    },
    "SHA-512": {
      hint: "Wider 512-bit hash",
      tag: "Wide",
    },
    PBKDF2: {
      hint: "Hardened · 210,000 iterations (key stretching)",
      tag: "Hardened",
    },
  },
  poolBar: {
    label: "Entropy pool",
    bytes: "bytes",
    fingerprint: "fingerprint",
  },
  footer: {
    offline: "Everything happens in your browser · 100% offline",
    back: "← Back",
    restart: "↺ Start over",
  },
  accents: {
    indigo: "Indigo",
    blue: "Blue",
    cyan: "Cyan",
    green: "Green",
    magenta: "Magenta",
  },
  languages: {
    es: "Español",
    en: "English",
    pt: "Português",
  },
} as const;

export default en;
