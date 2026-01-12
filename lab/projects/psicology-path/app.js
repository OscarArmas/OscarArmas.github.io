/**
 * =====================================================
 * BRÚJULA TERAPÉUTICA - Lógica del Cuestionario (v3.1)
 * =====================================================
 * Sistema de orientación terapéutica con UX profesional.
 * Incluye: resultados expandidos, percentiles, señales de match,
 * preguntas para terapeuta, qué esperar en primeras sesiones
 * Y GENERACIÓN DE PDF.
 */

(() => {
  // ====================================
  // CONSTANTES
  // ====================================
  const STORAGE_KEY = 'brujula_terapeutica_state_v3';
  const MAX_POSSIBLE_SCORE = 14; 

  // ====================================
  // ESTADO DE LA APLICACIÓN
  // ====================================
  let state = {
    currentQuestion: 0,
    scores: { tcc: 0, psico: 0, human: 0, sist: 0 },
    answers: [],
    isTransitioning: false
  };

  // ====================================
  // MENSAJES DE ÁNIMO
  // ====================================
  const motivationalMessages = [
    "Vamos a empezar a conocerte...",
    "Interesante elección...",
    "Ya vamos a la mitad, lo haces muy bien.",
    "Cada respuesta nos acerca a tu perfil.",
    "Solo unas pocas más...",
    "Última pregunta, casi lo logras..."
  ];

  // ====================================
  // PREGUNTAS DEL CUESTIONARIO
  // ====================================
  const questions = [
    {
      id: 1,
      title: "El Foco",
      question: "Si tuvieras que describir lo que más te urge resolver hoy, dirías que es...",
      options: [
        { text: "Un síntoma específico que me molesta (ansiedad, insomnio, fobia).", scores: { tcc: 2 }, icon: "🎯" },
        { text: "Entender por qué repito los mismos patrones desde mi infancia.", scores: { psico: 2 }, icon: "🔄" },
        { text: "Sentirme vacío, triste o sin un propósito claro.", scores: { human: 2 }, icon: "🌫️" },
        { text: "Problemas constantes con mi pareja o familia.", scores: { sist: 2 }, icon: "👥" }
      ]
    },
    {
      id: 2,
      title: "La Estructura",
      question: "¿Cómo te gustaría que fuera tu sesión ideal?",
      options: [
        { text: "Que me enseñen técnicas, me den tareas y herramientas prácticas.", scores: { tcc: 2 }, icon: "🛠️" },
        { text: "Hablar libremente de lo que se me ocurra, explorando mis sueños o recuerdos.", scores: { psico: 2 }, icon: "💭" },
        { text: "Sentirme escuchado y acompañado sin ser juzgado, en el \"aquí y ahora\".", scores: { human: 2 }, icon: "🤝" },
        { text: "Analizar cómo me comunico y relaciono con mi entorno.", scores: { sist: 2 }, icon: "🗣️" }
      ]
    },
    {
      id: 3,
      title: "Estilo de Pensamiento",
      question: "Ante un problema, ¿qué buscas instintivamente?",
      options: [
        { text: "Una solución lógica y rápida.", scores: { tcc: 2 }, icon: "⚡" },
        { text: "El origen profundo y oculto del problema.", scores: { psico: 2 }, icon: "🔍" },
        { text: "Conectar con mis emociones y validarlas.", scores: { human: 2 }, icon: "💚" }
      ]
    },
    {
      id: 4,
      title: "La Causa",
      question: "¿De dónde crees que vienen tus dificultades?",
      options: [
        { text: "De mis pensamientos negativos o malos hábitos actuales.", scores: { tcc: 2 }, icon: "🧠" },
        { text: "De traumas o vivencias del pasado no superadas.", scores: { psico: 2 }, icon: "📜" },
        { text: "De la dinámica con las personas con las que convivo.", scores: { sist: 2 }, icon: "🔗" },
        { text: "De no estar siendo fiel a mí mismo/a.", scores: { human: 2 }, icon: "🪞" }
      ]
    },
    {
      id: 5,
      title: "El Rol del Terapeuta",
      question: "¿Cómo ves al psicólogo ideal?",
      options: [
        { text: "Como un entrenador que me da instrucciones.", scores: { tcc: 2 }, icon: "🏃" },
        { text: "Como un experto que interpreta mi inconsciente.", scores: { psico: 2 }, icon: "🎭" },
        { text: "Como un compañero empático que facilita mi crecimiento.", scores: { human: 2 }, icon: "🌱" },
        { text: "Como un mediador que ayuda a organizar mis relaciones.", scores: { sist: 2 }, icon: "⚖️" }
      ]
    },
    {
      id: 6,
      title: "Duración",
      question: "¿Qué esperas en cuanto a tiempo?",
      options: [
        { text: "Resultados rápidos y concretos (pocas sesiones).", scores: { tcc: 2 }, icon: "🚀" },
        { text: "No tengo prisa, busco autoconocimiento profundo.", scores: { psico: 1, human: 1 }, icon: "🌊" },
        { text: "Lo necesario para arreglar la convivencia con mi entorno.", scores: { sist: 2 }, icon: "🏠" }
      ]
    },
    {
      id: 7,
      title: "La Varita Mágica",
      question: "Si pudieras pedir un deseo sobre tu salud mental...",
      options: [
        { text: "Que desaparezca el síntoma ya.", scores: { tcc: 1 }, icon: "✨" },
        { text: "Saber quién soy realmente.", scores: { human: 1, psico: 1 }, icon: "🔮" },
        { text: "Que mi familia/pareja y yo nos entendamos.", scores: { sist: 2 }, icon: "💫" }
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
      icon: "🎯",
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
      ]
    },
    psico: {
      name: "Psicoanálisis / Terapia Psicodinámica",
      shortName: "Psicoanálisis",
      subtitle: "Explorando las profundidades",
      icon: "🔍",
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
      ]
    },
    human: {
      name: "Terapia Humanista / Gestalt",
      shortName: "Humanista-Gestalt",
      subtitle: "El aquí y ahora",
      icon: "🌱",
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
      ]
    },
    sist: {
      name: "Terapia Sistémica / Familiar",
      shortName: "Sistémica",
      subtitle: "Sanando en conexión",
      icon: "🔗",
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
      ]
    }
  };

  // ====================================
  // ELEMENTOS DEL DOM
  // ====================================
  const elements = {
    welcomeScreen: document.getElementById('welcome-screen'),
    quizScreen: document.getElementById('quiz-screen'),
    resultsScreen: document.getElementById('results-screen'),
    startBtn: document.getElementById('start-btn'),
    progressContainer: document.getElementById('progress-container'),
    progressBar: document.getElementById('progress-bar'),
    progressPercent: document.getElementById('progress-percent'),
    currentStep: document.getElementById('current-step'),
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
    document.getElementById('pdf-icon').textContent = therapy.icon;
    document.getElementById('pdf-desc').textContent = therapy.description;
    document.getElementById('pdf-why').textContent = therapy.whyRecommended;

    // Listas en PDF
    const lookForHTML = therapy.lookFor.map(i => `<li>${i}</li>`).join('');
    document.getElementById('pdf-look-for').innerHTML = lookForHTML;

    // Gráficas en PDF
    const scoresHTML = sortedTherapies.map(key => {
      const info = therapyInfo[key];
      const score = state.scores[key];
      const percent = Math.round((score / Object.values(state.scores).reduce((a,b)=>a+b,0))*100) || 0;
      return `
        <div class="flex items-center gap-3">
          <span class="text-xl w-8">${info.icon}</span>
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
            ${alt.icon} ${alt.shortName}
          </h5>
          <p class="text-xs text-muted mt-1">${alt.subtitle}</p>
        </div>
      `;
    }).join('');
    document.getElementById('pdf-alternatives').innerHTML = altsHTML;

    // 2. Generar canvas y PDF
    try {
      // Pequeño delay para asegurar renderizado
      await new Promise(r => setTimeout(r, 100));
      
      const canvas = await html2canvas(pdfContainer, {
        scale: 2, // Mejor calidad
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
  // NAVEGACIÓN Y RENDERIZADO
  // ====================================
  function showScreen(screenId) {
    elements.welcomeScreen.classList.add('hidden');
    elements.quizScreen.classList.add('hidden');
    elements.resultsScreen.classList.add('hidden');
    
    if (screenId === 'welcome') elements.welcomeScreen.classList.remove('hidden');
    else if (screenId === 'quiz') elements.quizScreen.classList.remove('hidden');
    else if (screenId === 'results') {
      elements.resultsScreen.classList.remove('hidden');
      elements.resultsScreen.classList.add('animate-fade-in-up');
    }
  }

  function updateUIState() {
    const progress = (state.currentQuestion / questions.length) * 100;
    elements.progressBar.style.width = `${progress}%`;
    elements.progressPercent.textContent = `${Math.round(progress)}%`;
    elements.currentStep.textContent = state.currentQuestion + 1;
    
    const msg = motivationalMessages[state.currentQuestion] || "";
    if (msg) elements.encouragementText.textContent = msg;
    elements.encouragementText.classList.toggle('opacity-0', !msg);

    elements.backBtn.classList.toggle('opacity-0', state.currentQuestion === 0);
    elements.backBtn.classList.toggle('pointer-events-none', state.currentQuestion === 0);
  }

  function renderQuestion() {
    const q = questions[state.currentQuestion];
    
    const optionsHTML = q.options.map((opt, idx) => `
      <button 
        class="option-card focus-ring opacity-0 animate-fade-in-up option-delay-${idx+1} w-full text-left p-4 md:p-5 bg-white/80 border-2 border-transparent hover:border-lavender-300 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 group relative overflow-hidden"
        data-option-index="${idx}"
        role="radio"
        aria-checked="false"
      >
        <div class="flex items-start gap-3 relative z-10">
          <span class="text-2xl flex-shrink-0 group-hover:scale-110 transition-transform duration-200">${opt.icon}</span>
          <span class="text-ink/90 text-sm md:text-base leading-relaxed">${opt.text}</span>
        </div>
        <div class="absolute inset-0 bg-lavender-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-0"></div>
      </button>
    `).join('');

    elements.questionArea.innerHTML = `
      <div class="animate-fade-in-up" tabindex="-1" id="q-container">
        <div class="mb-6">
          <span class="inline-block px-3 py-1 bg-lavender-100 text-lavender-600 text-xs font-medium rounded-full uppercase tracking-wide mb-3">${q.title}</span>
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
    const q = questions[state.currentQuestion];
    const opt = q.options[idx];

    btn.setAttribute('aria-checked', 'true');
    btn.classList.add('border-lavender-500', 'bg-lavender-100', 'ring-2', 'ring-lavender-200');

    state.answers.push({ qId: q.id, optIdx: idx, scores: opt.scores });
    for (const [k, v] of Object.entries(opt.scores)) state.scores[k] += v;
    saveState();

    setTimeout(() => {
      elements.questionArea.firstElementChild.classList.add('opacity-0', '-translate-y-2', 'transition-all', 'duration-300');
      setTimeout(() => {
        state.currentQuestion++;
        if (state.currentQuestion < questions.length) renderQuestion();
        else showResults();
      }, 300);
    }, 400);
  }

  function handleBackClick() {
    if (state.currentQuestion === 0 || state.isTransitioning) return;
    vibrate(10);
    const last = state.answers.pop();
    if (last) for (const [k, v] of Object.entries(last.scores)) state.scores[k] -= v;
    state.currentQuestion--;
    saveState();
    renderQuestion();
  }

  // ====================================
  // MOSTRAR RESULTADOS
  // ====================================
  function showResults() {
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

    // Renderizar
    const colors = { sky:'bg-sky-100 text-sky-600', lavender:'bg-lavender-100 text-lavender-600', mint:'bg-mint-100 text-mint-600', rose:'bg-rose-100 text-rose-400' };
    const bars = { sky:'bg-sky-400', lavender:'bg-lavender-400', mint:'bg-mint-400', rose:'bg-rose-300' };

    elements.resultIcon.className = `w-20 h-20 mx-auto mb-5 rounded-full flex items-center justify-center text-4xl shadow-inner ring-4 ${colors[therapy.color]}`;
    elements.resultIcon.textContent = therapy.icon;
    elements.resultTitle.textContent = therapy.shortName;
    elements.resultSubtitle.textContent = therapy.subtitle;
    elements.resultDescText.textContent = therapy.description;
    elements.resultWhyText.textContent = therapy.whyRecommended;

    // Listas
    const makeList = (arr, color, icon) => arr.map(i => `<li class="flex items-start gap-2"><span class="text-${color}-400 flex-shrink-0">${icon}</span>${i}</li>`).join('');
    
    elements.resultWorksFor.innerHTML = makeList(therapy.worksFor, 'sky', '•');
    elements.resultNotIdeal.innerHTML = makeList(therapy.notIdeal, 'rose', '•');
    elements.resultLookFor.innerHTML = makeList(therapy.lookFor, 'lavender', '→');
    
    if(elements.resultFirstSessions) elements.resultFirstSessions.innerHTML = makeList(therapy.firstSessions, 'sky', '→');
    if(elements.resultGoodMatch) elements.resultGoodMatch.innerHTML = makeList(therapy.goodMatch, 'mint', '✓');
    if(elements.resultQuestions) elements.resultQuestions.innerHTML = therapy.questionsToAsk.map((q,i) => `<li class="flex items-start gap-2"><span class="text-lavender-400 font-bold">${i+1}.</span>${q}</li>`).join('');

    // Alternativas
    elements.resultAlternatives.innerHTML = sorted.slice(1,3).map((k, i) => {
      const t = therapyInfo[k];
      const p = calcPercent(state.scores[k]);
      return `
        <div class="flex items-center gap-3 p-3 ${i===0?'bg-lavender-50':'bg-white/50'} rounded-xl border border-lavender-100">
          <span class="text-2xl">${t.icon}</span>
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-1">
               <span class="text-xs font-bold text-lavender-500 bg-lavender-100 px-2 py-0.5 rounded">${i===0?'2º':'3º'}</span>
               <p class="font-bold text-sm text-ink">${t.shortName}</p>
            </div>
            <p class="text-xs text-muted mb-2">${t.subtitle}</p>
            <div class="flex items-center gap-2">
               <div class="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden"><div class="h-full ${bars[t.color]} w-[${p}%]"></div></div>
               <span class="text-xs font-medium text-muted">${p}%</span>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Scores
    elements.scoresDisplay.innerHTML = sorted.map((k, i) => {
      const t = therapyInfo[k];
      const p = calcPercent(state.scores[k]);
      return `
        <div class="flex items-center gap-3 p-2 rounded-lg ${i===0?'bg-lavender-50 border border-lavender-100':''}">
           <span class="text-lg">${t.icon}</span>
           <div class="flex-1">
             <div class="flex justify-between text-xs font-medium mb-1"><span>${t.shortName}</span><span>${p}%</span></div>
             <div class="h-2 bg-gray-100 rounded-full overflow-hidden"><div class="h-full ${bars[t.color]} w-[${p}%] transition-all duration-1000" style="width:${p}%"></div></div>
           </div>
        </div>
      `;
    }).join('');

    // Configurar botones
    if (elements.shareBtn) {
      elements.shareBtn.onclick = async () => {
        vibrate(20);
        // Lógica de copia simple (sin re-generar todo el texto aquí para no duplicar código, usaríamos una función helper idealmente)
        alert("Texto copiado (simulado)"); 
      };
    }

    if (elements.downloadPdfBtn) {
      elements.downloadPdfBtn.onclick = () => generatePDF(therapy, sorted);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ====================================
  // INIT
  // ====================================
  function init() {
    const saved = loadState();
    if (saved && saved.currentQuestion > 0) {
      state = saved;
      showScreen('quiz');
      renderQuestion();
    } else {
      showScreen('welcome');
    }
    
    if(elements.startBtn) elements.startBtn.addEventListener('click', () => { vibrate(15); showScreen('quiz'); renderQuestion(); });
    if(elements.restartBtn) elements.restartBtn.addEventListener('click', () => { clearState(); restartQuiz(); });
    if(elements.backBtn) elements.backBtn.addEventListener('click', handleBackClick);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

})();
