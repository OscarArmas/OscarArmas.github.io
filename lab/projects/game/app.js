// Game App - Guess the Number (1-20)
let secretNumber;
let attempts;

const guessInput = document.getElementById('guessInput');
const guessBtn = document.getElementById('guessBtn');
const resetBtn = document.getElementById('resetBtn');
const feedback = document.getElementById('feedback');
const attemptsDisplay = document.getElementById('attempts');

function generateSecretNumber() {
  return Math.floor(Math.random() * 20) + 1;
}

function initGame() {
  secretNumber = generateSecretNumber();
  attempts = 0;
  guessInput.value = '';
  guessInput.disabled = false;
  guessBtn.disabled = false;
  feedback.textContent = '';
  feedback.className = 'text-lg font-semibold mb-4 h-8';
  attemptsDisplay.textContent = 'Attempts: 0';
  guessInput.focus();
}

function makeGuess() {
  const guess = parseInt(guessInput.value);
  
  if (isNaN(guess) || guess < 1 || guess > 20) {
    feedback.textContent = 'Please enter a number between 1 and 20';
    feedback.className = 'text-lg font-semibold mb-4 h-8 text-orange-500';
    return;
  }
  
  attempts++;
  attemptsDisplay.textContent = `Attempts: ${attempts}`;
  
  if (guess === secretNumber) {
    feedback.textContent = `🎉 Correct! You got it in ${attempts} attempt${attempts === 1 ? '' : 's'}!`;
    feedback.className = 'text-lg font-semibold mb-4 h-8 text-green-600';
    guessInput.disabled = true;
    guessBtn.disabled = true;
  } else if (guess < secretNumber) {
    feedback.textContent = '📈 Too low! Try a higher number.';
    feedback.className = 'text-lg font-semibold mb-4 h-8 text-blue-600';
  } else {
    feedback.textContent = '📉 Too high! Try a lower number.';
    feedback.className = 'text-lg font-semibold mb-4 h-8 text-red-600';
  }
  
  guessInput.value = '';
  guessInput.focus();
}

// Event listeners
guessBtn.addEventListener('click', makeGuess);
resetBtn.addEventListener('click', initGame);

guessInput.addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    makeGuess();
  }
});

// Initialize game on load
initGame();
