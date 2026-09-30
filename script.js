/* ============================================================
   CUVMARKET GLOBAL LLC — script.js
   ============================================================ */
(function () {
  'use strict';

  /* ---------- Año actual en el footer ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---------- Menú móvil ---------- */
  var menuToggle = document.getElementById('menuToggle');
  var mainNav = document.getElementById('mainNav');
  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', function () {
      var open = mainNav.classList.toggle('open');
      menuToggle.classList.toggle('open', open);
      menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    mainNav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        mainNav.classList.remove('open');
        menuToggle.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- FAQ acordeón ---------- */
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var btn = item.querySelector('.faq-q');
    var panel = item.querySelector('.faq-a');
    btn.addEventListener('click', function () {
      var isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(function (other) {
        other.classList.remove('open');
        other.querySelector('.faq-a').style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add('open');
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });
  });

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ---------- Scrollspy ---------- */
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.main-nav a:not(.nav-cta)');
  if ('IntersectionObserver' in window && navLinks.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          navLinks.forEach(function (l) {
            l.style.color = l.getAttribute('href') === '#' + entry.target.id ? 'var(--accent)' : '';
          });
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- Formulario de contacto ---------- */
  var form = document.getElementById('contactForm');
  var status = document.getElementById('formStatus');

  function showStatus(ok, msg) {
    status.className = 'form-status ' + (ok ? 'ok' : 'err');
    status.textContent = msg;
  }

  var MSG_OK = 'Consulta enviada. Te contactaremos a la brevedad.';
  var MSG_ERROR = 'No pudimos enviar tu consulta. Escribinos por WhatsApp al +1 317 434 1508 o a info@cuvmarketglobal.com.';

  if (form) {
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      var accessKey = form.querySelector('input[name="access_key"]').value;
      if (accessKey.indexOf('TU_ACCESS_KEY') === 0) {
        // Formulario aún sin configurar: ofrecer alternativas de contacto.
        showStatus(false, MSG_ERROR);
        return;
      }

      var btn = form.querySelector('button[type="submit"]');
      var original = btn.innerHTML;
      btn.disabled = true;
      btn.textContent = 'Enviando…';

      var data = new FormData(form);

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      })
        .then(function (res) { return res.json(); })
        .then(function (json) {
          if (json.success) {
            showStatus(true, MSG_OK);
            form.reset();
          } else {
            showStatus(false, MSG_ERROR);
          }
        })
        .catch(function () {
          showStatus(false, MSG_ERROR);
        })
        .finally(function () {
          btn.disabled = false;
          btn.innerHTML = original;
        });
    });
  }
})();
