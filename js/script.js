const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');

menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Открыть меню' : 'Закрыть меню');
  nav.classList.toggle('open', !isOpen);
});

nav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Открыть меню');
    nav.classList.remove('open');
  });
});

document.querySelector('#year').textContent = new Date().getFullYear();

const bookingDialog = document.querySelector('#booking-dialog');
const bookingForm = document.querySelector('#booking-form');
const bookingDay = document.querySelector('#booking-day');
const bookingTime = document.querySelector('#booking-time');
const bookingStatus = document.querySelector('#booking-status');
const bookingResult = document.querySelector('#booking-result');
const bookingMessage = document.querySelector('#booking-message');
const bookingCopy = document.querySelector('#booking-copy');

function openBooking(day = '', time = '') {
  bookingForm.reset();
  bookingStatus.textContent = '';
  bookingResult.hidden = true;
  bookingMessage.value = '';
  bookingDay.value = day;
  bookingTime.value = time;
  bookingDialog.showModal();
  requestAnimationFrame(() => (day ? document.querySelector('#booking-subject') : bookingDay).focus());
}

document.querySelector('#booking-open').addEventListener('click', () => openBooking());
document.querySelectorAll('.schedule-slot').forEach((slot) => {
  slot.addEventListener('click', () => openBooking(slot.dataset.day, slot.dataset.time));
});
document.querySelector('.booking-close').addEventListener('click', () => bookingDialog.close());
bookingDialog.addEventListener('click', (event) => {
  if (event.target === bookingDialog) bookingDialog.close();
});

bookingForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!bookingForm.reportValidity()) return;
  const values = new FormData(bookingForm);
  const lines = [
    'Здравствуйте! Хочу записаться на занятие.',
    `День недели: ${values.get('day')}`,
    `Время: ${values.get('time')}`,
    `Предмет: ${values.get('subject')}`,
    `Мой телефон или email: ${values.get('contact')}`,
  ];
  const comment = String(values.get('comment') || '').trim();
  if (comment) lines.push(`Комментарий: ${comment}`);
  bookingMessage.value = lines.join('\n');
  bookingResult.hidden = false;
  bookingStatus.textContent = 'Заявка подготовлена. Скопируйте текст и отправьте его на shalburovda@gmail.com.';
  try {
    await navigator.clipboard.writeText(bookingMessage.value);
    bookingStatus.textContent = 'Текст заявки скопирован. Отправьте его на shalburovda@gmail.com.';
  } catch {
    bookingMessage.focus();
    bookingMessage.select();
  }
});

bookingCopy.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(bookingMessage.value);
    bookingStatus.textContent = 'Текст заявки скопирован. Отправьте его на shalburovda@gmail.com.';
  } catch {
    bookingMessage.focus();
    bookingMessage.select();
    bookingStatus.textContent = 'Выделите текст заявки и скопируйте его вручную.';
  }
});

