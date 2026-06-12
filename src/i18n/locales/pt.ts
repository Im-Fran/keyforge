const pt = {
  header: {
    subtitle: "Gerador de tokens secretos",
    badge: "CSPRNG local · sem servidor",
    settings: {
      title: "Força da entropia",
      description:
        "Algoritmo usado para derivar a chave a partir do pool de entropia.",
    },
    tooltips: {
      tweaks: "Ajustes",
      toggleTheme: "Alternar tema",
    },
  },
  stepper: {
    stepLabel: "Passo {{n}}",
    goTo: "Ir para o passo {{n}}",
    unavailable: "Ainda não disponível",
    steps: {
      system: "Entropia do sistema",
      human: "Entropia humana",
      result: "Sua chave",
    },
  },
  systemEntropy: {
    title: "Colete aleatoriedade do seu dispositivo",
    sub: "Lemos fontes locais imprevisíveis: o gerador criptográfico do navegador, relógios de alta precisão, ruído de temporização e características do ambiente. Nada sai do seu dispositivo.",
    optional: "opcional",
    addMore: "Adicionar mais entropia · opcional",
    uploadImage: "Enviar imagem",
    changeImage: "Trocar imagem",
    useCamera: "Usar câmera",
    recaptureCamera: "Recapturar câmera",
    collecting: "Coletando…",
    collectBtn: "Coletar entropia do sistema",
    continueBtn: "Continuar",
    modal: {
      bytesContributed: "{{n}} bytes contribuídos ao pool",
      valueRead: "Valor lido",
      hexDump: "Despejo hexadecimal",
      noData: "(sem dados)",
      close: "Fechar",
    },
    camera: {
      error: "Não foi possível acessar a câmera. Verifique as permissões do navegador.",
      cancel: "Cancelar",
      capture: "Capturar frame",
    },
    iconTooltips: {
      info: "Ver detalhes dos valores",
      regen: "Regenerar esta fonte",
      remove: "Remover",
    },
    imageRow: {
      label: "Imagem enviada",
      hint: "Pixels da sua imagem",
      detail: "{{name}} · {{w}}×{{h}} px amostrados · {{bytes}} bytes",
    },
    cameraRow: {
      label: "Câmera ao vivo",
      hint: "Frame capturado",
      detail: "Frame ao vivo · {{w}}×{{h}} px · {{bytes}} bytes",
    },
    hexDumpMore: "…  (+{{n}} bytes a mais)",
    sources: {
      csprng: {
        label: "crypto.getRandomValues",
        hint: "256 bits do CSPRNG do sistema",
      },
      hires: {
        label: "performance.now()",
        hint: "Relógio de alta resolução",
      },
      clock: {
        label: "Date.now()",
        hint: "Carimbo de data/hora do sistema",
      },
      screen: {
        label: "Tela & viewport",
        hint: "Resolução, densidade de pixels",
      },
      agent: {
        label: "Plataforma & idioma",
        hint: "navigator: UA, idioma, núcleos",
      },
      mem: {
        label: "Heap & jitter",
        hint: "Memória e ruído de temporização",
      },
    },
  },
  humanEntropy: {
    title: "Adicione seu próprio acaso",
    sub: "Mova o cursor dentro do quadro de forma errática. Cada micro-movimento, sua velocidade e seu tempo exato são imprevisíveis até para você — nós os misturamos com a entropia do sistema.",
    moveHere: "Mova o mouse aqui dentro",
    erratic: "quanto mais errático, melhor",
    collecting: "Coleta de entropia humana",
    sufficient: "Entropia suficiente",
    keepMoving: "Continue movendo… {{pct}}%",
    generateBtn: "Gerar chave",
  },
  keyResult: {
    title: "Sua chave secreta está pronta",
    sub: "Gerada localmente misturando a entropia do sistema e seus movimentos. Nunca é transmitida nem armazenada em lugar algum.",
    tokenType: "Tipo de token",
    strength: "Força",
    digits: "Dígitos",
    bits: "{{n}} bits",
    digitCount: "{{n}} dígitos",
    secret: "Secreto",
    keyMeta: "{{algo}} · {{chars}} car · ~{{bits}} bits",
    generating: "gerando…",
    resistance: "Resistência {{label}}",
    entropyBits: "~{{n}} bits de entropia",
    hide: "Ocultar",
    show: "Mostrar",
    download: "Baixar",
    regenerate: "Regenerar",
    copy: "Copiar",
    copied: "Copiado",
    strength_levels: {
      excellent: "Excelente",
      strong: "Forte",
      moderate: "Moderada",
      low: "Baixa",
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
    title: "Ajustes",
    close: "Fechar",
    sections: {
      appearance: "Aparência",
      generator: "Gerador",
      security: "Segurança",
    },
    rows: {
      accentColor: "Cor de destaque",
      darkMode: "Modo escuro",
      defaultType: "Tipo padrão",
      derivationAlgo: "Algoritmo de derivação",
      language: "Idioma",
    },
  },
  algos: {
    "SHA-256": {
      hint: "Rápido e padrão · predefinido",
      tag: "Padrão",
    },
    "SHA-512": {
      hint: "Hash mais largo de 512 bits",
      tag: "Largo",
    },
    PBKDF2: {
      hint: "Reforçado · 210.000 iterações (key stretching)",
      tag: "Reforçado",
    },
  },
  poolBar: {
    label: "Pool de entropia",
    bytes: "bytes",
    fingerprint: "impressão",
  },
  footer: {
    offline: "Tudo acontece no seu navegador · 100% offline",
    back: "← Voltar",
    restart: "↺ Começar de novo",
  },
  accents: {
    indigo: "Índigo",
    blue: "Azul",
    cyan: "Ciano",
    green: "Verde",
    magenta: "Magenta",
  },
  languages: {
    es: "Español",
    en: "English",
    pt: "Português",
  },
} as const;

export default pt;
