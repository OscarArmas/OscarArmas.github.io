// Calculator App - Add two numbers
const num1Input = document.getElementById('num1');
const num2Input = document.getElementById('num2');
const addBtn = document.getElementById('addBtn');
const resultDiv = document.getElementById('result');
const resultValue = document.getElementById('resultValue');

addBtn.addEventListener('click', function() {
  const num1 = parseFloat(num1Input.value) || 0;
  const num2 = parseFloat(num2Input.value) || 0;
  const sum = num1 + num2;
  
  resultValue.textContent = sum;
  resultDiv.classList.remove('hidden');
});

// Allow Enter key to trigger calculation
document.addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    addBtn.click();
  }
});
