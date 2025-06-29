document.addEventListener('DOMContentLoaded', () => {
  const DOM = {
    progressContainer: document.querySelector('.progress-container'),
    progressFill: document.getElementById('progressFill'),
    quizCounter: document.getElementById('quizCounter'),
    logo: document.querySelector('.logo'),
    steps: document.querySelectorAll('.step-card'),
    quizContainer: document.getElementById('step-quiz'),
    verificationBar: document.getElementById('verificationBar'),
    verificationPercent: document.getElementById('verificationPercent'),
    timerDisplay: document.getElementById('timer'),
    stockDisplay: document.getElementById('stock'),
    liveAnnouncer: document.getElementById('liveAnnouncer'), // Para accesibilidad
  };

  let currentQuestionIndex = 0;
  let userName = '';

  const quizQuestions = [
    {
      type: 'text',
      question: "¿Cómo te llamás?",
      placeholder: "✍️ Escribí tu nombre",
      buttonText: "EMPEZAR →",
    },
    {
      type: 'choice',
      get question() {
        return `${userName}, ¿escuchaste hablar del servicio de internet satelital de Starlink?`;
      },
      options: ['✅ Sí, ya lo conocía', '❓ No, es la primera vez que lo escucho', '🌐 Lo estoy usando ahora mismo'],
    },
    {
      type: 'choice',
      get question() {
        return `${userName}, ¿tenés acceso a internet rápido donde vivís?`;
      },
      options: ['⚡ Sí, pero no es muy estable', '📶 No, tengo muchos problemas', '📱 Solo con datos móviles'],
    },
    {
      type: 'choice',
      question: "¿Dónde vivís?",
      options: ['🏡 Zona rural', '🏘️ Pueblo chico', '🏙️ Ciudad grande'],
    },
    {
      type: 'choice',
      get question() {
        return `${userName}, ¿te gustaría tener internet satelital de alta velocidad sin necesidad de cables ni fibra?`;
      },
      options: ['🚀 Sí, me encantaría', '💸 Tal vez, depende del costo', '🙅‍♂️ No lo necesito'],
    },
    {
      type: 'choice',
      get question() {
        return `¿Sabías, ${userName}, que Starlink es un proyecto de SpaceX, la empresa de Elon Musk?`;
      },
      options: ['🧠 Sí, sigo sus proyectos', '🤔 No lo sabía', '🚀 Conozco SpaceX, pero no Starlink'],
    },
    {
      type: 'choice',
      question: "¿Para qué usarías una conexión Starlink?",
      options: ['👨‍💻 Trabajo remoto', '🎓 Educación online', '🎬 Streaming y entretenimiento', '🎮 Videojuegos online'],
    },
    {
      type: 'choice',
      get question() {
        return `${userName}, ¿te gustaría participar como tester oficial y dar tu opinión sobre el producto?`;
      },
      options: ['🧪 Sí, me interesa mucho', '🤝 Puede ser, quiero más info', '😐 No estoy segur@'],
    }
  ];

  const showStep = (stepId) => {
    let activeStepTitle = '';
    DOM.steps.forEach(step => {
      const isActive = step.id === stepId;
      step.classList.toggle('active', isActive);
      if (isActive) {
        activeStepTitle = step.querySelector('h1, h2').textContent;
      }
    });

    if (DOM.liveAnnouncer && activeStepTitle) {
      DOM.liveAnnouncer.textContent = `Paso cargado: ${activeStepTitle}`;
    }

    const isQuiz = stepId === 'step-quiz';
    DOM.progressContainer.style.display = isQuiz ? 'flex' : 'none';
    DOM.logo.style.display = isQuiz ? 'none' : 'block';
  };

  const updateProgress = () => {
    const total = quizQuestions.length;
    const current = currentQuestionIndex + 1;
    const percent = total ? (current / total) * 100 : 0;
    DOM.progressFill.style.width = `${percent}%`;
    DOM.quizCounter.textContent = `${current}/${total}`;
  };

  const renderQuestion = () => {
    const { type, question, placeholder, buttonText, options } = quizQuestions[currentQuestionIndex];
    DOM.quizContainer.innerHTML = '';

    const title = document.createElement('h2');
    title.textContent = typeof question === 'function' ? question() : question;
    DOM.quizContainer.appendChild(title);

    if (type === 'text') {
      const input = document.createElement('input');
      input.type = 'text';
      input.placeholder = placeholder;
      input.className = 'form-input';
      input.autofocus = true;
      DOM.quizContainer.appendChild(input);

      const btn = document.createElement('button');
      btn.textContent = buttonText;
      btn.className = 'btn btn-primary';
      btn.addEventListener('click', () => {
        userName = input.value.trim();
        if (!userName) {
          alert('Por favor, escribí tu nombre.');
          input.focus();
          return;
        }
        nextQuestion();
      });
      DOM.quizContainer.appendChild(btn);
    }

    if (type === 'choice') {
      const optionWrap = document.createElement('div');
      optionWrap.className = 'quiz-options';
      options.forEach(opt => {
        const btn = document.createElement('button');
        btn.textContent = opt;
        btn.className = 'btn';
        btn.addEventListener('click', nextQuestion);
        optionWrap.appendChild(btn);
      });
      DOM.quizContainer.appendChild(optionWrap);
    }

    updateProgress();
  };

  const nextQuestion = () => {
    currentQuestionIndex++;
    currentQuestionIndex < quizQuestions.length ? renderQuestion() : startVerification();
  };

  const startVerification = () => {
    showStep('step-verifying');
    let percent = 0;
    const interval = setInterval(() => {
      percent++;
      DOM.verificationBar.style.width = `${percent}%`;
      DOM.verificationPercent.textContent = `${percent}%`;
      if (percent >= 100) {
        clearInterval(interval);
        setTimeout(() => showStep('step-congrats'), 500);
      }
    }, 40);
  };

  const startTimers = () => {
    let minutes = 14;
    let seconds = 59;
    let stock = 23;
    const interval = setInterval(() => {
      seconds--;
      if (seconds < 0) {
        seconds = 59;
        minutes--;
      }
      if (minutes < 0) {
        clearInterval(interval);
        DOM.timerDisplay.textContent = 'EXPIRADO';
        return;
      }
      DOM.timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
      if (seconds % 20 === 0 && stock > 5) {
        stock--;
        DOM.stockDisplay.textContent = stock;
      }
    }, 1000);
  };

  const startStockDecrease = () => {
    let stock = parseInt(DOM.stockDisplay.textContent, 10);
    const interval = setInterval(() => {
      if (stock > 1) {
        stock--;
        DOM.stockDisplay.textContent = stock;
      } else {
        clearInterval(interval);
      }
    }, 5000);
  };

  document.body.addEventListener('click', (e) => {
    const action = e.target.dataset.action;
    if (!action) return;
    switch (action) {
      case 'start-quiz':
        showStep('step-quiz');
        renderQuestion();
        break;
      case 'show-result':
        showStep('step-result');
        startTimers();
        startStockDecrease();
        break;
    }
  });

  showStep('step-intro');
});
