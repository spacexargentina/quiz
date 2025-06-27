
function nextQuestion(nextId, step) {
  document.querySelectorAll('.question').forEach(q => q.style.display = 'none');
  document.getElementById(nextId).style.display = 'block';
  updateProgress(step);
}

function multiNext(nextId, step) {
  alert('Respuesta registrada. Ahora presiona "Continuar" para seguir.');
  updateProgress(step);
}

function goToResult() {
  updateProgress(7);
  window.location.href = 'verificando.html';
}

function goBack() {
  window.history.back();
}

function updateProgress(step) {
  const total = 7;
  const percent = Math.round((step / total) * 100);
  document.getElementById('progressFill').style.width = percent + '%';
  document.getElementById('quizCounter').innerText = step + '/' + total;
}
function goBack() {
  const questions = document.querySelectorAll('.question');
  let currentIndex = -1;

  questions.forEach((q, i) => {
    if (q.style.display !== 'none') {
      currentIndex = i;
      q.style.display = 'none';
    }
  });

  if (currentIndex > 0) {
    const prev = questions[currentIndex - 1];
    prev.style.display = 'block';
    updateProgress(currentIndex - 1);
    updateCounter(currentIndex - 1);
  }
}
function updateProgress(step) {
  const fill = document.getElementById('progressFill');
  const percent = (step / 6) * 100; // 6 = total de etapas (0 a 6)
  fill.style.width = percent + '%';
}

function updateCounter(step) {
  const counter = document.getElementById('quizCounter');
  counter.textContent = `${step + 1}/7`;
}
