const input = document.getElementById('password');
const toggle = document.getElementById('toggle');
const scoreNode = document.getElementById('score');
const rating = document.getElementById('rating');
const summary = document.getElementById('summary');
const dial = document.getElementById('dial');
const tip = document.getElementById('tip');

toggle.addEventListener('click', () => {
  const reveal = input.type === 'password';
  input.type = reveal ? 'text' : 'password';
  toggle.textContent = reveal ? 'Hide' : 'Show';
});

function setCriterion(id, pass) {
  const item = document.getElementById(id);
  item.classList.toggle('pass', pass);
  item.querySelector('.mark').textContent = pass ? '✓' : '○';
}

function checkPassword(value) {
  const rules = {
    length: value.length >= 12,
    case: /[a-z]/.test(value) && /[A-Z]/.test(value),
    number: /\d/.test(value),
    symbol: /[^A-Za-z0-9]/.test(value),
    unique: value.length > 0 && !/(.)\1{2,}/.test(value) && new Set(value).size >= 6
  };
  Object.entries(rules).forEach(([key, pass]) => setCriterion(key, pass));

  let score = 0;
  if (value.length >= 8) score += 15;
  if (value.length >= 12) score += 15;
  if (value.length >= 16) score += 10;
  if (/[a-z]/.test(value)) score += 10;
  if (/[A-Z]/.test(value)) score += 10;
  if (/\d/.test(value)) score += 10;
  if (/[^A-Za-z0-9]/.test(value)) score += 15;
  if (new Set(value).size >= 8) score += 10;
  if (value && !/(.)\1{2,}/.test(value)) score += 5;
  if (/password|123456|qwerty|admin/i.test(value)) score = Math.min(score, 25);
  score = Math.min(score, 100);

  let label = 'Weak', color = '#e45e67', message = 'This password needs improvement.';
  if (score >= 75) { label = 'Strong'; color = '#159b7b'; message = 'Good password quality. Keep it unique for this account.'; }
  else if (score >= 45) { label = 'Medium'; color = '#d99b36'; message = 'A few improvements can make this password stronger.'; }
  if (!value) { label = 'Not checked'; message = 'Your score will appear here as you type.'; }

  scoreNode.textContent = score;
  rating.textContent = label;
  rating.style.color = value ? color : '';
  summary.textContent = message;
  dial.style.background = `conic-gradient(${color} ${score * 3.6}deg, #e5eeeb 0deg)`;

  const tips = [];
  if (!rules.length) tips.push('make it at least 12 characters');
  if (!rules.case) tips.push('mix uppercase and lowercase letters');
  if (!rules.number) tips.push('add a number');
  if (!rules.symbol) tips.push('add a special symbol');
  if (!rules.unique) tips.push('use more varied characters and avoid repeats');
  if (/password|123456|qwerty|admin/i.test(value)) tips.push('avoid common words and sequences');
  tip.textContent = !value ? '🔎 Your personalized tips will show here.' :
    tips.length ? `💡 Try to ${tips.join('; ')}.` : '✓ Great progress! Use a different password for every account and store it in a trusted password manager.';
}
input.addEventListener('input', () => checkPassword(input.value));
