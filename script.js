(() => {
  const body = document.body;
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#site-nav');

  menuToggle?.addEventListener('click', () => {
    const open = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!open));
    nav.classList.toggle('is-open', !open);
    menuToggle.querySelector('.sr-only').textContent = open ? 'Открыть меню' : 'Закрыть меню';
  });

  nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    menuToggle?.setAttribute('aria-expanded', 'false');
    nav.classList.remove('is-open');
  }));

  const modal = document.querySelector('#brief-modal');
  const openButtons = document.querySelectorAll('.open-modal');
  const closeButton = modal?.querySelector('.modal-close');
  let lastFocused;

  const openModal = () => {
    if (!modal) return;
    lastFocused = document.activeElement;
    if (typeof modal.showModal === 'function') {
      modal.showModal();
    } else {
      modal.setAttribute('open', '');
    }
    modal.classList.add('is-open');
    body.classList.add('modal-open');
    modal.querySelector('input')?.focus();
  };
  const closeModal = () => {
    if (!modal?.open && !modal?.classList.contains('is-open')) return;
    if (typeof modal.close === 'function' && modal.open) {
      modal.close();
    } else {
      modal.removeAttribute('open');
    }
    modal.classList.remove('is-open');
    body.classList.remove('modal-open');
    lastFocused?.focus();
  };
  openButtons.forEach((button) => button.addEventListener('click', openModal));
  closeButton?.addEventListener('click', closeModal);
  modal?.addEventListener('click', (event) => {
    if (event.target === modal) closeModal();
  });
  modal?.addEventListener('cancel', (event) => {
    event.preventDefault();
    closeModal();
  });
  modal?.addEventListener('keydown', (event) => {
    if (event.key !== 'Tab') return;
    const focusable = [...modal.querySelectorAll('button, input, [href], select, textarea')].filter((el) => !el.disabled);
    if (focusable.length < 2) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });

  const validators = {
    name: (value) => value.trim().length >= 2 ? '' : 'Введите имя (минимум 2 символа).',
    email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Проверьте адрес электронной почты.',
    message: (value) => value.trim().length >= 20 ? '' : 'Расскажите чуть подробнее (от 20 символов).',
    consent: (value, checked) => checked ? '' : 'Нужно согласие, чтобы отправить заявку.'
  };

  const setError = (field, message) => {
    const input = document.querySelector(`#${field}`);
    const error = document.querySelector(`[data-error-for="${field}"]`);
    if (input) input.classList.toggle('has-error', Boolean(message));
    if (error) error.textContent = message;
    return !message;
  };

  const contactForm = document.querySelector('#contact-form');
  contactForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(contactForm);
    const valid = [
      setError('name', validators.name(data.get('name') || '')),
      setError('email', validators.email(data.get('email') || '')),
      setError('message', validators.message(data.get('message') || '')),
      setError('consent', validators.consent('', Boolean(data.get('consent'))))
    ].every(Boolean);
    const status = contactForm.querySelector('.form-status');
    if (!valid) { status.textContent = 'Проверьте отмеченные поля.'; return; }
    status.textContent = 'Спасибо! Заявка сохранена в демо-режиме — я свяжусь с вами по почте.';
    status.style.color = 'var(--cobalt)';
    contactForm.reset();
  });

  const briefForm = document.querySelector('#brief-form');
  briefForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    const input = briefForm.querySelector('input');
    const message = validators.email(input.value);
    const error = briefForm.querySelector('[data-error-for="brief-email"]');
    input.classList.toggle('has-error', Boolean(message));
    error.textContent = message;
    const status = briefForm.querySelector('.form-status');
    if (message) { status.textContent = ''; return; }
    status.textContent = 'Готово! Проверьте почту — вопросы уже в пути.';
    status.style.color = 'var(--cobalt)';
    briefForm.reset();
  });

  document.querySelectorAll('.work-card').forEach((card) => card.addEventListener('click', () => {
    const message = document.querySelector('#message');
    const project = card.dataset.project;
    if (message && project && !message.value) message.value = `Хочу обсудить проект «${project}». `;
  }));

  document.querySelectorAll('img').forEach((image) => image.addEventListener('error', () => {
    image.alt = `${image.alt} (изображение недоступно)`;
    image.classList.add('image-error');
  }));
})();
