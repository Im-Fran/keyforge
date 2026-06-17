const es = {
  header: {
    subtitle: "Generador de tokens secretos",
    badge: "CSPRNG local · sin servidor",
    settings: {
      title: "Fuerza de la entropía",
      description:
        "Algoritmo con el que se deriva la llave a partir del pool de entropía.",
    },
    tooltips: {
      tweaks: "Tweaks",
      toggleTheme: "Cambiar tema",
    },
  },
  stepper: {
    stepLabel: "Paso {{n}}",
    goTo: "Ir al paso {{n}}",
    unavailable: "Aún no disponible",
    steps: {
      system: "Entropía del sistema",
      human: "Entropía humana",
      result: "Tu llave",
    },
  },
  systemEntropy: {
    title: "Recolecta aleatoriedad de tu dispositivo",
    sub: "Leemos fuentes locales no predecibles: el generador criptográfico del navegador, relojes de alta precisión, ruido de temporización y características del entorno. Nada sale de tu equipo.",
    optional: "opcional",
    addMore: "Añadir más entropía · opcional",
    uploadImage: "Subir imagen",
    changeImage: "Cambiar imagen",
    useCamera: "Usar cámara",
    recaptureCamera: "Recapturar cámara",
    collecting: "Recolectando…",
    collectBtn: "Recolectar entropía del sistema",
    continueBtn: "Continuar",
    modal: {
      bytesContributed: "{{n}} bytes aportados al pool",
      valueRead: "Valor leído",
      hexDump: "Volcado hexadecimal",
      noData: "(sin datos)",
      close: "Cerrar",
    },
    camera: {
      error: "No se pudo acceder a la cámara. Revisa los permisos del navegador.",
      cancel: "Cancelar",
      capture: "Capturar fotograma",
    },
    iconTooltips: {
      info: "Ver detalle de los valores",
      regen: "Regenerar esta fuente",
      remove: "Quitar",
    },
    imageRow: {
      label: "Imagen subida",
      hint: "Píxeles de tu imagen",
      detail: "{{name}} · {{w}}×{{h}} px muestreados · {{bytes}} bytes",
    },
    cameraRow: {
      label: "Cámara en vivo",
      hint: "Fotograma capturado",
      detail: "Fotograma en vivo · {{w}}×{{h}} px · {{bytes}} bytes",
    },
    hexDumpMore: "…  (+{{n}} bytes más)",
    sources: {
      csprng: {
        label: "crypto.getRandomValues",
        hint: "256 bits del CSPRNG del sistema",
      },
      hires: {
        label: "performance.now()",
        hint: "Reloj de alta resolución",
      },
      clock: {
        label: "Date.now()",
        hint: "Marca de tiempo del sistema",
      },
      screen: {
        label: "Pantalla & viewport",
        hint: "Resolución, densidad de píxeles",
      },
      agent: {
        label: "Plataforma & idioma",
        hint: "navigator: UA, idioma, núcleos",
      },
      mem: {
        label: "Heap & jitter",
        hint: "Memoria y ruido de temporización",
      },
    },
  },
  humanEntropy: {
    title: "Añade tu propio azar",
    sub: "Mueve el cursor dentro del recuadro de forma errática. Cada micro-movimiento, su velocidad y su tiempo exacto son impredecibles incluso para ti — los mezclamos con la entropía del sistema.",
    moveHere: "Mueve el mouse aquí dentro",
    erratic: "cuanto más errático, mejor",
    collecting: "Recolección de entropía humana",
    sufficient: "Entropía suficiente",
    keepMoving: "Sigue moviendo… {{pct}}%",
    generateBtn: "Generar llave",
  },
  keyResult: {
    title: "Tu llave secreta está lista",
    sub: "Generada localmente mezclando la entropía del sistema y tus movimientos. No se transmite ni se almacena en ningún lugar.",
    tokenType: "Tipo de token",
    strength: "Fuerza",
    digits: "Dígitos",
    bits: "{{n}} bits",
    digitCount: "{{n}} dígitos",
    secret: "Secreto",
    keyMeta: "{{algo}} · {{chars}} car · ~{{bits}} bits",
    generating: "generando…",
    resistance: "Resistencia {{label}}",
    entropyBits: "~{{n}} bits de entropía",
    hide: "Ocultar",
    show: "Mostrar",
    download: "Descargar",
    regenerate: "Regenerar",
    copy: "Copiar",
    copied: "Copiado",
    strength_levels: {
      excellent: "Excelente",
      strong: "Fuerte",
      moderate: "Moderada",
      low: "Baja",
    },
    types: {
      hex: "Hexadecimal",
      base64: "Base64 URL-safe",
      apikey: "API key alfanumérica",
      uuid: "UUID v4",
      pin: "PIN numérico",
    },
  },
  tweaks: {
    title: "Tweaks",
    close: "Cerrar",
    sections: {
      appearance: "Apariencia",
      generator: "Generador",
      security: "Seguridad",
    },
    rows: {
      accentColor: "Color de acento",
      darkMode: "Modo oscuro",
      defaultType: "Tipo por defecto",
      derivationAlgo: "Algoritmo de derivación",
      language: "Idioma",
    },
  },
  algos: {
    "SHA-256": {
      hint: "Rápido y estándar · predeterminado",
      tag: "Estándar",
    },
    "SHA-512": {
      hint: "Hash más ancho de 512 bits",
      tag: "Ancho",
    },
    PBKDF2: {
      hint: "Endurecido · 210 000 iteraciones (key stretching)",
      tag: "Reforzado",
    },
  },
  poolBar: {
    label: "Pool de entropía",
    bytes: "bytes",
    fingerprint: "huella",
  },
  footer: {
    offline: "Todo ocurre en tu navegador · 100% offline",
    back: "← Atrás",
    restart: "↺ Empezar de nuevo",
  },
  accents: {
    indigo: "Índigo",
    blue: "Azul",
    cyan: "Cian",
    green: "Verde",
    magenta: "Magenta",
  },
  languages: {
    es: "Español",
    en: "English",
    pt: "Português",
  },
} as const;

export default es;
