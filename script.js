/* Roman Foundation Repair — script.js (vanilla JS, no dependencies) */
(function () {
  'use strict';

  document.documentElement.classList.add('js');

  var PHONE_TEL = 'tel:+18324683075';
  var PHONE_SMS = 'sms:+18324683075';
  var PHONE_DISPLAY = '(832) 468-3075';

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- Sticky header shadow ---------- */
  var header = document.querySelector('.site-header');
  function onScroll() { if (header) header.classList.toggle('is-scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile navigation ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('primary-nav');

  function setNav(open) {
    if (!toggle || !nav) return;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    nav.classList.toggle('is-open', open);
    document.body.classList.toggle('nav-open', open);
    if (open) {
      var first = nav.querySelector('a');
      if (first) first.focus();
    }
  }
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      setNav(toggle.getAttribute('aria-expanded') !== 'true');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setNav(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) { setNav(false); toggle.focus(); }
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 1020 && nav.classList.contains('is-open')) setNav(false);
    });
  }

  /* ---------- Current-section highlight in nav ---------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.primary-nav ul a'));
  var sectionIds = ['services', 'projects', 'about', 'contact'];
  if ('IntersectionObserver' in window) {
    var sectionObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (a) {
          var on = a.getAttribute('href') === '#' + entry.target.id;
          a.classList.toggle('is-current', on);
          if (on) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sectionIds.forEach(function (id) { var el = document.getElementById(id); if (el) sectionObs.observe(el); });
  }

  /* ---------- Reveal on scroll ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var revObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); revObs.unobserve(entry.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { revObs.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.acc-trigger').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var expanded = btn.getAttribute('aria-expanded') === 'true';
      var panel = document.getElementById(btn.getAttribute('aria-controls'));
      btn.setAttribute('aria-expanded', String(!expanded));
      if (panel) panel.hidden = expanded;
    });
  });

  /* ---------- Gallery filters ---------- */
  var filterBtns = document.querySelectorAll('.filter-btn');
  var items = Array.prototype.slice.call(document.querySelectorAll('.gallery-item'));
  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var f = btn.getAttribute('data-filter');
      filterBtns.forEach(function (b) {
        var on = b === btn;
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-pressed', String(on));
      });
      items.forEach(function (it) { it.hidden = !(f === 'all' || it.getAttribute('data-cat') === f); });
    });
  });

  /* ---------- Lightbox ---------- */
  var lb = document.getElementById('lightbox');
  var lbImg = lb ? lb.querySelector('.lb-img') : null;
  var lbCap = lb ? lb.querySelector('.lb-caption') : null;
  var lbIndex = 0;
  var lbList = [];
  var lastFocus = null;

  function visibleButtons() {
    return items.filter(function (it) { return !it.hidden; }).map(function (it) { return it.querySelector('.gallery-btn'); });
  }
  function showLb(i) {
    if (!lbList.length) return;
    lbIndex = (i + lbList.length) % lbList.length;
    var b = lbList[lbIndex];
    var thumb = b.querySelector('img');
    lbImg.src = b.getAttribute('data-full');
    lbImg.alt = thumb ? thumb.alt : '';
    lbCap.textContent = b.getAttribute('data-caption') + '  (' + (lbIndex + 1) + ' of ' + lbList.length + ')';
  }
  function openLb(btn) {
    lbList = visibleButtons();
    lastFocus = btn;
    showLb(lbList.indexOf(btn));
    lb.hidden = false;
    document.body.style.overflow = 'hidden';
    lb.querySelector('.lb-close').focus();
  }
  function closeLb() {
    lb.hidden = true;
    lbImg.src = '';
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }
  if (lb) {
    document.querySelectorAll('.gallery-btn').forEach(function (btn) {
      btn.addEventListener('click', function () { openLb(btn); });
    });
    lb.querySelector('.lb-close').addEventListener('click', closeLb);
    lb.querySelector('.lb-prev').addEventListener('click', function () { showLb(lbIndex - 1); });
    lb.querySelector('.lb-next').addEventListener('click', function () { showLb(lbIndex + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
    document.addEventListener('keydown', function (e) {
      if (lb.hidden) return;
      if (e.key === 'Escape') closeLb();
      else if (e.key === 'ArrowLeft') showLb(lbIndex - 1);
      else if (e.key === 'ArrowRight') showLb(lbIndex + 1);
      else if (e.key === 'Tab') {
        // Keep focus inside the dialog
        var focusables = Array.prototype.slice.call(lb.querySelectorAll('button'));
        var idx = focusables.indexOf(document.activeElement);
        e.preventDefault();
        var next = e.shiftKey ? idx - 1 : idx + 1;
        focusables[(next + focusables.length) % focusables.length].focus();
      }
    });
    // Touch swipe
    var startX = null;
    lb.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', function (e) {
      if (startX === null) return;
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 50) showLb(lbIndex + (dx < 0 ? 1 : -1));
      startX = null;
    });
  }

  /* ---------- Estimate form ---------- */
  var form = document.getElementById('estimate-form');
  var status = document.getElementById('form-status');
  var serviceSelect = document.getElementById('f-service');

  // Service-card links preselect the matching service
  document.querySelectorAll('[data-service]').forEach(function (link) {
    link.addEventListener('click', function () {
      if (!serviceSelect) return;
      var val = link.getAttribute('data-service');
      Array.prototype.forEach.call(serviceSelect.options, function (o) { if (o.text === val) serviceSelect.value = o.value || o.text; });
    });
  });

  if (!form) return;

  var rules = {
    name: function (v) { return v.trim().length >= 2 ? '' : 'Please enter your full name.'; },
    phone: function (v) { var d = v.replace(/\D/g, ''); if (d.length === 11 && d[0] === '1') d = d.slice(1); return d.length === 10 ? '' : 'Please enter a 10-digit U.S. phone number.'; },
    email: function (v, f) {
      var method = (f.querySelector('input[name="contact_method"]:checked') || {}).value;
      if (!v.trim()) return method === 'Email' ? 'Please enter an email address so we can reply by email.' : '';
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'Please enter a valid email address.';
    },
    zip: function (v) { return /^\d{5}(-\d{4})?$/.test(v.trim()) ? '' : 'Please enter a valid 5-digit ZIP code.'; },
    service: function (v) { return v ? '' : 'Please choose a service (or "Not sure").'; },
    description: function (v) { return v.trim().length >= 10 ? '' : 'Please briefly describe the problem (at least 10 characters).'; }
  };

  function errEl(field) { return document.getElementById(field.getAttribute('aria-describedby')); }
  function validateField(field) {
    var rule = rules[field.name];
    if (!rule) return true;
    var msg = rule(field.value, form);
    field.setAttribute('aria-invalid', msg ? 'true' : 'false');
    var el = errEl(field);
    if (el) el.textContent = msg;
    return !msg;
  }

  Array.prototype.forEach.call(form.elements, function (field) {
    if (!rules[field.name]) return;
    field.addEventListener('blur', function () { if (field.value) validateField(field); });
    field.addEventListener('input', function () { if (field.getAttribute('aria-invalid') === 'true') validateField(field); });
  });
  form.querySelectorAll('input[name="contact_method"]').forEach(function (r) {
    r.addEventListener('change', function () { var em = form.elements.email; if (em.getAttribute('aria-invalid') === 'true' || r.value === 'Email') validateField(em); });
  });

  function escapeHtml(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  function summaryText(data) {
    return 'Estimate request — Roman Foundation Repair\n' +
      'Name: ' + data.get('name') + '\n' +
      'Phone: ' + data.get('phone') + '\n' +
      (data.get('email') ? 'Email: ' + data.get('email') + '\n' : '') +
      'ZIP: ' + data.get('zip') + '\n' +
      'Service: ' + data.get('service') + '\n' +
      'Preferred contact: ' + data.get('contact_method') + '\n' +
      'Problem: ' + data.get('description');
  }

  function showStatus(kind, html) {
    status.className = 'form-status' + (kind ? ' is-' + kind : '');
    status.innerHTML = html;
    status.hidden = false;
    status.focus();
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Honeypot: silently ignore bots
    if (form.elements._gotcha && form.elements._gotcha.value) return;

    var firstInvalid = null;
    Array.prototype.forEach.call(form.elements, function (field) {
      if (rules[field.name] && !validateField(field) && !firstInvalid) firstInvalid = field;
    });
    if (firstInvalid) { firstInvalid.focus(); return; }

    var data = new FormData(form);
    var endpoint = (form.getAttribute('data-endpoint') || '').trim();
    var btn = document.getElementById('submit-btn');

    if (!endpoint) {
      // No backend connected: be honest and hand off to phone / text.
      var smsHref = PHONE_SMS + '?&body=' + encodeURIComponent(summaryText(data));
      showStatus('', '<h3>Almost done — please call or text us</h3>' +
        '<p>Thanks, ' + escapeHtml(String(data.get('name')).split(' ')[0]) + '. Online requests are not connected yet, so <strong>your details have not been sent</strong>. Call us, or tap “Text My Details” to send this request from your phone’s messaging app.</p>' +
        '<div class="btn-row"><a class="btn btn-navy" href="' + PHONE_TEL + '">Call ' + PHONE_DISPLAY + '</a>' +
        '<a class="btn btn-gold" href="' + smsHref + '">Text My Details</a></div>');
      return;
    }

    btn.disabled = true;
    btn.textContent = 'Sending…';
    data.append('_subject', 'New estimate request — ' + data.get('service'));

    fetch(endpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        form.hidden = true;
        showStatus('success', '<h3>Request received</h3><p>Thank you. Your estimate request was sent to Roman Foundation Repair. If it’s urgent, call <a href="' + PHONE_TEL + '">' + PHONE_DISPLAY + '</a>.</p>');
      })
      .catch(function () {
        showStatus('error', '<h3>We couldn’t send your request</h3><p>Something went wrong and your request was <strong>not</strong> sent. Please call us directly.</p><div class="btn-row"><a class="btn btn-navy" href="' + PHONE_TEL + '">Call ' + PHONE_DISPLAY + '</a></div>');
      })
      .then(function () { btn.disabled = false; btn.textContent = 'Request an Estimate'; });
  });
})();
