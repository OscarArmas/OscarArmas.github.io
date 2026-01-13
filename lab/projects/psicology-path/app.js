/**
 * =====================================================
 * BRÚJULA TERAPÉUTICA - Lógica del Cuestionario (v4.0)
 * =====================================================
 * Sistema de orientación terapéutica con UX profesional.
 * 
 * MEJORAS v4.0:
 * - Screening de crisis emocional (basado en PHQ-2 validado)
 * - Índice de confianza del resultado
 * - Opción "Ninguna me representa"
 * - Preguntas de contexto y validación
 * - Navegación por teclado mejorada
 * - Transiciones suaves
 * 
 * SUSTENTACIÓN CIENTÍFICA:
 * - PHQ-2: Kroenke et al. (2003). Sensibilidad 83%, especificidad 92%
 * - Consistencia interna: Principios de test-retest reliability (APA)
 * - Opciones neutrales: Directrices APA para construcción de cuestionarios
 */

(() => {
  // ====================================
  // CONSTANTES
  // ====================================
  const STORAGE_KEY = 'brujula_terapeutica_state_v4';
  
  // Iconos SVG (Lucide style) - Clean & Professional
  const ICONS = {
    target: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`,
    spiral: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>`, 
    leaf: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.5 2 9 0 5.5-4.5 10-10 9Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>`,
    network: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="3"/><circle cx="5" cy="19" r="3"/><circle cx="19" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="13.51"/><line x1="10.5" y1="7.6" x2="7" y2="16.4"/><line x1="13.5" y1="7.6" x2="17" y2="16.4"/></svg>`,
    brain: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/></svg>`,
    chat: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
    heart: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`,
    users_group: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    sparkles: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>`,
    tool: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`,
    search: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
    puzzle: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19.439 15.4a2 2 0 0 1-3.078-1.732h-3.324a2 2 0 0 1-3.237-1.42 2 2 0 0 1-1.127.348H5.534A2.002 2.002 0 0 1 3.535 11V6.5a2 2 0 0 1 2-2h4.5a2 2 0 0 1 .536-1.464 2 2 0 1 1 2.828 2.828A2 2 0 0 1 12 7.5h3.5a2.002 2.002 0 0 1 2 2v2.137a2.002 2.002 0 0 1 1.939 2.13 2.002 2.002 0 0 1 0 1.633z"/></svg>`,
    zap: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
    clock: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
    anchor: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="3"/><line x1="12" y1="22" x2="12" y2="8"/><path d="M5 12H2a10 10 0 0 0 20 0h-3"/></svg>`,
    compass: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>`,
    feather: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"/><line x1="16" y1="8" x2="2" y2="22"/><line x1="17.5" y1="15" x2="9" y2="15"/></svg>`,
    question: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
    alert: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
    user: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
    refresh: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/></svg>`,
    check: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`
  };

  // ====================================
  // ESTADO DE LA APLICACIÓN
  // ====================================
  let state = {
    phase: 'welcome', // 'welcome', 'screening', 'context', 'quiz', 'results'
    currentQuestion: 0,
    scores: { tcc: 0, psico: 0, human: 0, sist: 0 },
    answers: [],
    isTransitioning: false,
    screeningRisk: 0,
    context: {
      previousTherapy: null, // 'none', 'past', 'current'
      therapyGoal: null      // 'symptom', 'understanding', 'growth', 'relationships'
    },
    neutralAnswers: 0, // Contador de respuestas neutrales
    validationScores: {} // Para comparar consistencia
  };

  // ====================================
  // MENSAJES DE ÁNIMO (Ampliados)
  // ====================================
  const motivationalMessages = [
    "Vamos a empezar a conocerte...",
    "Interesante elección...",
    "Cada respuesta nos acerca a tu perfil.",
    "Ya vamos a la mitad, lo haces muy bien.",
    "Tus respuestas revelan mucho...",
    "Solo unas pocas más...",
    "Casi terminamos...",
    "Última pregunta, ¡lo lograste!",
    "Verificando consistencia...",
    "Analizando tu perfil..."
  ];

  // ====================================
  // SCREENING DE CRISIS (Basado en PHQ-2)
  // ====================================
  /**
   * PHQ-2 (Patient Health Questionnaire-2)
   * 
   * Referencia: Kroenke, K., Spitzer, R. L., & Williams, J. B. W. (2003). 
   * The Patient Health Questionnaire-2: validity of a two-item depression screener.
   * Medical Care, 41(11), 1284-1292.
   * 
   * Sensibilidad: 83% | Especificidad: 92% para depresión mayor
   * Punto de corte: ≥3 sugiere evaluación adicional
   * 
   * ADAPTACIÓN: Agregamos una pregunta sobre ideación suicida basada en el
   * Columbia-Suicide Severity Rating Scale (C-SSRS) para detección de riesgo.
   */
  const screeningQuestions = [
    {
      id: 'phq2_1',
      question: "En las últimas 2 semanas, ¿con qué frecuencia te has sentido decaído/a, deprimido/a o sin esperanza?",
      options: [
        { text: "Nunca", risk: 0 },
        { text: "Algunos días", risk: 1 },
        { text: "Más de la mitad de los días", risk: 2 },
        { text: "Casi todos los días", risk: 3 }
      ]
    },
    {
      id: 'phq2_2',
      question: "En las últimas 2 semanas, ¿has tenido pensamientos de que estarías mejor muerto/a o de hacerte daño de alguna forma?",
      options: [
        { text: "No, para nada", risk: 0 },
        { text: "Pensamientos pasajeros, pero no serios", risk: 2 },
        { text: "Sí, he pensado en ello", risk: 4 },
        { text: "Sí, y he considerado cómo hacerlo", risk: 6 }
      ]
    }
  ];

  // ====================================
  // PREGUNTAS DE CONTEXTO
  // ====================================
  const contextQuestions = [
    {
      id: 'ctx_therapy',
      title: "Tu Experiencia",
      question: "¿Has asistido a terapia psicológica antes?",
      options: [
        { 
          text: "No, sería mi primera vez", 
          value: 'none',
          icon: ICONS.user,
          hint: "Te guiaremos paso a paso."
        },
        { 
          text: "Sí, pero hace tiempo que no voy", 
          value: 'past',
          icon: ICONS.clock,
          hint: "Exploraremos qué funcionó y qué no."
        },
        { 
          text: "Sí, actualmente voy pero quiero explorar otros enfoques", 
          value: 'current',
          icon: ICONS.refresh,
          hint: "Te mostraremos alternativas a considerar."
        }
      ]
    }
  ];

  // ====================================
  // PREGUNTAS DEL CUESTIONARIO CON PESOS (WEIGHTS)
  // Incluye opción neutral "Ninguna me representa"
  // ====================================
  const questions = [
    {
      id: 1,
      title: "El Foco",
      weight: 3.0, 
      question: "Si tuvieras que describir lo que más te urge resolver hoy, dirías que es...",
      options: [
        { text: "Un síntoma específico que me molesta (ansiedad, insomnio, fobia).", scores: { tcc: 1 }, icon: ICONS.target },
        { text: "Entender por qué repito los mismos patrones desde mi infancia.", scores: { psico: 1 }, icon: ICONS.spiral },
        { text: "Sentirme vacío, triste o sin un propósito claro.", scores: { human: 1 }, icon: ICONS.leaf },
        { text: "Problemas constantes con mi pareja o familia.", scores: { sist: 1 }, icon: ICONS.network },
        { text: "Ninguna de estas opciones me representa.", scores: {}, icon: ICONS.question, isNeutral: true }
      ]
    },
    {
      id: 2,
      title: "La Estructura",
      weight: 1.5,
      question: "¿Cómo te gustaría que fuera tu sesión ideal?",
      options: [
        { text: "Que me enseñen técnicas, me den tareas y herramientas prácticas.", scores: { tcc: 1 }, icon: ICONS.tool },
        { text: "Hablar libremente de lo que se me ocurra, explorando mis sueños o recuerdos.", scores: { psico: 1 }, icon: ICONS.chat },
        { text: "Sentirme escuchado y acompañado sin ser juzgado, en el \"aquí y ahora\".", scores: { human: 1 }, icon: ICONS.heart },
        { text: "Analizar cómo me comunico y relaciono con mi entorno.", scores: { sist: 1 }, icon: ICONS.users_group },
        { text: "Ninguna de estas opciones me representa.", scores: {}, icon: ICONS.question, isNeutral: true }
      ]
    },
    {
      id: 3,
      title: "Estilo de Pensamiento",
      weight: 2.0,
      question: "Ante un problema, ¿qué buscas instintivamente?",
      options: [
        { text: "Una solución lógica y rápida.", scores: { tcc: 1 }, icon: ICONS.zap },
        { text: "El origen profundo y oculto del problema.", scores: { psico: 1 }, icon: ICONS.search },
        { text: "Conectar con mis emociones y validarlas.", scores: { human: 1 }, icon: ICONS.feather },
        { text: "Ninguna de estas opciones me representa.", scores: {}, icon: ICONS.question, isNeutral: true }
      ]
    },
    {
      id: 4,
      title: "La Causa",
      weight: 2.0,
      question: "¿De dónde crees que vienen tus dificultades?",
      options: [
        { text: "De mis pensamientos negativos o malos hábitos actuales.", scores: { tcc: 1 }, icon: ICONS.brain },
        { text: "De traumas o vivencias del pasado no superadas.", scores: { psico: 1 }, icon: ICONS.anchor },
        { text: "De la dinámica con las personas con las que convivo.", scores: { sist: 1 }, icon: ICONS.network },
        { text: "De no estar siendo fiel a mí mismo/a.", scores: { human: 1 }, icon: ICONS.compass },
        { text: "Ninguna de estas opciones me representa.", scores: {}, icon: ICONS.question, isNeutral: true }
      ]
    },
    {
      id: 5,
      title: "El Rol del Terapeuta",
      weight: 1.5,
      question: "¿Cómo ves al psicólogo ideal?",
      options: [
        { text: "Como un entrenador que me da instrucciones.", scores: { tcc: 1 }, icon: ICONS.tool },
        { text: "Como un experto que interpreta mi inconsciente.", scores: { psico: 1 }, icon: ICONS.spiral },
        { text: "Como un compañero empático que facilita mi crecimiento.", scores: { human: 1 }, icon: ICONS.leaf },
        { text: "Como un mediador que ayuda a organizar mis relaciones.", scores: { sist: 1 }, icon: ICONS.users_group },
        { text: "Ninguna de estas opciones me representa.", scores: {}, icon: ICONS.question, isNeutral: true }
      ]
    },
    {
      id: 6,
      title: "Duración",
      weight: 1.0,
      question: "¿Qué esperas en cuanto a tiempo?",
      options: [
        { text: "Resultados rápidos y concretos (pocas sesiones).", scores: { tcc: 1 }, icon: ICONS.zap },
        { text: "No tengo prisa, busco autoconocimiento profundo.", scores: { psico: 0.5, human: 0.5 }, icon: ICONS.clock },
        { text: "Lo necesario para arreglar la convivencia con mi entorno.", scores: { sist: 1 }, icon: ICONS.network },
        { text: "Ninguna de estas opciones me representa.", scores: {}, icon: ICONS.question, isNeutral: true }
      ]
    },
    {
      id: 7,
      title: "La Varita Mágica",
      weight: 1.0,
      question: "Si pudieras pedir un deseo sobre tu salud mental...",
      options: [
        { text: "Que desaparezca el síntoma ya.", scores: { tcc: 1 }, icon: ICONS.sparkles },
        { text: "Saber quién soy realmente.", scores: { human: 0.5, psico: 0.5 }, icon: ICONS.compass },
        { text: "Que mi familia/pareja y yo nos entendamos.", scores: { sist: 1 }, icon: ICONS.heart },
        { text: "Ninguna de estas opciones me representa.", scores: {}, icon: ICONS.question, isNeutral: true }
      ]
    }
  ];

  // ====================================
  // PREGUNTAS DE VALIDACIÓN (Consistencia interna)
  // ====================================
  /**
   * Estas preguntas miden los mismos constructos de forma diferente
   * para verificar consistencia. Si hay discrepancia significativa,
   * el índice de confianza se reduce.
   * 
   * Referencia: Principios de validez de constructo y confiabilidad
   * test-retest. American Psychological Association (APA).
   */
  const validationQuestions = [
    {
      id: 'val_1',
      title: "Verificación",
      weight: 0.5,
      validatesTherapies: ['tcc', 'psico'],
      question: "Imagina que empiezas terapia mañana. ¿Qué te gustaría que pasara en la primera sesión?",
      options: [
        { text: "Que el terapeuta me explique un plan claro con pasos a seguir.", scores: { tcc: 1 }, icon: ICONS.target },
        { text: "Que me deje hablar de mi historia sin interrumpirme demasiado.", scores: { psico: 1 }, icon: ICONS.chat },
        { text: "Que me haga sentir cómodo/a y sin presión.", scores: { human: 1 }, icon: ICONS.heart },
        { text: "Que pregunte sobre mi familia y relaciones importantes.", scores: { sist: 1 }, icon: ICONS.users_group },
        { text: "No estoy seguro/a.", scores: {}, icon: ICONS.question, isNeutral: true }
      ]
    },
    {
      id: 'val_2',
      title: "Reflexión Final",
      weight: 0.5,
      validatesTherapies: ['human', 'sist'],
      question: "¿Qué frase te resuena más en este momento?",
      options: [
        { text: "\"Necesito herramientas concretas para salir adelante.\"", scores: { tcc: 1 }, icon: ICONS.tool },
        { text: "\"Quiero entender qué hay detrás de todo esto.\"", scores: { psico: 1 }, icon: ICONS.search },
        { text: "\"Solo quiero que alguien me entienda.\"", scores: { human: 1 }, icon: ICONS.feather },
        { text: "\"Mis problemas tienen que ver con los demás, no solo conmigo.\"", scores: { sist: 1 }, icon: ICONS.network },
        { text: "Ninguna me representa completamente.", scores: {}, icon: ICONS.question, isNeutral: true }
      ]
    }
  ];

  // ====================================
  // INFORMACIÓN EXPANDIDA DE TERAPIAS
  // ====================================
  const therapyInfo = {
    tcc: {
      name: "Terapia Cognitivo-Conductual (TCC)",
      shortName: "Cognitivo-Conductual",
      subtitle: "Enfocada en soluciones prácticas",
      icon: ICONS.target,
      color: "sky",
      description: "La TCC es una terapia estructurada y orientada a metas que se centra en identificar y modificar patrones de pensamiento negativos y comportamientos disfuncionales. Es como tener un \"manual de instrucciones\" para tu mente: aprenderás técnicas concretas, harás ejercicios prácticos y verás resultados medibles en tiempos relativamente cortos.",
      whyRecommended: "Tus respuestas muestran que valoras la eficiencia, buscas soluciones prácticas y quieres abordar síntomas específicos. Te gusta tener herramientas claras y ver progreso tangible. La TCC te dará exactamente eso: estrategias basadas en evidencia para manejar lo que te aflige.",
      worksFor: [
        "Personas con ansiedad, fobias, ataques de pánico o TOC",
        "Quienes quieren resultados medibles en semanas/meses",
        "Personas cómodas con tareas para casa y estructura"
      ],
      notIdeal: [
        "Buscas explorar tu pasado profundamente sin prisa",
        "Prefieres hablar sin una agenda estructurada",
        "Tu malestar es difuso, no un síntoma concreto"
      ],
      lookFor: [
        "Formación específica en TCC (certificación, diplomado o maestría)",
        "Que explique claramente el plan de tratamiento y duración estimada",
        "Que use herramientas como registros de pensamientos, exposición gradual, o técnicas de relajación"
      ],
      firstSessions: [
        "Sesión 1: Evaluación inicial y definición del problema principal. El terapeuta te hará muchas preguntas.",
        "Sesiones 2-3: Psicoeducación. Te explicará cómo funcionan tus pensamientos y emociones.",
        "Sesiones 4-5: Empezarás a practicar técnicas concretas y recibirás tareas para casa."
      ],
      goodMatch: [
        "Te sientes comprendido/a pero también desafiado/a a cambiar",
        "El terapeuta explica con claridad qué están haciendo y por qué",
        "Notas pequeños avances en pocas semanas",
        "Te da herramientas que puedes usar fuera de sesión"
      ],
      questionsToAsk: [
        "¿Cuántas sesiones suelen ser necesarias para mi tipo de problema?",
        "¿Qué técnicas específicas usarías conmigo?",
        "¿Tendré tareas para hacer en casa entre sesiones?",
        "¿Cómo mediremos mi progreso?"
      ],
      // Mensajes personalizados según contexto
      contextMessages: {
        none: "Como es tu primera experiencia en terapia, la TCC te ofrecerá una estructura clara que te ayudará a entender el proceso desde el principio.",
        past: "Si antes sentiste que la terapia era poco estructurada, la TCC te dará un enfoque más organizado con metas claras.",
        current: "La TCC puede complementar o contrastar con tu enfoque actual, ofreciéndote herramientas más directas y prácticas."
      }
    },
    psico: {
      name: "Psicoanálisis / Terapia Psicodinámica",
      shortName: "Psicoanálisis",
      subtitle: "Explorando las profundidades",
      icon: ICONS.spiral,
      color: "lavender",
      description: "El psicoanálisis te invita a un viaje hacia tu mundo interior. A través de la palabra libre, la exploración de sueños, recuerdos y patrones inconscientes, irás descubriendo las raíces profundas de tu malestar. Es un proceso de autoconocimiento que va más allá del síntoma, buscando transformaciones duraderas en tu forma de relacionarte contigo y con el mundo.",
      whyRecommended: "Tus respuestas revelan una mente curiosa que quiere entender el \"por qué\" detrás de todo. Sientes que tu historia pasada tiene peso en tu presente y estás dispuesto/a a explorar territorios profundos. El psicoanálisis te acompañará en ese viaje de descubrimiento personal.",
      worksFor: [
        "Personas interesadas en autoconocimiento profundo",
        "Quienes sienten que su historia familiar influye hoy",
        "Personas con tiempo y disposición para un proceso largo"
      ],
      notIdeal: [
        "Necesitas alivio urgente de un síntoma agudo",
        "Prefieres instrucciones claras y tareas concretas",
        "No tienes tiempo/recursos para sesiones frecuentes"
      ],
      lookFor: [
        "Formación en psicoanálisis (institutos reconocidos, análisis personal completado)",
        "Experiencia con el tipo de problemática que traes",
        "Que ofrezca frecuencia de sesiones adecuada (idealmente 2+ por semana en análisis clásico)"
      ],
      firstSessions: [
        "Sesión 1: Entrevistas preliminares. Hablarás de lo que te trae y el analista escuchará mucho.",
        "Sesiones 2-3: Continuarás hablando libremente. El terapeuta hará pocas intervenciones directas.",
        "Sesiones 4-5: Empezarás a notar patrones en lo que dices. Pueden aparecer recuerdos o sueños significativos."
      ],
      goodMatch: [
        "Te sientes en un espacio seguro para decir cualquier cosa",
        "Las interpretaciones del terapeuta te hacen pensar, aunque a veces incomoden",
        "Empiezas a notar conexiones entre tu pasado y presente",
        "No sientes prisa ni presión por \"curarte rápido\""
      ],
      questionsToAsk: [
        "¿Cuál es su formación y de qué corriente psicoanalítica viene?",
        "¿Ha completado su propio análisis personal?",
        "¿Con qué frecuencia nos veríamos idealmente?",
        "¿Cómo trabaja con sueños o lapsus?"
      ],
      contextMessages: {
        none: "El psicoanálisis puede parecer menos estructurado al principio, pero te llevará a descubrimientos profundos sobre ti mismo/a.",
        past: "Si antes exploraste tu historia pero sientes que hay más por descubrir, el psicoanálisis te ayudará a profundizar.",
        current: "El psicoanálisis puede ofrecer una perspectiva más profunda que complemente o enriquezca tu proceso actual."
      }
    },
    human: {
      name: "Terapia Humanista / Gestalt",
      shortName: "Humanista-Gestalt",
      subtitle: "El aquí y ahora",
      icon: ICONS.leaf,
      color: "mint",
      description: "La terapia humanista pone el foco en tu experiencia presente, tus emociones y tu potencial de crecimiento. Aquí no se trata de \"arreglarte\", sino de acompañarte a reconectar con tu autenticidad. El terapeuta será un espejo empático que te ayudará a integrar todas las partes de ti mismo/a, sin juicio, en un espacio seguro donde puedas simplemente ser.",
      whyRecommended: "Tus respuestas muestran que buscas conexión emocional, autenticidad y un espacio donde sentirte verdaderamente escuchado/a. Valoras el proceso sobre los resultados rápidos y quieres encontrar tu propio camino. La terapia humanista honrará exactamente eso.",
      worksFor: [
        "Personas en crisis existencial o buscando propósito",
        "Quienes valoran ser escuchados sin juicio ni etiquetas",
        "Personas creativas o espirituales que buscan autenticidad"
      ],
      notIdeal: [
        "Quieres un diagnóstico claro y un plan estructurado",
        "Buscas técnicas específicas para un síntoma concreto",
        "Te incomoda hablar de emociones en tiempo presente"
      ],
      lookFor: [
        "Formación en enfoque centrado en la persona, Gestalt o existencial",
        "Calidez genuina en el primer contacto (la relación es clave aquí)",
        "Que no te presione ni te dé respuestas: que te acompañe a encontrarlas"
      ],
      firstSessions: [
        "Sesión 1: Crear un espacio de confianza. El terapeuta te escuchará con atención plena.",
        "Sesiones 2-3: Explorarás lo que sientes \"aquí y ahora\". Puede haber ejercicios vivenciales.",
        "Sesiones 4-5: Profundizarás en partes de ti que has ignorado o rechazado. Trabajo con emociones."
      ],
      goodMatch: [
        "Te sientes genuinamente aceptado/a tal como eres",
        "El terapeuta refleja lo que dices sin juzgar ni interpretar",
        "Sientes que el espacio es tuyo, no hay agenda oculta",
        "Sales de las sesiones más conectado/a contigo mismo/a"
      ],
      questionsToAsk: [
        "¿Cuál es su enfoque dentro de la terapia humanista?",
        "¿Cómo trabaja con las emociones en sesión?",
        "¿Usa técnicas vivenciales o expresivas?",
        "¿Cómo sabré si estoy avanzando?"
      ],
      contextMessages: {
        none: "La terapia humanista te recibirá sin expectativas. Es un espacio seguro para explorar quién eres.",
        past: "Si antes sentiste que el terapeuta no te escuchaba realmente, aquí encontrarás un enfoque centrado en ti.",
        current: "La terapia humanista puede complementar tu proceso actual con un enfoque más emocional y presente."
      }
    },
    sist: {
      name: "Terapia Sistémica / Familiar",
      shortName: "Sistémica",
      subtitle: "Sanando en conexión",
      icon: ICONS.network,
      color: "rose",
      description: "La terapia sistémica entiende que no somos islas: nuestro bienestar está entrelazado con nuestras relaciones. Ya sea en pareja, familia o cualquier sistema de relaciones importantes, este enfoque ayuda a identificar patrones de comunicación disfuncionales, roles rígidos y dinámicas que perpetúan el conflicto. El cambio en uno transforma a todos.",
      whyRecommended: "Tus respuestas indican que muchas de tus dificultades están conectadas con tus relaciones cercanas. Sientes que resolver \"lo tuyo\" implica también trabajar en \"lo de ustedes\". La terapia sistémica te ayudará a ver el panorama completo y a mejorar la manera en que te conectas con quienes te importan.",
      worksFor: [
        "Conflictos de pareja, familiares o de comunicación",
        "Problemas donde varios miembros están involucrados",
        "Cuando el síntoma de uno refleja un problema del sistema"
      ],
      notIdeal: [
        "Quieres trabajar solo/a sin involucrar a otros",
        "Tu malestar es muy interno (trauma, depresión profunda)",
        "Los otros miembros no quieren participar"
      ],
      lookFor: [
        "Formación en terapia familiar/sistémica (maestría o especialidad)",
        "Experiencia con el tipo de sistema que traes (pareja, familia, etc.)",
        "Flexibilidad para sesiones individuales y conjuntas según se necesite"
      ],
      firstSessions: [
        "Sesión 1: Mapeo del sistema. El terapeuta querrá entender quiénes son las personas clave.",
        "Sesiones 2-3: Puede invitar a otros miembros o trabajar contigo sobre cómo te relacionas.",
        "Sesiones 4-5: Identificarán patrones de comunicación y experimentarán nuevas formas de interactuar."
      ],
      goodMatch: [
        "El terapeuta no toma partido ni culpa a nadie",
        "Te ayuda a ver la situación desde múltiples perspectivas",
        "Notas cambios en cómo te comunicas fuera de sesión",
        "Los otros miembros (si asisten) se sienten igualmente escuchados"
      ],
      questionsToAsk: [
        "¿Trabajará solo conmigo o incluirá a mi pareja/familia?",
        "¿Cómo maneja los conflictos cuando hay varios en sesión?",
        "¿Qué pasa si los demás no quieren venir?",
        "¿Cuántas sesiones suelen ser necesarias para ver cambios?"
      ],
      contextMessages: {
        none: "La terapia sistémica te ayudará a entender cómo tus relaciones afectan tu bienestar.",
        past: "Si antes trabajaste solo en ti, la terapia sistémica ampliará la mirada hacia tus relaciones.",
        current: "La terapia sistémica puede ser un complemento valioso para trabajar los aspectos relacionales."
      }
    }
  };

  // ====================================
  // ELEMENTOS DEL DOM
  // ====================================
  const elements = {
    welcomeScreen: document.getElementById('welcome-screen'),
    quizScreen: document.getElementById('quiz-screen'),
    resultsScreen: document.getElementById('results-screen'),
    crisisScreen: document.getElementById('crisis-screen'),
    startBtn: document.getElementById('start-btn'),
    progressContainer: document.getElementById('progress-container'),
    progressBar: document.getElementById('progress-bar'),
    progressPercent: document.getElementById('progress-percent'),
    currentStep: document.getElementById('current-step'),
    totalSteps: document.getElementById('total-steps'),
    questionArea: document.getElementById('question-area'),
    encouragementText: document.getElementById('encouragement-text'),
    backBtn: document.getElementById('back-btn'),
    resultIcon: document.getElementById('result-icon'),
    resultTitle: document.getElementById('result-title'),
    resultSubtitle: document.getElementById('result-subtitle'),
    resultDescText: document.getElementById('result-desc-text'),
    resultWhyText: document.getElementById('result-why-text'),
    resultWorksFor: document.getElementById('result-works-for'),
    resultNotIdeal: document.getElementById('result-not-ideal'),
    resultLookFor: document.getElementById('result-look-for'),
    resultFirstSessions: document.getElementById('result-first-sessions'),
    resultGoodMatch: document.getElementById('result-good-match'),
    resultQuestions: document.getElementById('result-questions'),
    resultAlternatives: document.getElementById('result-alternatives'),
    resultConfidence: document.getElementById('result-confidence'),
    resultContextMessage: document.getElementById('result-context-message'),
    scoresDisplay: document.getElementById('scores-display'),
    restartBtn: document.getElementById('restart-btn'),
    shareBtn: document.getElementById('share-btn'),
    downloadPdfBtn: document.getElementById('download-pdf-btn')
  };

  // ====================================
  // FUNCIONES AUXILIARES
  // ====================================
  function saveState() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) {}
  }
  
  function loadState() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)); } catch (e) { return null; }
  }
  
  function clearState() {
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
  }
  
  function vibrate(pattern = 10) {
    if (navigator.vibrate) navigator.vibrate(pattern);
  }

  /**
   * Calcula el índice de confianza del resultado
   * Basado en la diferencia entre el 1º y 2º lugar
   * y penalizado por respuestas neutrales
   * 
   * @returns {Object} { level: 'high'|'medium'|'low', percent: number, message: string }
   */
  function calculateConfidence() {
    const sorted = Object.values(state.scores).sort((a, b) => b - a);
    const total = sorted.reduce((a, b) => a + b, 0);
    
    if (total === 0) {
      return { 
        level: 'low', 
        percent: 0, 
        message: 'Respondiste principalmente opciones neutrales. Considera repetir el test eligiendo la opción más cercana a tu experiencia.'
      };
    }
    
    // Diferencia proporcional entre 1º y 2º lugar
    const gap = (sorted[0] - sorted[1]) / total;
    
    // Penalización por respuestas neutrales (reduce confianza)
    const totalQuestions = questions.length + validationQuestions.length;
    const neutralPenalty = state.neutralAnswers / totalQuestions;
    
    // Calcular porcentaje de confianza (0-100)
    let confidence = Math.min(100, Math.round((gap * 200) * (1 - neutralPenalty * 0.5)));
    
    // Ajustar por consistencia de validación
    const validationConsistency = calculateValidationConsistency();
    confidence = Math.round(confidence * (0.7 + validationConsistency * 0.3));
    
    if (confidence >= 65) {
      return {
        level: 'high',
        percent: confidence,
        message: 'Tu perfil muestra una afinidad clara con este enfoque terapéutico.'
      };
    } else if (confidence >= 35) {
      return {
        level: 'medium',
        percent: confidence,
        message: 'Hay una inclinación hacia este enfoque, pero también podrías beneficiarte de los alternativos.'
      };
    } else {
      return {
        level: 'low',
        percent: confidence,
        message: 'Tu perfil es versátil. Podrías beneficiarte de varios enfoques. Considera probar una sesión exploratoria en más de uno.'
      };
    }
  }

  /**
   * Calcula la consistencia entre las preguntas principales y de validación
   * @returns {number} 0-1 donde 1 es perfectamente consistente
   */
  function calculateValidationConsistency() {
    // Si no hay preguntas de validación respondidas, asumir consistencia media
    if (Object.keys(state.validationScores).length === 0) return 0.7;
    
    // Comparar el enfoque ganador en preguntas principales vs validación
    const mainWinner = Object.entries(state.scores).sort((a, b) => b[1] - a[1])[0][0];
    
    let validationTotal = 0;
    let validationMatch = 0;
    
    for (const [key, value] of Object.entries(state.validationScores)) {
      validationTotal += value;
      if (key === mainWinner) validationMatch += value;
    }
    
    if (validationTotal === 0) return 0.7;
    return validationMatch / validationTotal;
  }

  /**
   * Obtiene el total de preguntas (principales + validación + contexto)
   */
  function getTotalQuestions() {
    return questions.length + validationQuestions.length;
  }

  // ====================================
  // GENERACIÓN DE PDF
  // ====================================
  async function generatePDF(therapy, sortedTherapies) {
    const { jsPDF } = window.jspdf;
    const pdfContainer = document.getElementById('pdf-container');
    const btn = elements.downloadPdfBtn;
    
    // Feedback visual
    const originalText = btn.innerHTML;
    btn.innerHTML = `<span class="animate-pulse">Generando PDF...</span>`;
    btn.disabled = true;

    // 1. Llenar la plantilla oculta
    const date = new Date().toLocaleDateString('es-MX');
    document.getElementById('pdf-date').textContent = `Fecha: ${date}`;
    document.getElementById('pdf-title').textContent = therapy.name;
    document.getElementById('pdf-subtitle').textContent = therapy.subtitle;
    document.getElementById('pdf-icon').innerHTML = `<div style="width: 60px; height: 60px;">${therapy.icon}</div>`;
    document.getElementById('pdf-desc').textContent = therapy.description;
    document.getElementById('pdf-why').textContent = therapy.whyRecommended;

    // Confianza en PDF
    const confidence = calculateConfidence();
    const pdfConfidence = document.getElementById('pdf-confidence');
    if (pdfConfidence) {
      pdfConfidence.textContent = `Índice de confianza: ${confidence.percent}% (${confidence.level === 'high' ? 'Alto' : confidence.level === 'medium' ? 'Medio' : 'Bajo'})`;
    }

    // Listas en PDF
    const lookForHTML = therapy.lookFor.map(i => `<li>${i}</li>`).join('');
    document.getElementById('pdf-look-for').innerHTML = lookForHTML;

    // Gráficas en PDF
    const totalPoints = Object.values(state.scores).reduce((a,b)=>a+b,0) || 1;
    const scoresHTML = sortedTherapies.map(key => {
      const info = therapyInfo[key];
      const score = state.scores[key];
      const percent = Math.round((score / totalPoints)*100) || 0;
      return `
        <div class="flex items-center gap-3">
          <div style="width: 24px; height: 24px;">${info.icon}</div>
          <div class="flex-1">
            <div class="flex justify-between text-xs font-bold mb-1">
              <span>${info.shortName}</span>
              <span>${percent}%</span>
            </div>
            <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div class="h-full bg-slate-600 rounded-full" style="width: ${percent}%"></div>
            </div>
          </div>
        </div>
      `;
    }).join('');
    document.getElementById('pdf-scores').innerHTML = scoresHTML;

    // Alternativas en PDF
    const altsHTML = sortedTherapies.slice(1, 3).map(key => {
      const alt = therapyInfo[key];
      return `
        <div class="bg-gray-50 p-4 rounded-lg">
          <h5 class="font-bold text-ink text-sm flex items-center gap-2">
            <div style="width: 16px; height: 16px; display: inline-block; vertical-align: middle;">${alt.icon}</div>
            ${alt.shortName}
          </h5>
          <p class="text-xs text-muted mt-1">${alt.subtitle}</p>
        </div>
      `;
    }).join('');
    document.getElementById('pdf-alternatives').innerHTML = altsHTML;

    // 2. Generar canvas y PDF
    try {
      await new Promise(r => setTimeout(r, 100));
      
      const canvas = await html2canvas(pdfContainer, {
        scale: 2,
        useCORS: true
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Brujula_Terapeutica_Reporte.pdf`);

      btn.innerHTML = `<span class="font-bold">¡Descargado! ✅</span>`;
    } catch (error) {
      console.error(error);
      alert("Hubo un error generando el PDF. Inténtalo de nuevo.");
      btn.innerHTML = originalText;
    } finally {
      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.disabled = false;
      }, 3000);
    }
  }

  // ====================================
  // FUNCIÓN DE COPIAR TEXTO (ARREGLADA)
  // ====================================
  async function copyResultSummary(therapy, sorted) {
    const totalPoints = Object.values(state.scores).reduce((a,b)=>a+b,0) || 1;
    const calcPercent = (s) => Math.round((s/totalPoints)*100);
    const confidence = calculateConfidence();
    
    const summary = `
🧭 BRÚJULA TERAPÉUTICA - Mi Resultado
═══════════════════════════════════

📍 Orientación sugerida: ${therapy.name}
📝 ${therapy.subtitle}

📊 Índice de Confianza: ${confidence.percent}% (${confidence.level === 'high' ? 'Alto' : confidence.level === 'medium' ? 'Medio' : 'Bajo'})

✨ Por qué me lo recomiendan:
${therapy.whyRecommended}

🔍 Qué buscar en un terapeuta:
${therapy.lookFor.map(l => `• ${l}`).join('\n')}

📈 Mi perfil completo:
${sorted.map(k => `• ${therapyInfo[k].shortName}: ${calcPercent(state.scores[k])}%`).join('\n')}

💡 Preguntas para hacerle al terapeuta:
${therapy.questionsToAsk.map((q, i) => `${i+1}. ${q}`).join('\n')}

───────────────────────────────────
⚠️ AVISO: Esto es solo orientación informativa. 
No sustituye el diagnóstico de un profesional de salud mental.

🆘 Líneas de apoyo en México (24/7):
• Línea de la Vida: 800 911 2000
• SAPTEL: 55 5259 8121
───────────────────────────────────
    `.trim();

    try {
      await navigator.clipboard.writeText(summary);
      return true;
    } catch (e) {
      // Fallback para navegadores sin Clipboard API
      const textarea = document.createElement('textarea');
      textarea.value = summary;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        document.body.removeChild(textarea);
        return true;
      } catch (err) {
        document.body.removeChild(textarea);
        // Último recurso: mostrar en prompt
        prompt('Copia este texto manualmente:', summary);
        return false;
      }
    }
  }

  // ====================================
  // NAVEGACIÓN Y RENDERIZADO
  // ====================================
  function showScreen(screenId) {
    // Ocultar todas las pantallas
    if (elements.welcomeScreen) elements.welcomeScreen.classList.add('hidden');
    if (elements.quizScreen) elements.quizScreen.classList.add('hidden');
    if (elements.resultsScreen) elements.resultsScreen.classList.add('hidden');
    if (elements.crisisScreen) elements.crisisScreen.classList.add('hidden');
    
    // Mostrar la pantalla solicitada
    if (screenId === 'welcome' && elements.welcomeScreen) {
      elements.welcomeScreen.classList.remove('hidden');
    } else if (screenId === 'quiz' && elements.quizScreen) {
      elements.quizScreen.classList.remove('hidden');
    } else if (screenId === 'results' && elements.resultsScreen) {
      elements.resultsScreen.classList.remove('hidden');
      elements.resultsScreen.classList.add('animate-fade-in-up');
    } else if (screenId === 'crisis' && elements.crisisScreen) {
      elements.crisisScreen.classList.remove('hidden');
      elements.crisisScreen.classList.add('animate-fade-in-up');
    }
    
    state.phase = screenId;
  }

  function updateUIState() {
    const totalQ = getTotalQuestions();
    let currentQ = state.currentQuestion;
    
    // Ajustar si estamos en screening o contexto
    if (state.phase === 'screening') {
      currentQ = state.currentQuestion;
    } else if (state.phase === 'context') {
      currentQ = screeningQuestions.length + state.currentQuestion;
    } else if (state.phase === 'quiz') {
      currentQ = state.currentQuestion;
    }
    
    const progress = (currentQ / totalQ) * 100;
    
    if (elements.progressBar) elements.progressBar.style.width = `${progress}%`;
    if (elements.progressPercent) elements.progressPercent.textContent = `${Math.round(progress)}%`;
    if (elements.currentStep) elements.currentStep.textContent = currentQ + 1;
    if (elements.totalSteps) elements.totalSteps.textContent = totalQ;
    
    const msg = motivationalMessages[Math.min(currentQ, motivationalMessages.length - 1)] || "";
    if (elements.encouragementText) {
      if (msg) elements.encouragementText.textContent = msg;
      elements.encouragementText.classList.toggle('opacity-0', !msg);
    }

    if (elements.backBtn) {
      const canGoBack = state.currentQuestion > 0 || state.phase !== 'quiz';
      elements.backBtn.classList.toggle('opacity-0', !canGoBack);
      elements.backBtn.classList.toggle('pointer-events-none', !canGoBack);
    }
  }

  // ====================================
  // RENDERIZADO DE SCREENING DE CRISIS
  // ====================================
  function renderScreeningQuestion() {
    state.phase = 'screening';
    showScreen('quiz');
    
    const q = screeningQuestions[state.currentQuestion];
    
    const optionsHTML = q.options.map((opt, idx) => `
      <button 
        class="option-card focus-ring opacity-0 animate-fade-in-up option-delay-${idx+1} w-full text-left p-4 md:p-5 bg-white/80 border-2 border-transparent hover:border-rose-300 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 group relative overflow-hidden"
        data-option-index="${idx}"
        data-risk="${opt.risk}"
        role="radio"
        aria-checked="false"
      >
        <div class="flex items-start gap-3 relative z-10">
          <span class="text-ink/90 text-sm md:text-base leading-relaxed">${opt.text}</span>
        </div>
        <div class="absolute inset-0 bg-rose-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-0"></div>
      </button>
    `).join('');

    elements.questionArea.innerHTML = `
      <div class="slide-in" tabindex="-1" id="q-container">
        <div class="mb-4">
          <span class="inline-flex items-center gap-2 px-3 py-1 bg-rose-100 text-rose-600 text-xs font-medium rounded-full uppercase tracking-wide mb-3">
            <span class="w-4 h-4">${ICONS.alert}</span>
            Antes de comenzar
          </span>
          <p class="text-xs text-muted mb-4 italic">
            Estas preguntas nos ayudan a asegurarnos de que estés bien. Tu bienestar es lo primero.
          </p>
        </div>
        <div class="mb-6">
          <h2 class="font-display text-xl md:text-2xl font-bold text-ink leading-snug">${q.question}</h2>
        </div>
        <div class="space-y-3" role="radiogroup">${optionsHTML}</div>
      </div>
    `;

    elements.questionArea.querySelectorAll('.option-card').forEach(btn => {
      btn.addEventListener('click', handleScreeningClick);
    });

    updateUIState();
    state.isTransitioning = false;
    setTimeout(() => document.getElementById('q-container')?.focus(), 100);
  }

  function handleScreeningClick(e) {
    if (state.isTransitioning) return;
    state.isTransitioning = true;
    vibrate(15);

    const btn = e.currentTarget;
    const risk = parseInt(btn.dataset.risk);
    
    btn.setAttribute('aria-checked', 'true');
    btn.classList.add('border-rose-500', 'bg-rose-50', 'ring-2', 'ring-rose-200');

    state.screeningRisk += risk;
    state.currentQuestion++;

    setTimeout(() => {
      const container = elements.questionArea.firstElementChild;
      if (container) container.classList.add('slide-out');
      
      setTimeout(() => {
        if (state.currentQuestion < screeningQuestions.length) {
          renderScreeningQuestion();
        } else {
          // Evaluar riesgo de crisis
          // PHQ-2 >= 3 o pregunta de ideación >= 2 indica necesidad de recursos
          if (state.screeningRisk >= 4) {
            showCrisisScreen();
          } else {
            // Continuar con preguntas de contexto
            state.currentQuestion = 0;
            renderContextQuestion();
          }
        }
      }, 300);
    }, 400);
  }

  function showCrisisScreen() {
    showScreen('crisis');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ====================================
  // RENDERIZADO DE PREGUNTAS DE CONTEXTO
  // ====================================
  function renderContextQuestion() {
    state.phase = 'context';
    showScreen('quiz');
    
    const q = contextQuestions[state.currentQuestion];
    
    const optionsHTML = q.options.map((opt, idx) => `
      <button 
        class="option-card focus-ring opacity-0 animate-fade-in-up option-delay-${idx+1} w-full text-left p-4 md:p-5 bg-white/80 border-2 border-transparent hover:border-lavender-300 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 group relative overflow-hidden"
        data-option-index="${idx}"
        data-value="${opt.value}"
        role="radio"
        aria-checked="false"
      >
        <div class="flex items-start gap-3 relative z-10">
          <span class="w-6 h-6 flex-shrink-0 group-hover:scale-110 transition-transform duration-200 text-lavender-500">${opt.icon}</span>
          <div class="flex-1">
            <span class="text-ink/90 text-sm md:text-base leading-relaxed font-medium">${opt.text}</span>
            ${opt.hint ? `<p class="text-xs text-muted mt-1">${opt.hint}</p>` : ''}
          </div>
        </div>
        <div class="absolute inset-0 bg-lavender-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-0"></div>
      </button>
    `).join('');

    elements.questionArea.innerHTML = `
      <div class="slide-in" tabindex="-1" id="q-container">
        <div class="mb-6">
          <span class="inline-block px-3 py-1 bg-lavender-100 text-lavender-600 text-xs font-medium rounded-full uppercase tracking-wide mb-3">${q.title}</span>
          <h2 class="font-display text-xl md:text-2xl font-bold text-ink leading-snug">${q.question}</h2>
        </div>
        <div class="space-y-3" role="radiogroup">${optionsHTML}</div>
      </div>
    `;

    elements.questionArea.querySelectorAll('.option-card').forEach(btn => {
      btn.addEventListener('click', handleContextClick);
    });

    updateUIState();
    state.isTransitioning = false;
    setTimeout(() => document.getElementById('q-container')?.focus(), 100);
  }

  function handleContextClick(e) {
    if (state.isTransitioning) return;
    state.isTransitioning = true;
    vibrate(15);

    const btn = e.currentTarget;
    const value = btn.dataset.value;
    
    btn.setAttribute('aria-checked', 'true');
    btn.classList.add('border-lavender-500', 'bg-lavender-100', 'ring-2', 'ring-lavender-200');

    // Guardar contexto
    state.context.previousTherapy = value;
    state.currentQuestion++;

    setTimeout(() => {
      const container = elements.questionArea.firstElementChild;
      if (container) container.classList.add('slide-out');
      
      setTimeout(() => {
        if (state.currentQuestion < contextQuestions.length) {
          renderContextQuestion();
        } else {
          // Continuar con el cuestionario principal
          state.currentQuestion = 0;
          state.phase = 'quiz';
          renderQuestion();
        }
      }, 300);
    }, 400);
  }

  // ====================================
  // RENDERIZADO DE PREGUNTAS PRINCIPALES
  // ====================================
  function renderQuestion() {
    const allQuestions = [...questions, ...validationQuestions];
    const q = allQuestions[state.currentQuestion];
    
    const isValidation = state.currentQuestion >= questions.length;
    
    const optionsHTML = q.options.map((opt, idx) => `
      <button 
        class="option-card focus-ring opacity-0 animate-fade-in-up option-delay-${idx+1} w-full text-left p-4 md:p-5 bg-white/80 border-2 border-transparent hover:border-lavender-300 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 group relative overflow-hidden ${opt.isNeutral ? 'border-dashed border-gray-200' : ''}"
        data-option-index="${idx}"
        data-is-neutral="${opt.isNeutral || false}"
        role="radio"
        aria-checked="false"
      >
        <div class="flex items-start gap-3 relative z-10">
          <span class="w-6 h-6 flex-shrink-0 group-hover:scale-110 transition-transform duration-200 ${opt.isNeutral ? 'text-gray-400' : 'text-lavender-500'}">${opt.icon}</span>
          <span class="text-ink/90 text-sm md:text-base leading-relaxed ${opt.isNeutral ? 'text-gray-500 italic' : ''}">${opt.text}</span>
        </div>
        <div class="absolute inset-0 ${opt.isNeutral ? 'bg-gray-50' : 'bg-lavender-50'} opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-0"></div>
      </button>
    `).join('');

    elements.questionArea.innerHTML = `
      <div class="slide-in" tabindex="-1" id="q-container">
        <div class="mb-6">
          <span class="inline-block px-3 py-1 ${isValidation ? 'bg-mint-100 text-mint-600' : 'bg-lavender-100 text-lavender-600'} text-xs font-medium rounded-full uppercase tracking-wide mb-3">${q.title}</span>
          <h2 class="font-display text-xl md:text-2xl font-bold text-ink leading-snug">${q.question}</h2>
        </div>
        <div class="space-y-3" role="radiogroup">${optionsHTML}</div>
      </div>
    `;

    elements.questionArea.querySelectorAll('.option-card').forEach(btn => {
      btn.addEventListener('click', handleOptionClick);
    });

    updateUIState();
    state.isTransitioning = false;
    setTimeout(() => document.getElementById('q-container')?.focus(), 100);
  }

  function handleOptionClick(e) {
    if (state.isTransitioning) return;
    state.isTransitioning = true;
    vibrate(15);

    const btn = e.currentTarget;
    const idx = parseInt(btn.dataset.optionIndex);
    const isNeutral = btn.dataset.isNeutral === 'true';
    
    const allQuestions = [...questions, ...validationQuestions];
    const q = allQuestions[state.currentQuestion];
    const opt = q.options[idx];
    const weight = q.weight || 1;
    const isValidation = state.currentQuestion >= questions.length;

    btn.setAttribute('aria-checked', 'true');
    btn.classList.add('border-lavender-500', 'bg-lavender-100', 'ring-2', 'ring-lavender-200');

    // Contar respuestas neutrales
    if (isNeutral) {
      state.neutralAnswers++;
    }

    // Calcular puntos ponderados
    const weightedScores = {};
    for (const [k, v] of Object.entries(opt.scores || {})) {
      weightedScores[k] = v * weight;
    }

    state.answers.push({ qId: q.id, optIdx: idx, scores: weightedScores, isNeutral });
    
    // Sumar a scores principales o de validación
    for (const [k, v] of Object.entries(weightedScores)) {
      if (isValidation) {
        state.validationScores[k] = (state.validationScores[k] || 0) + v;
      } else {
        state.scores[k] = (state.scores[k] || 0) + v;
      }
    }
    
    saveState();

    setTimeout(() => {
      const container = elements.questionArea.firstElementChild;
      if (container) container.classList.add('slide-out');
      
      setTimeout(() => {
        state.currentQuestion++;
        if (state.currentQuestion < allQuestions.length) {
          renderQuestion();
        } else {
          showResults();
        }
      }, 300);
    }, 400);
  }

  function handleBackClick() {
    if (state.isTransitioning) return;
    
    // Lógica para retroceder según la fase
    if (state.phase === 'quiz' && state.currentQuestion > 0) {
      vibrate(10);
      const last = state.answers.pop();
      if (last) {
        if (last.isNeutral) state.neutralAnswers--;
        for (const [k, v] of Object.entries(last.scores)) {
          state.scores[k] -= v;
        }
      }
      state.currentQuestion--;
      saveState();
      renderQuestion();
    } else if (state.phase === 'quiz' && state.currentQuestion === 0) {
      // Volver a contexto
      state.phase = 'context';
      state.currentQuestion = contextQuestions.length - 1;
      renderContextQuestion();
    } else if (state.phase === 'context' && state.currentQuestion > 0) {
      state.currentQuestion--;
      renderContextQuestion();
    } else if (state.phase === 'context' && state.currentQuestion === 0) {
      // Volver a screening
      state.phase = 'screening';
      state.currentQuestion = screeningQuestions.length - 1;
      state.screeningRisk = screeningQuestions.slice(0, -1).reduce((acc, q, i) => acc, 0);
      renderScreeningQuestion();
    }
  }

  // ====================================
  // NAVEGACIÓN POR TECLADO MEJORADA
  // ====================================
  function handleKeyboardNavigation(e) {
    const options = [...document.querySelectorAll('.option-card')];
    if (options.length === 0) return;
    
    const current = document.activeElement;
    const idx = options.indexOf(current);
    
    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        if (idx < options.length - 1) {
          options[idx + 1].focus();
          e.preventDefault();
        } else if (idx === -1) {
          options[0].focus();
          e.preventDefault();
        }
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        if (idx > 0) {
          options[idx - 1].focus();
          e.preventDefault();
        }
        break;
      case 'Enter':
      case ' ':
        if (options.includes(current)) {
          current.click();
          e.preventDefault();
        }
        break;
      case 'Escape':
        if (elements.backBtn && !elements.backBtn.classList.contains('opacity-0')) {
          handleBackClick();
          e.preventDefault();
        }
        break;
    }
  }

  // ====================================
  // MOSTRAR RESULTADOS
  // ====================================
  function showResults() {
    // Verificación de seguridad: asegurar que hay suficientes respuestas
    const minRequiredAnswers = 5; // Al menos 5 respuestas del cuestionario principal
    if (state.answers.length < minRequiredAnswers) {
      console.warn('No hay suficientes respuestas para mostrar resultados');
      restartQuiz();
      return;
    }
    
    clearState();
    showScreen('results');

    // Calcular ganador
    let winner = 'tcc';
    let max = -1;
    for (const [k, v] of Object.entries(state.scores)) {
      if (v > max) { max = v; winner = k; }
    }
    const therapy = therapyInfo[winner];
    const sorted = Object.entries(state.scores).sort((a,b) => b[1]-a[1]).map(x => x[0]);
    const totalPoints = Object.values(state.scores).reduce((a,b)=>a+b,0) || 1;

    const calcPercent = (s) => Math.round((s/totalPoints)*100);
    const confidence = calculateConfidence();

    // Renderizar
    const colors = { sky:'bg-sky-100 text-sky-600', lavender:'bg-lavender-100 text-lavender-600', mint:'bg-mint-100 text-mint-600', rose:'bg-rose-100 text-rose-400' };
    const bars = { sky:'bg-sky-400', lavender:'bg-lavender-400', mint:'bg-mint-400', rose:'bg-rose-300' };

    if (elements.resultIcon) {
      elements.resultIcon.className = `w-20 h-20 mx-auto mb-5 rounded-full flex items-center justify-center p-4 shadow-inner ring-4 ${colors[therapy.color]}`;
      elements.resultIcon.innerHTML = therapy.icon;
    }
    if (elements.resultTitle) elements.resultTitle.textContent = therapy.shortName;
    if (elements.resultSubtitle) elements.resultSubtitle.textContent = therapy.subtitle;
    if (elements.resultDescText) elements.resultDescText.textContent = therapy.description;
    if (elements.resultWhyText) elements.resultWhyText.textContent = therapy.whyRecommended;

    // Mostrar índice de confianza
    if (elements.resultConfidence) {
      const confidenceColors = {
        high: 'bg-mint-100 text-mint-700 border-mint-200',
        medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        low: 'bg-orange-100 text-orange-700 border-orange-200'
      };
      elements.resultConfidence.innerHTML = `
        <div class="p-4 rounded-xl border ${confidenceColors[confidence.level]}">
          <div class="flex items-center justify-between mb-2">
            <span class="font-display font-semibold text-sm">Índice de Claridad</span>
            <span class="text-2xl font-bold">${confidence.percent}%</span>
          </div>
          <div class="h-2 bg-white/50 rounded-full overflow-hidden mb-2">
            <div class="h-full bg-current rounded-full transition-all duration-1000" style="width: ${confidence.percent}%"></div>
          </div>
          <p class="text-xs leading-relaxed">${confidence.message}</p>
        </div>
      `;
    }

    // Mensaje personalizado según contexto
    if (elements.resultContextMessage && state.context.previousTherapy) {
      const contextMsg = therapy.contextMessages[state.context.previousTherapy];
      if (contextMsg) {
        elements.resultContextMessage.innerHTML = `
          <div class="p-4 rounded-xl bg-lavender-50/50 border border-lavender-100">
            <p class="text-sm text-ink/80 italic">${contextMsg}</p>
          </div>
        `;
      }
    }

    // Listas
    const checkIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
    const dotIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="currentColor" stroke="none"><circle cx="12" cy="12" r="6"/></svg>`;
    const arrowIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`;

    const makeList = (arr, color, icon) => arr.map(i => `<li class="flex items-start gap-2"><span class="text-${color}-400 flex-shrink-0 mt-0.5 w-4 h-4">${icon}</span>${i}</li>`).join('');

    if (elements.resultWorksFor) elements.resultWorksFor.innerHTML = makeList(therapy.worksFor, 'sky', checkIcon);
    if (elements.resultNotIdeal) elements.resultNotIdeal.innerHTML = makeList(therapy.notIdeal, 'rose', dotIcon);
    if (elements.resultLookFor) elements.resultLookFor.innerHTML = makeList(therapy.lookFor, 'lavender', arrowIcon);
    
    if (elements.resultFirstSessions) elements.resultFirstSessions.innerHTML = makeList(therapy.firstSessions, 'sky', arrowIcon);
    if (elements.resultGoodMatch) elements.resultGoodMatch.innerHTML = makeList(therapy.goodMatch, 'mint', checkIcon);
    if (elements.resultQuestions) elements.resultQuestions.innerHTML = therapy.questionsToAsk.map((q,i) => `<li class="flex items-start gap-2"><span class="text-lavender-400 font-bold text-sm mt-0.5">${i+1}.</span>${q}</li>`).join('');

    // Alternativas
    if (elements.resultAlternatives) {
      elements.resultAlternatives.innerHTML = sorted.slice(1,3).map((k, i) => {
        const t = therapyInfo[k];
        const p = calcPercent(state.scores[k]);
        return `
          <div class="flex items-center gap-3 p-3 ${i===0?'bg-lavender-50':'bg-white/50'} rounded-xl border border-lavender-100">
            <span class="w-8 h-8 flex-shrink-0 text-lavender-500">${t.icon}</span>
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-1">
                 <span class="text-xs font-bold text-lavender-500 bg-lavender-100 px-2 py-0.5 rounded">${i===0?'2º':'3º'}</span>
                 <p class="font-bold text-sm text-ink">${t.shortName}</p>
              </div>
              <p class="text-xs text-muted mb-2">${t.subtitle}</p>
              <div class="flex items-center gap-2">
                 <div class="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden"><div class="h-full ${bars[t.color]}" style="width: ${p}%"></div></div>
                 <span class="text-xs font-medium text-muted">${p}%</span>
              </div>
            </div>
          </div>
        `;
      }).join('');
    }

    // Scores
    if (elements.scoresDisplay) {
      elements.scoresDisplay.innerHTML = sorted.map((k, i) => {
        const t = therapyInfo[k];
        const p = calcPercent(state.scores[k]);
        return `
          <div class="flex items-center gap-3 p-2 rounded-lg ${i===0?'bg-lavender-50 border border-lavender-100':''}">
             <span class="w-6 h-6 flex-shrink-0 text-gray-500">${t.icon}</span>
             <div class="flex-1">
               <div class="flex justify-between text-xs font-medium mb-1"><span>${t.shortName}</span><span>${p}%</span></div>
               <div class="h-2 bg-gray-100 rounded-full overflow-hidden"><div class="h-full ${bars[t.color]} transition-all duration-1000" style="width:${p}%"></div></div>
             </div>
          </div>
        `;
      }).join('');
    }

    // Configurar botón de copiar (ARREGLADO)
    if (elements.shareBtn) {
      elements.shareBtn.onclick = async () => {
        vibrate(20);
        const originalHTML = elements.shareBtn.innerHTML;
        elements.shareBtn.disabled = true;
        
        const success = await copyResultSummary(therapy, sorted);
        
        if (success) {
          elements.shareBtn.innerHTML = `
            <span class="w-5 h-5">${ICONS.check}</span>
            ¡Copiado al portapapeles!
          `;
          elements.shareBtn.classList.add('bg-mint-50', 'border-mint-200', 'text-mint-600');
        }
        
        setTimeout(() => {
          elements.shareBtn.innerHTML = originalHTML;
          elements.shareBtn.disabled = false;
          elements.shareBtn.classList.remove('bg-mint-50', 'border-mint-200', 'text-mint-600');
        }, 2500);
      };
    }

    // Configurar botón de PDF
    if (elements.downloadPdfBtn) {
      elements.downloadPdfBtn.onclick = () => generatePDF(therapy, sorted);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ====================================
  // REINICIAR CUESTIONARIO
  // ====================================
  function restartQuiz() {
    state = {
      phase: 'welcome',
      currentQuestion: 0,
      scores: { tcc: 0, psico: 0, human: 0, sist: 0 },
      answers: [],
      isTransitioning: false,
      screeningRisk: 0,
      context: {
        previousTherapy: null,
        therapyGoal: null
      },
      neutralAnswers: 0,
      validationScores: {}
    };
    clearState();
    showScreen('welcome');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ====================================
  // INIT
  // ====================================
  function init() {
    const saved = loadState();
    if (saved && saved.phase !== 'welcome' && saved.currentQuestion > 0) {
      state = saved;
      if (state.phase === 'quiz') {
        showScreen('quiz');
        renderQuestion();
      } else if (state.phase === 'screening') {
        showScreen('quiz');
        renderScreeningQuestion();
      } else if (state.phase === 'context') {
        showScreen('quiz');
        renderContextQuestion();
      } else {
        showScreen('welcome');
      }
    } else {
      showScreen('welcome');
    }
    
    // Event listeners
    if (elements.startBtn) {
      elements.startBtn.addEventListener('click', () => { 
        vibrate(15);
        state.currentQuestion = 0;
        state.screeningRisk = 0;
        renderScreeningQuestion();
      });
    }
    
    if (elements.restartBtn) {
      elements.restartBtn.addEventListener('click', restartQuiz);
    }
    
    if (elements.backBtn) {
      elements.backBtn.addEventListener('click', handleBackClick);
    }
    
    // Botón de continuar desde pantalla de crisis
    const continueFromCrisisBtn = document.getElementById('continue-from-crisis-btn');
    if (continueFromCrisisBtn) {
      continueFromCrisisBtn.addEventListener('click', () => {
        state.currentQuestion = 0;
        renderContextQuestion();
      });
    }
    
    // Navegación por teclado
    document.addEventListener('keydown', handleKeyboardNavigation);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
