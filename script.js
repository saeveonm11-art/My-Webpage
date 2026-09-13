const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('.site-nav');

if (navToggle && siteNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
}

const form = document.getElementById('contact-form-element');
const status = document.getElementById('form-status');

function clearFieldError(input) {
  if (!input) return;

  const wrapper = input.closest('.form-row');
  const error = document.getElementById(input.id + '-error');

  if (wrapper) wrapper.classList.remove('field-error');
  if (error) error.textContent = '';
  input.removeAttribute('aria-invalid');

  if (status) {
    status.textContent = '';
    status.className = 'form-status';
  }
}

['name', 'email', 'message', 'phone'].forEach((id) => {
  const field = document.getElementById(id);
  if (field) {
    field.addEventListener('input', () => clearFieldError(field));
  }
});

if (form) {
  form.addEventListener('submit', function (event) {
    event.preventDefault();

    const fields = [
      { name: 'name', errorId: 'name-error', message: 'Please enter your name.' },
      { name: 'email', errorId: 'email-error', message: 'Please enter a valid email address.' },
      { name: 'message', errorId: 'message-error', message: 'Please share a short message.' }
    ];

    let valid = true;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    fields.forEach((field) => {
      const input = form.elements[field.name];
      const error = document.getElementById(field.errorId);
      const wrapper = input.closest('.form-row');

      input.removeAttribute('aria-invalid');
      if (wrapper) wrapper.classList.remove('field-error');
      if (error) error.textContent = '';

      if (!input.value.trim()) {
        valid = false;
        input.setAttribute('aria-invalid', 'true');
        if (wrapper) wrapper.classList.add('field-error');
        if (error) error.textContent = field.message;
      } else if (field.name === 'email' && !emailPattern.test(input.value.trim())) {
        valid = false;
        input.setAttribute('aria-invalid', 'true');
        if (wrapper) wrapper.classList.add('field-error');
        if (error) error.textContent = field.message;
      }
    });

    const phoneInput = form.elements.phone;
    const phoneError = document.getElementById('phone-error');

    if (phoneInput && phoneInput.value.trim() && !/^[0-9\-\s()]{7,15}$/.test(phoneInput.value.trim())) {
      valid = false;
      phoneInput.setAttribute('aria-invalid', 'true');
      const phoneWrapper = phoneInput.closest('.form-row');
      if (phoneWrapper) phoneWrapper.classList.add('field-error');
      if (phoneError) phoneError.textContent = 'Please enter a phone number with 7 to 15 digits.';
    }

    if (!valid) {
      if (status) {
        status.textContent = 'Please correct the highlighted fields before sending your message.';
        status.className = 'form-status error';
      }
      return;
    }

    form.reset();
    if (status) {
      status.textContent = 'Thank you for reaching out. I will reply soon.';
      status.className = 'form-status success';
    }

    fetchQuote();
  });
}

const apiBtn = document.getElementById('fetch-quote-btn');
const apiResult = document.getElementById('api-result');

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[char]));
}

function fetchQuote() {
  if (!apiResult) return;

  apiResult.textContent = 'Loading…';

  fetch('https://api.quotable.io/random')
    .then((response) => {
      if (!response.ok) throw new Error('Network response was not ok: ' + response.status);
      return response.json();
    })
    .then((data) => {
      apiResult.innerHTML = `<blockquote>"${escapeHtml(data.content)}"</blockquote><p>— ${escapeHtml(data.author)}</p>`;
    })
    .catch((error) => {
      apiResult.textContent = 'Unable to load a quote right now. Please try again later.';
      console.error('Fetch error:', error);
    });
}

if (apiBtn) {
  apiBtn.addEventListener('click', fetchQuote);
}
