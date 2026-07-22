/* =============================================================
   MOWLA DIGITAL — PORTFOLIO CLIENT SCRIPT (BLOGGER VERSION)
   Same navbar / reveal / counter / skill-bar / filter behaviour
   as the original build. The contact form module is new:
   validation, loading spinner, Google Sheets fetch() integration,
   and the Thank You popup.
   ============================================================= */

// -----------------------------------------------------------------
// !! PASTE YOUR GOOGLE APPS SCRIPT WEB APP URL BELOW !!
// Deploy the companion Apps Script (see AppsScript-Backend.gs) as
// a Web App ("Anyone" access), copy the deployment URL, and paste
// it here. Do not hardcode a spreadsheet ID anywhere on this page —
// the ID only lives inside the Apps Script project itself.
// -----------------------------------------------------------------
const SCRIPT_URL = "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL";

document.addEventListener('DOMContentLoaded', function () {
  initNavbar();
  initMobileMenu();
  initScrollReveal();
  initCounters();
  initSkillBars();
  initPortfolioFilter();
  initContactForm();
  initFooterYear();
});

/* ---------- Sticky navbar shadow on scroll + active link ---------- */
function initNavbar() {
  var navbar = document.getElementById('navbar');
  if (!navbar) return;

  function onScroll() {
    if (window.scrollY > 12) {
      navbar.classList.add('is-scrolled');
    } else {
      navbar.classList.remove('is-scrolled');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  var links = document.querySelectorAll('.nav-links a');
  var sections = Array.prototype.map.call(links, function (link) {
    var id = link.getAttribute('href').replace('#', '');
    return document.getElementById(id);
  });

  function onSectionScroll() {
    var scrollPos = window.scrollY + 120;
    sections.forEach(function (section, i) {
      if (!section) return;
      var top = section.offsetTop;
      var bottom = top + section.offsetHeight;
      if (scrollPos >= top && scrollPos < bottom) {
        links.forEach(function (l) { l.classList.remove('active'); });
        links[i].classList.add('active');
      }
    });
  }
  window.addEventListener('scroll', onSectionScroll, { passive: true });
}

/* ---------- Mobile / tablet hamburger menu ---------- */
function initMobileMenu() {
  var toggle = document.getElementById('navToggle');
  var menu = document.getElementById('navMenu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', function () {
    var isOpen = menu.classList.toggle('open');
    toggle.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  menu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      menu.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ---------- Fade / slide reveal on scroll ---------- */
function initScrollReveal() {
  var items = document.querySelectorAll('[data-reveal]');
  if (!items.length) return;

  if (!('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('is-visible'); });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  items.forEach(function (el) { observer.observe(el); });
}

/* ---------- Animated number counters ---------- */
function initCounters() {
  var counters = document.querySelectorAll('.counter');
  if (!counters.length) return;

  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-count'), 10) || 0;
    var duration = 1400;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target;
      }
    }
    requestAnimationFrame(step);
  }

  if (!('IntersectionObserver' in window)) {
    counters.forEach(animateCounter);
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(function (el) { observer.observe(el); });
}

/* ---------- Skill progress bars ---------- */
function initSkillBars() {
  var bars = document.querySelectorAll('.skill-fill');
  if (!bars.length) return;

  if (!('IntersectionObserver' in window)) {
    bars.forEach(function (el) { el.style.width = el.getAttribute('data-width') + '%'; });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var el = entry.target;
        el.style.width = el.getAttribute('data-width') + '%';
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.4 });

  bars.forEach(function (el) { observer.observe(el); });
}

/* ---------- Portfolio filter ---------- */
function initPortfolioFilter() {
  var buttons = document.querySelectorAll('.filter-btn');
  var cards = document.querySelectorAll('.portfolio-card');
  if (!buttons.length || !cards.length) return;

  buttons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      buttons.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');

      var filter = btn.getAttribute('data-filter');
      cards.forEach(function (card) {
        var match = filter === 'all' || card.getAttribute('data-category') === filter;
        card.style.display = match ? '' : 'none';
      });
    });
  });
}

/* ---------- Footer year ---------- */
function initFooterYear() {
  var el = document.getElementById('footerYear');
  if (el) el.textContent = new Date().getFullYear();
}

/* =================================================================
   CONTACT FORM — validation, loading state, Google Sheets fetch(),
   and the Thank You popup.
   ================================================================= */
function initContactForm() {
  var form = document.getElementById('contactForm');
  if (!form) return;

  var submitBtn = document.getElementById('submitBtn');
  var popup = document.getElementById('successPopup');
  var popupCloseBtn = document.getElementById('popupCloseBtn');
  var popupAutoCloseTimer = null;

  var fields = {
    fullName: { el: document.getElementById('fullName'), required: true, type: 'text', label: 'Full Name' },
    email:    { el: document.getElementById('email'),    required: true, type: 'email', label: 'Email Address' },
    phone:    { el: document.getElementById('phone'),    required: true, type: 'phone', label: 'Phone Number' },
    company:  { el: document.getElementById('company'),  required: false, type: 'text', label: 'Company Name' },
    subject:  { el: document.getElementById('subject'),  required: true, type: 'text', label: 'Subject' },
    message:  { el: document.getElementById('message'),  required: true, type: 'text', label: 'Message' }
  };

  var EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var PHONE_REGEX = /^[+]?[0-9\s-]{7,15}$/;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validateForm()) return;
    submitForm();
  });

  // Clear a field's error state as soon as the user edits it
  Object.keys(fields).forEach(function (key) {
    var f = fields[key];
    if (!f.el) return;
    f.el.addEventListener('input', function () {
      clearFieldError(key);
    });
  });

  function validateForm() {
    var isValid = true;

    Object.keys(fields).forEach(function (key) {
      var f = fields[key];
      if (!f.el) return;
      var value = f.el.value.trim();
      clearFieldError(key);

      if (f.required && !value) {
        setFieldError(key, f.label + ' is required.');
        isValid = false;
        return;
      }
      if (value && f.type === 'email' && !EMAIL_REGEX.test(value)) {
        setFieldError(key, 'Enter a valid email address.');
        isValid = false;
      }
      if (value && f.type === 'phone' && !PHONE_REGEX.test(value)) {
        setFieldError(key, 'Enter a valid phone number.');
        isValid = false;
      }
    });

    return isValid;
  }

  function setFieldError(key, msg) {
    var f = fields[key];
    if (f.el) f.el.classList.add('invalid');
    var errEl = document.getElementById('err-' + key);
    if (errEl) errEl.textContent = msg;
  }

  function clearFieldError(key) {
    var f = fields[key];
    if (f.el) f.el.classList.remove('invalid');
    var errEl = document.getElementById('err-' + key);
    if (errEl) errEl.textContent = '';
  }

  function detectDevice() {
    var w = window.innerWidth;
    if (w <= 767) return 'Mobile';
    if (w <= 1024) return 'Tablet';
    return 'Desktop';
  }

  function detectBrowser() {
    var ua = navigator.userAgent;
    if (ua.indexOf('Edg') > -1) return 'Edge';
    if (ua.indexOf('Chrome') > -1) return 'Chrome';
    if (ua.indexOf('Firefox') > -1) return 'Firefox';
    if (ua.indexOf('Safari') > -1) return 'Safari';
    return 'Other';
  }

  // Best-effort public IP lookup. Non-blocking: if it fails or is
  // slow, the form still submits with IP left blank.
  function getVisitorIP() {
    return Promise.race([
      fetch('https://api.ipify.org?format=json')
        .then(function (r) { return r.json(); })
        .then(function (data) { return data.ip || ''; })
        .catch(function () { return ''; }),
      new Promise(function (resolve) { setTimeout(function () { resolve(''); }, 1500); })
    ]);
  }

  function submitForm() {
    submitBtn.classList.add('btn-loading');
    submitBtn.disabled = true;

    var now = new Date();

    getVisitorIP().then(function (ip) {
      var payload = {
        'Full Name': fields.fullName.el.value.trim(),
        'Email': fields.email.el.value.trim(),
        'Phone': fields.phone.el.value.trim(),
        'Company': fields.company.el.value.trim(),
        'Subject': fields.subject.el.value.trim(),
        'Message': fields.message.el.value.trim(),
        'Date': now.toLocaleDateString(),
        'Time': now.toLocaleTimeString(),
        'Browser': detectBrowser(),
        'Device': detectDevice(),
        'IP': ip,
        'Status': 'New Lead'
      };

      // "text/plain" content-type avoids a CORS preflight request
      // against the Apps Script Web App endpoint. The companion
      // doPost() reads it back out with JSON.parse(e.postData.contents).
      return fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      });
    })
    .then(function () {
      onSubmitSuccess();
    })
    .catch(function () {
      onSubmitError();
    });
  }

  function onSubmitSuccess() {
    submitBtn.classList.remove('btn-loading');
    submitBtn.disabled = false;
    form.reset();
    showPopup();
  }

  function onSubmitError() {
    submitBtn.classList.remove('btn-loading');
    submitBtn.disabled = false;
    setFieldError('subject', 'Could not send your message. Please check your connection and try again.');
  }

  function showPopup() {
    if (!popup) return;
    popup.classList.add('show');
    popupAutoCloseTimer = setTimeout(hidePopup, 4000);
  }

  function hidePopup() {
    if (!popup) return;
    popup.classList.remove('show');
    if (popupAutoCloseTimer) {
      clearTimeout(popupAutoCloseTimer);
      popupAutoCloseTimer = null;
    }
  }

  if (popupCloseBtn) popupCloseBtn.addEventListener('click', hidePopup);
  if (popup) {
    popup.addEventListener('click', function (e) {
      if (e.target === popup) hidePopup();
    });
  }
}
