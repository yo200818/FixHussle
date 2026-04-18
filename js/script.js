/* ============================================================
   FIXHUSSLE — SCRIPT.JS
   Interactions, Animations, Form Validation,
   EmailJS (Gmail) + WhatsApp Notifications
   ============================================================ */

'use strict';

/* ============================================================
   EMAILJS CONFIG
   ============================================================ */
const EJS = {
  publicKey:       'VVxt6u8LXUZ2753cf',
  serviceId:       'service_9t5j6ah',
  templateNotify:  'template_qm6v5ej',   // → sends to YOUR Gmail
  templateReply:   'template_1101dk7',   // → sends to CUSTOMER
};

const WHATSAPP_NUMBER = '919449205239';

/* ── Load EmailJS SDK ── */
(function loadEmailJS() {
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
  script.onload = () => emailjs.init(EJS.publicKey);
  document.head.appendChild(script);
})();

/* ============================================================
   LOADER
   ============================================================ */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  if (!loader) return;
  setTimeout(() => loader.classList.add('hidden'), 1600);
});

/* ============================================================
   NAVBAR
   ============================================================ */
const navbar = document.querySelector('.navbar');
let lastScrollY = window.scrollY;

function handleNavScroll() {
  if (window.scrollY > 40) {
    navbar?.classList.add('scrolled');
  } else {
    navbar?.classList.remove('scrolled');
  }
  lastScrollY = window.scrollY;
}
window.addEventListener('scroll', handleNavScroll, { passive: true });
handleNavScroll();

/* ── Active nav link ── */
function setActiveNavLink() {
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}
setActiveNavLink();

/* ── Mobile nav toggle ── */
const hamburger = document.querySelector('.hamburger');
const mobileNav = document.querySelector('.mobile-nav');

hamburger?.addEventListener('click', () => {
  const isOpen = hamburger.classList.toggle('open');
  mobileNav?.classList.toggle('open', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

document.querySelectorAll('.mobile-nav a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger?.classList.remove('open');
    mobileNav?.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ============================================================
   SCROLL REVEAL
   ============================================================ */
function initReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  elements.forEach(el => observer.observe(el));
}

/* ── Progress bars ── */
function initProgressBars() {
  const fills = document.querySelectorAll('.progress-fill');
  if (!fills.length) return;
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('animated'), 200);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  fills.forEach(el => observer.observe(el));
}

/* ── Counter animation ── */
function animateCounter(el, target, duration = 1800) {
  const start = performance.now();
  const isDecimal = target % 1 !== 0;
  function update(time) {
    const elapsed  = time - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3);
    const current  = eased * target;
    el.textContent = isDecimal ? current.toFixed(1) : Math.floor(current).toLocaleString();
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = isDecimal ? target.toFixed(1) : target.toLocaleString();
  }
  requestAnimationFrame(update);
}

function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target, parseFloat(entry.target.dataset.count));
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  counters.forEach(el => observer.observe(el));
}

/* ── Card tilt ── */
function initTilt() {
  document.querySelectorAll('.glass-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 2;
      const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 2;
      card.style.transform = `translateY(-4px) rotateX(${y * -3}deg) rotateY(${x * 3}deg)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
}

/* ============================================================
   FORM VALIDATION
   ============================================================ */
const validators = {
  required:  (val)      => val.trim().length > 0,
  email:     (val)      => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
  phone:     (val)      => /^[\d\s\+\-\(\)]{8,15}$/.test(val),
  minLength: (val, len) => val.trim().length >= len,
};

const errorMessages = {
  name:            'Please enter your full name.',
  phone:           'Please enter a valid phone number (8–15 digits).',
  email:           'Please enter a valid email address.',
  service:         'Please select a service type.',
  device:          'Please describe your device.',
  problem:         'Please describe the problem (at least 20 characters).',
  date:            'Please select a preferred date.',
  address:         'Please enter your address.',
  contact_name:    'Please enter your name.',
  contact_email:   'Please enter a valid email address.',
  contact_subject: 'Please enter a subject.',
  contact_message: 'Please enter your message (at least 20 characters).',
};

function validateField(input) {
  const name  = input.name;
  const value = input.value;
  let valid   = true;

  switch (name) {
    case 'name':
    case 'contact_name':    valid = validators.required(value); break;
    case 'phone':           valid = validators.required(value) && validators.phone(value); break;
    case 'email':
    case 'contact_email':   valid = validators.required(value) && validators.email(value); break;
    case 'service':
    case 'device':
    case 'address':
    case 'contact_subject': valid = validators.required(value); break;
    case 'problem':
    case 'contact_message': valid = validators.minLength(value, 20); break;
    case 'date':
      valid = validators.required(value);
      if (valid) {
        const selected = new Date(value);
        const today    = new Date();
        today.setHours(0, 0, 0, 0);
        valid = selected >= today;
      }
      break;
    default: valid = validators.required(value);
  }

  const group = input.closest('.form-group');
  const errEl = group?.querySelector('.error-msg');

  if (!valid) {
    input.classList.add('error');
    if (errEl) { errEl.textContent = errorMessages[name] || 'This field is required.'; errEl.classList.add('visible'); }
  } else {
    input.classList.remove('error');
    if (errEl) errEl.classList.remove('visible');
  }
  return valid;
}

function initFormValidation(formId, onSuccess) {
  const form = document.getElementById(formId);
  if (!form) return;

  const inputs = form.querySelectorAll('input, select, textarea');

  inputs.forEach(input => {
    input.addEventListener('blur',  () => validateField(input));
    input.addEventListener('input', () => { if (input.classList.contains('error')) validateField(input); });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let allValid = true;
    inputs.forEach(input => { if (!validateField(input)) allValid = false; });

    if (allValid) {
      const submitBtn = form.querySelector('.btn-submit');
      if (submitBtn) { submitBtn.classList.add('loading'); submitBtn.disabled = true; }

      if (typeof onSuccess === 'function') onSuccess(form, submitBtn);
    }
  });
}

/* ============================================================
   EMAILJS — SEND EMAILS SILENTLY
   ============================================================ */
function sendBookingEmails(form) {
  const name    = form.querySelector('#name')?.value    || '';
  const phone   = form.querySelector('#phone')?.value   || '';
  const email   = form.querySelector('#email')?.value   || '';
  const service = form.querySelector('#service')?.selectedOptions[0]?.text || '';
  const device  = form.querySelector('#device')?.value  || '';
  const problem = form.querySelector('#problem')?.value || '';
  const date    = form.querySelector('#date')?.value    || '';
  const address = form.querySelector('#address')?.value || '';

  const templateParams = {
    name, phone, email, service, device, problem, date, address,
  };

  // 1️⃣ Notify YOU (goes to your Gmail)
  emailjs.send(EJS.serviceId, EJS.templateNotify, templateParams)
    .then(() => console.log('✅ Owner notification sent'))
    .catch(err => console.error('❌ Owner notification failed:', err));

  // 2️⃣ Auto-reply to CUSTOMER
  emailjs.send(EJS.serviceId, EJS.templateReply, templateParams)
    .then(() => console.log('✅ Customer auto-reply sent'))
    .catch(err => console.error('❌ Customer auto-reply failed:', err));
}

/* ============================================================
   WHATSAPP — SILENT BACKGROUND OPEN
   ============================================================ */
function sendBookingToWhatsApp(form) {
  const name    = form.querySelector('#name')?.value    || '';
  const phone   = form.querySelector('#phone')?.value   || '';
  const email   = form.querySelector('#email')?.value   || '';
  const service = form.querySelector('#service')?.selectedOptions[0]?.text || '';
  const device  = form.querySelector('#device')?.value  || '';
  const problem = form.querySelector('#problem')?.value || '';
  const date    = form.querySelector('#date')?.value    || '';
  const address = form.querySelector('#address')?.value || '';

  const message =
    `🔧 *NEW BOOKING — FixHussle*\n\n` +
    `👤 *Name:* ${name}\n` +
    `📞 *Phone:* ${phone}\n` +
    `✉️ *Email:* ${email}\n\n` +
    `🛠️ *Service:* ${service}\n` +
    `📱 *Device:* ${device}\n` +
    `📅 *Date:* ${date}\n` +
    `📍 *Address:* ${address}\n\n` +
    `❗ *Problem:*\n${problem}`;

  // Opens WhatsApp in background tab — user stays on success screen
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
}

function sendContactToWhatsApp(form) {
  const name    = form.querySelector('#contact_name')?.value    || '';
  const email   = form.querySelector('#contact_email')?.value   || '';
  const subject = form.querySelector('#contact_subject')?.value || '';
  const message = form.querySelector('#contact_message')?.value || '';

  const text =
    `📩 *NEW MESSAGE — FixHussle*\n\n` +
    `👤 *Name:* ${name}\n` +
    `✉️ *Email:* ${email}\n` +
    `📌 *Subject:* ${subject}\n\n` +
    `💬 *Message:*\n${message}`;

  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, '_blank');
}

/* ============================================================
   BOOKING FORM
   ============================================================ */
function initBookingForm() {
  initFormValidation('booking-form', (form, submitBtn) => {

    // Fire emails silently in background
    sendBookingEmails(form);

    // Show success screen after short delay (feels natural)
    setTimeout(() => {
      if (submitBtn) { submitBtn.classList.remove('loading'); submitBtn.disabled = false; }
      const formContent = document.querySelector('.booking-form-content');
      const successMsg  = document.querySelector('.success-message');
      if (formContent) formContent.style.display = 'none';
      if (successMsg)  successMsg.classList.add('visible');
    }, 1800);
  });

  // Set min date to today
  const dateInput = document.getElementById('date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }
}

/* ============================================================
   CONTACT FORM
   ============================================================ */
function initContactForm() {
  initFormValidation('contact-form', (form, submitBtn) => {

    setTimeout(() => {
      if (submitBtn) { submitBtn.classList.remove('loading'); submitBtn.disabled = false; }
      const formContent = document.querySelector('.contact-form-content');
      const successMsg  = document.querySelector('.contact-success');
      if (formContent) formContent.style.display = 'none';
      if (successMsg)  successMsg.classList.add('visible');
    }, 1800);
  });
}

/* ============================================================
   PAGE TRANSITIONS
   ============================================================ */
function initPageTransitions() {
  const overlay = document.createElement('div');
  overlay.className = 'page-transition-overlay';
  document.body.appendChild(overlay);

  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel')) return;
    link.addEventListener('click', (e) => {
      e.preventDefault();
      overlay.classList.add('entering');
      setTimeout(() => { window.location.href = href; }, 480);
    });
  });

  overlay.classList.add('entering');
  setTimeout(() => {
    overlay.classList.remove('entering');
    overlay.classList.add('leaving');
    setTimeout(() => overlay.classList.remove('leaving'), 500);
  }, 50);
}

/* ── Particles ── */
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W = canvas.width  = window.innerWidth;
  let H = canvas.height = window.innerHeight;
  window.addEventListener('resize', () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; });
  const particles = Array.from({ length: 40 }, () => ({
    x: Math.random() * W, y: Math.random() * H,
    r: Math.random() * 1.5 + 0.5,
    vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
    alpha: Math.random() * 0.4 + 0.1,
  }));
  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(41, 121, 255, ${p.alpha})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
}

/* ── Service preselect ── */
function initServiceLinks() {
  document.querySelectorAll('[data-book-service]').forEach(btn => {
    btn.addEventListener('click', () => {
      sessionStorage.setItem('preselect_service', btn.dataset.bookService);
      window.location.href = 'booking.html';
    });
  });
}

function initPreselectService() {
  const select = document.getElementById('service');
  if (!select) return;
  const preselect = sessionStorage.getItem('preselect_service');
  if (preselect) {
    const match = Array.from(select.options).find(o => o.value.toLowerCase().includes(preselect.toLowerCase()));
    if (match) select.value = match.value;
    sessionStorage.removeItem('preselect_service');
  }
}

/* ── Anchor scrolls ── */
function initAnchorScrolls() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.getElementById(link.getAttribute('href').slice(1));
      if (target) {
        e.preventDefault();
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 90, behavior: 'smooth' });
      }
    });
  });
}

/* ── Magnetic buttons ── */
function initMagneticBtns() {
  document.querySelectorAll('.btn-primary').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 8;
      const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 8;
      btn.style.transform = `translateY(-2px) translate(${x}px, ${y}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });
}

/* ============================================================
   INIT ALL
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initReveal();
  initProgressBars();
  initCounters();
  initTilt();
  initPageTransitions();
  initParticles();
  initServiceLinks();
  initPreselectService();
  initAnchorScrolls();
  initMagneticBtns();
  initBookingForm();
  initContactForm();
});
