const displayEl = document.getElementById('display');

let current = '0';      // current displayed number (string)
let previous = null;    // stored previous number (number)
let operator = null;    // '+', '-', '*', '/'
let overwrite = true;   // next number should overwrite display

function updateDisplay() {
  displayEl.textContent = current;
}

function inputDigit(d) {
  if (overwrite) {
    current = d === '.' ? '0.' : d;
    overwrite = false;
  } else {
    if (d === '.' && current.includes('.')) return;
    current = current === '0' && d !== '.' ? d : current + d;
  }
  updateDisplay();
}

function inputOperator(op) {
  if (operator && !overwrite) {
    compute();
  }
  previous = parseFloat(current);
  operator = op;
  overwrite = true;
}

function compute() {
  if (operator == null || previous == null) return;
  const a = previous;
  const b = parseFloat(current);
  let result;
  switch (operator) {
    case '+': result = a + b; break;
    case '-': result = a - b; break;
    case '*': result = a * b; break;
    case '/': result = b === 0 ? 'Error' : a / b; break;
    default: result = b;
  }
  current = (result === 'Error') ? 'Error' : String(parseFloat(result.toPrecision(12)));
  operator = null;
  previous = null;
  overwrite = true;
  updateDisplay();
}

function clearAll() {
  current = '0'; previous = null; operator = null; overwrite = true; updateDisplay();
}

function toggleNeg() {
  if (current === 'Error') return;
  current = current.startsWith('-') ? current.slice(1) : '-' + current;
  updateDisplay();
}

function percent() {
  if (current === 'Error') return;
  current = String(parseFloat(current) / 100);
  updateDisplay();
}

document.querySelector('.buttons').addEventListener('click', (e) => {
  const btn = e.target;
  if (!btn) return;
  if (btn.dataset.value) {
    inputDigit(btn.dataset.value);
  } else if (btn.dataset.action === 'operator') {
    inputOperator(btn.dataset.value);
  } else if (btn.dataset.action === 'equals') {
    compute();
  } else if (btn.dataset.action === 'clear') {
    clearAll();
  } else if (btn.dataset.action === 'neg') {
    toggleNeg();
  } else if (btn.dataset.action === 'percent') {
    percent();
  }
});

// keyboard support (optional)
window.addEventListener('keydown', (e) => {
  if (/\d/.test(e.key)) inputDigit(e.key);
  if (e.key === '.') inputDigit('.');
  if (['+','-','*','/'].includes(e.key)) inputOperator(e.key);
  if (e.key === 'Enter' || e.key === '=') compute();
  if (e.key === 'Backspace') { current = current.slice(0, -1) || '0'; updateDisplay(); }
});
