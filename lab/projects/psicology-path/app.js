/**
 * =====================================================
 * BRÚJULA TERAPÉUTICA - Lógica del Cuestionario
 * =====================================================
 */

(() => {
  // ====================================
  // ESTADO DE LA APLICACIÓN
  // ====================================
  const state = {
    currentQuestion: 0,
    scores: {
      tcc: 0,    // Cognitivo-Conductual
      psico: 0,  // Psicoanálisis
      human: 0,  // Humanista/Gestalt
      sist: 0    // Sistémica
    },
    answers: [], // Registro de respuestas seleccionadas
    isTransitioning: false
  };

  // ====================================
  // MENSAJES DE ÁNIMO (Mejora didáctica)
  // ====================================
  const motivationalMessages = [
    "Vamos a empezar a descubrirte...",
    "Interesante elección...",
    "Ya vamos a la mitad, lo estás haciendo muy bien.",
    "Cada respuesta nos acerca más a tu perfil ideal.",
    "Solo unas pocas más...",
    "Casi terminamos."
  ];

  // ====================================
  // DATOS: Las 7 preguntas del cuestionario
  // ====================================
  const questions = [
    {
      id: 1,
      title: "El Foco",
      question: "Si tuvieras que describir lo que más te urge resolver hoy, dirías que es...",
      options: [
        { 
          text: "Un síntoma específico que me molesta (ansiedad, insomnio, fobia).", 
          scores: { tcc: 2 },
          icon: "🎯"
        },
        { 
          text: "Entender por qué repito los mismos patrones desde mi infancia.", 
          scores: { psico: 2 },
          icon: "🔄"
        },
        { 
          text: "Sentirme vacío, triste o sin un propósito claro.", 
          scores: { human: 2 },
          icon: "🌫️"
        },
        { 
          text: "Problemas constantes con mi pareja o familia.", 
          scores: { sist: 2 },
          icon: "👥"
        }
      ]
    },
    {
      id: 2,
      title: "La Estructura",
      question: "¿Cómo te gustaría que fuera tu sesión ideal?",
      options: [
        { 
          text: "Que me enseñen técnicas, me den tareas y herramientas prácticas.", 
          scores: { tcc: 2 },
          icon: "🛠️"
        },
        { 
          text: "Hablar libremente de lo que se me ocurra, explorando mis sueños o recuerdos.", 
          scores: { psico: 2 },
          icon: "💭"
        },
        { 
          text: "Sentirme escuchado y acompañado sin ser juzgado, en el \"aquí y ahora\".", 
          scores: { human: 2 },
          icon: "🤝"
        },
        { 
          text: "Analizar cómo me comunico y relaciono con mi entorno.", 
          scores: { sist: 2 },
          icon: "🗣️"
        }
      ]
    },
    {
      id: 3,
      title: "Estilo de Pensamiento",
      question: "Ante un problema, ¿qué buscas instintivamente?",
      options: [
        { 
          text: "Una solución lógica y rápida.", 
          scores: { tcc: 2 },
          icon: "⚡"
        },
        { 
          text: "El origen profundo y oculto del problema.", 
          scores: { psico: 2 },
          icon: "🔍"
        },
        { 
          text: "Conectar con mis emociones y validarlas.", 
          scores: { human: 2 },
          icon: "💚"
        }
      ]
    },
    {
      id: 4,
      title: "La Causa",
      question: "¿De dónde crees que vienen tus dificultades?",
      options: [
        { 
          text: "De mis pensamientos negativos o malos hábitos actuales.", 
          scores: { tcc: 2 },
          icon: "🧠"
        },
        { 
          text: "De traumas o vivencias del pasado no superadas.", 
          scores: { psico: 2 },
          icon: "📜"
        },
        { 
          text: "De la dinámica con las personas con las que convivo.", 
          scores: { sist: 2 },
          icon: "🔗"
        },
        { 
          text: "De no estar siendo fiel a mí mismo/a.", 
          scores: { human: 2 },
          icon: "🪞"
        }
      ]
    },
    {
      id: 5,
      title: "El Rol del Terapeuta",
      question: "¿Cómo ves al psicólogo ideal?",
      options: [
        { 
          text: "Como un entrenador que me da instrucciones.", 
          scores: { tcc: 2 },
          icon: "🏃"
        },
        { 
          text: "Como un experto que interpreta mi inconsciente.", 
          scores: { psico: 2 },
          icon: "🎭"
        },
        { 
          text: "Como un compañero empático que facilita mi crecimiento.", 
          scores: { human: 2 },
          icon: "🌱"
        },
        { 
          text: "Como un mediador que ayuda a organizar mis relaciones.", 
          scores: { sist: 2 },
          icon: "⚖️"
        }
      ]
    },
    {
      id: 6,
      title: "Duración",
      question: "¿Qué esperas en cuanto a tiempo?",
      options: [
        { 
          text: "Resultados rápidos y concretos (pocas sesiones).", 
          scores: { tcc: 2 },
          icon: "🚀"
        },
        { 
          text: "No tengo prisa, busco autoconocimiento profundo.", 
          scores: { psico: 1, human: 1 },
          icon: "🌊"
        },
        { 
          text: "Lo necesario para arreglar la convivencia con mi entorno.", 
          scores: { sist: 2 },
          icon: "🏠"
        }
      ]
    },
    {
      id: 7,
      title: "La Varita Mágica",
      question: "Si pudieras pedir un deseo sobre tu salud mental...",
      options: [
        { 
          text: "Que desaparezca el síntoma ya.", 
          scores: { tcc: 1 },
          icon: "✨"
        },
        { 
          text: "Saber quién soy realmente.", 
          scores: { human: 1, psico: 1 },
          icon: "🔮"
        },
        { 
          text: "Que mi familia/pareja y yo nos entendamos.", 
          scores: { sist: 2 },
          icon: "💫"
        }
      ]
    }
  ];

  // ====================================
  // DATOS: Información de cada tipo de terapia
  // ====================================
  const therapyInfo = {
    tcc: {
      name: "Terapia Cognitivo-Conductual (TCC)",
      shortName: "Cognitivo-Conductual",
      subtitle: "Enfocada en soluciones prácticas",
      icon: "🎯",
      color: "sky",
      description: "La TCC es una terapia estructurada y orientada a metas que se centra en identificar y modificar patrones de pensamiento negativos y comportamientos disfuncionales. Es como tener un \"manual de instrucciones\" para tu mente: aprenderás técnicas concretas, harás ejercicios prácticos y verás resultados medibles en tiempos relativamente cortos.",
      whyRecommended: "Tus respuestas muestran que valoras la eficiencia, buscas soluciones prácticas y quieres abordar síntomas específicos. Te gusta tener herramientas claras y ver progreso tangible. La TCC te dará exactamente eso: estrategias basadas en evidencia para manejar lo que te aflige."
    },
    psico: {
      name: "Psicoanálisis / Terapia Psicodinámica",
      shortName: "Psicoanálisis",
      subtitle: "Explorando las profundidades",
      icon: "🔍",
      color: "lavender",
      description: "El psicoanálisis te invita a un viaje hacia tu mundo interior. A través de la palabra libre, la exploración de sueños, recuerdos y patrones inconscientes, irás descubriendo las raíces profundas de tu malestar. Es un proceso de autoconocimiento que va más allá del síntoma, buscando transformaciones duraderas en tu forma de relacionarte contigo y con el mundo.",
      whyRecommended: "Tus respuestas revelan una mente curiosa que quiere entender el \"por qué\" detrás de todo. Sientes que tu historia pasada tiene peso en tu presente y estás dispuesto/a a explorar territorios profundos. El psicoanálisis te acompañará en ese viaje de descubrimiento personal."
    },
    human: {
      name: "Terapia Humanista / Gestalt",
      shortName: "Humanista-Gestalt",
      subtitle: "El aquí y ahora",
      icon: "🌱",
      color: "mint",
      description: "La terapia humanista pone el foco en tu experiencia presente, tus emociones y tu potencial de crecimiento. Aquí no se trata de \"arreglarte\", sino de acompañarte a reconectar con tu autenticidad. El terapeuta será un espejo empático que te ayudará a integrar todas las partes de ti mismo/a, sin juicio, en un espacio seguro donde puedas simplemente ser.",
      whyRecommended: "Tus respuestas muestran que buscas conexión emocional, autenticidad y un espacio donde sentirte verdaderamente escuchado/a. Valoras el proceso sobre los resultados rápidos y quieres encontrar tu propio camino. La terapia humanista honrará exactamente eso."
    },
    sist: {
      name: "Terapia Sistémica / Familiar",
      shortName: "Sistémica",
      subtitle: "Sanando en conexión",
      icon: "🔗",
      color: "rose",
      description: "La terapia sistémica entiende que no somos islas: nuestro bienestar está entrelazado con nuestras relaciones. Ya sea en pareja, familia o cualquier sistema de relaciones importantes, este enfoque ayuda a identificar patrones de comunicación disfuncionales, roles rígidos y dinámicas que perpetúan el conflicto. El cambio en uno transforma a todos.",
      whyRecommended: "Tus respuestas indican que muchas de tus dificultades están conectadas con tus relaciones cercanas. Sientes que resolver \"lo tuyo\" implica también trabajar en \"lo de ustedes\". La terapia sistémica te ayudará a ver el panorama completo y a mejorar la manera en que te conectas con quienes te importan."
    }
  };

  // ====================================
  // ELEMENTOS DEL DOM
  // ====================================
  const elements = {
    progressBar: document.getElementById('progress-bar'),
    progressPercent: document.getElementById('progress-percent'),
    currentStep: document.getElementById('current-step'),
    questionArea: document.getElementById('question-area'),
    quizContainer: document.getElementById('quiz-container'),
    resultsScreen: document.getElementById('results-screen'),
    progressContainer: document.getElementById('progress-container'),
    encouragementText: document.getElementById('encouragement-text'), // Nuevo elemento
    // Elementos de resultados
    resultIcon: document.getElementById('result-icon'),
    resultTitle: document.getElementById('result-title'),
    resultSubtitle: document.getElementById('result-subtitle'),
    resultDescText: document.getElementById('result-desc-text'),
    resultWhyText: document.getElementById('result-why-text'),
    scoresDisplay: document.getElementById('scores-display'),
    restartBtn: document.getElementById('restart-btn')
  };

  // ====================================
  // FUNCIONES DE RENDERIZADO
  // ====================================

  /**
   * Actualiza la barra de progreso visual
   */
  function updateProgress() {
    const progress = (state.currentQuestion / questions.length) * 100;
    elements.progressBar.style.width = `${progress}%`;
    elements.progressPercent.textContent = `${Math.round(progress)}%`;
    elements.currentStep.textContent = state.currentQuestion + 1;
    
    // Actualizar mensaje de ánimo si existe
    if (elements.encouragementText && state.currentQuestion < motivationalMessages.length) {
      elements.encouragementText.textContent = motivationalMessages[state.currentQuestion] || "";
      elements.encouragementText.classList.remove('opacity-0');
      elements.encouragementText.classList.add('opacity-100');
    }
  }

  /**
   * Renderiza la pregunta actual con sus opciones
   */
  function renderQuestion() {
    const q = questions[state.currentQuestion];
    
    // Generar HTML de las opciones como tarjetas clicleables
    const optionsHTML = q.options.map((opt, idx) => {
      const delayClass = `option-delay-${idx + 1}`;
      return `
        <button 
          class="option-card opacity-0 animate-fade-in-up ${delayClass} w-full text-left p-4 md:p-5 bg-white/80 border-2 border-transparent hover:border-lavender-300 rounded-xl shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-lavender-400 focus:ring-offset-2 transition-all duration-200 group relative overflow-hidden"
          data-option-index="${idx}"
        >
          <div class="flex items-start gap-3 relative z-10">
            <span class="text-2xl flex-shrink-0 group-hover:scale-110 transition-transform duration-200">${opt.icon}</span>
            <span class="text-ink/90 text-sm md:text-base leading-relaxed">${opt.text}</span>
          </div>
          <!-- Efecto ripple sutil en hover/active -->
          <div class="absolute inset-0 bg-lavender-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-0"></div>
        </button>
      `;
    }).join('');

    // Contenedor con animación de entrada
    elements.questionArea.innerHTML = `
      <div class="animate-fade-in-up">
        <div class="mb-6">
          <span class="inline-block px-3 py-1 bg-lavender-100 text-lavender-600 text-xs font-medium rounded-full uppercase tracking-wide mb-3">
            ${q.title}
          </span>
          <h2 class="font-display text-xl md:text-2xl font-bold text-ink leading-snug">
            ${q.question}
          </h2>
        </div>
        
        <div class="space-y-3">
          ${optionsHTML}
        </div>
      </div>
    `;

    // Agregar event listeners a las opciones
    const optionButtons = elements.questionArea.querySelectorAll('.option-card');
    optionButtons.forEach((btn) => {
      btn.addEventListener('click', handleOptionClick);
    });

    updateProgress();
    state.isTransitioning = false;
  }

  /**
   * Maneja el click en una opción
   * @param {Event} e - Evento del click
   */
  function handleOptionClick(e) {
    if (state.isTransitioning) return; // Evitar doble click
    state.isTransitioning = true;

    const btn = e.currentTarget;
    const optionIndex = parseInt(btn.dataset.optionIndex, 10);
    const currentQ = questions[state.currentQuestion];
    const selectedOption = currentQ.options[optionIndex];

    // Efecto visual de selección fuerte
    btn.classList.add('border-lavender-500', 'bg-lavender-100', 'ring-2', 'ring-lavender-200');
    btn.classList.remove('hover:border-lavender-300', 'bg-white/80');

    // Registrar respuesta y sumar puntajes
    state.answers.push({
      questionId: currentQ.id,
      optionIndex: optionIndex,
      optionText: selectedOption.text
    });

    // Sumar los puntajes de esta opción
    for (const [key, value] of Object.entries(selectedOption.scores)) {
      state.scores[key] += value;
    }

    // Pausa para feedback visual, luego transición suave
    setTimeout(() => {
      // Animación de salida del contenedor actual
      const currentContent = elements.questionArea.firstElementChild;
      if (currentContent) {
        currentContent.classList.add('opacity-0', 'translate-y-[-10px]', 'transition-all', 'duration-300');
      }

      setTimeout(() => {
        state.currentQuestion++;
        
        if (state.currentQuestion < questions.length) {
          renderQuestion();
        } else {
          showResults();
        }
      }, 300); // Esperar a que termine la animación de salida
    }, 400); // Tiempo para ver la selección
  }

  /**
   * Determina el tipo de terapia ganador basado en los puntajes
   * @returns {string} - Clave del tipo de terapia ('tcc', 'psico', 'human', 'sist')
   */
  function getWinningTherapy() {
    const scores = state.scores;
    let maxScore = -1;
    let winner = 'tcc'; // Default

    // En caso de empate, el orden de iteración define (se podría randomizar)
    for (const [key, value] of Object.entries(scores)) {
      if (value > maxScore) {
        maxScore = value;
        winner = key;
      }
    }
    return winner;
  }

  /**
   * Muestra la pantalla de resultados
   */
  function showResults() {
    // Ocultar quiz y barra de progreso con fade
    elements.quizContainer.classList.add('hidden');
    elements.progressContainer.classList.add('hidden');
    
    // Mostrar resultados
    elements.resultsScreen.classList.remove('hidden');
    elements.resultsScreen.classList.add('animate-fade-in-up');

    // Obtener terapia ganadora
    const winnerKey = getWinningTherapy();
    const therapy = therapyInfo[winnerKey];

    // Mapeo de colores para los estilos
    const colorClasses = {
      sky: 'bg-sky-100 text-sky-600 ring-sky-200',
      lavender: 'bg-lavender-100 text-lavender-600 ring-lavender-200',
      mint: 'bg-mint-100 text-mint-600 ring-mint-200',
      rose: 'bg-rose-100 text-rose-400 ring-rose-200'
    };

    // Renderizar contenido
    elements.resultIcon.className = `w-20 h-20 mx-auto mb-5 rounded-full flex items-center justify-center text-4xl shadow-inner ring-4 ${colorClasses[therapy.color]}`;
    elements.resultIcon.textContent = therapy.icon;
    
    elements.resultTitle.textContent = therapy.shortName;
    elements.resultSubtitle.textContent = therapy.subtitle;
    elements.resultDescText.textContent = therapy.description;
    elements.resultWhyText.textContent = therapy.whyRecommended;

    // Mostrar puntajes (transparencia para el usuario)
    const scoresHTML = Object.entries(state.scores).map(([key, value]) => {
      const info = therapyInfo[key];
      const isWinner = key === winnerKey;
      const baseClass = isWinner 
        ? 'bg-lavender-500 text-white shadow-md transform scale-105' 
        : 'bg-white/60 text-muted border border-lavender-200/50';
      
      return `
        <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-all ${baseClass}">
          ${info.icon} ${info.shortName}: ${value}
        </span>
      `;
    }).join('');

    elements.scoresDisplay.innerHTML = scoresHTML;

    // Scroll al inicio de resultados
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /**
   * Reinicia el cuestionario a su estado inicial
   */
  function restartQuiz() {
    // Fade out resultados
    elements.resultsScreen.classList.add('opacity-0');
    
    setTimeout(() => {
      // Resetear estado
      state.currentQuestion = 0;
      state.scores = { tcc: 0, psico: 0, human: 0, sist: 0 };
      state.answers = [];

      // Ocultar resultados y resetear opacidad
      elements.resultsScreen.classList.add('hidden');
      elements.resultsScreen.classList.remove('opacity-0');
      
      // Mostrar quiz y progreso
      elements.quizContainer.classList.remove('hidden');
      elements.progressContainer.classList.remove('hidden');

      // Renderizar primera pregunta
      renderQuestion();

      // Scroll al inicio
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 300);
  }

  // ====================================
  // INICIALIZACIÓN
  // ====================================
  function init() {
    // Renderizar primera pregunta
    renderQuestion();

    // Event listener para reiniciar
    if (elements.restartBtn) {
      elements.restartBtn.addEventListener('click', restartQuiz);
    }
  }

  // Iniciar cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

