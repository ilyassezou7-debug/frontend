/* Own visitor funnel for the static /lp pages (no external analytics).
   Sends anonymous steps to api.atlaspure.shop/api/ev: never the name or the phone number - for a phone error only its
   shape (digit script, length, prefix). Watches the page from outside; the order code is not touched. */
(function (w, d) {
  try {
    var ua = navigator.userAgent;
    if (navigator.webdriver || /bot|crawl|spider|slurp|headless|lighthouse|facebookexternalhit|preview/i.test(ua)) return;
    var qs = new URLSearchParams(location.search);
    if (/^LIVECHK/.test(qs.get('fbclid') || '')) return; // our own live tests
    var API = w.__EV_API || 'https://api.atlaspure.shop/api/ev';
    var sid; try { sid = sessionStorage.getItem('lp_sid'); } catch (e) {}
    if (!sid) { sid = Math.random().toString(36).slice(2, 14); try { sessionStorage.setItem('lp_sid', sid); } catch (e) {} }
    var t0 = Date.now(), q = [], seen = {}, maxS = 0, formOpened = 0;
    function ev(name, data, once) {
      if (once) { if (seen[name]) return; seen[name] = 1; }
      q.push(data == null ? [name, Date.now() - t0] : [name, Date.now() - t0, String(data).slice(0, 120)]);
    }
    function body() { var b = JSON.stringify({ s: sid, p: location.pathname.slice(0, 40), e: q }); q = []; return b; }
    function flush(beacon) {
      if (!q.length) return;
      var b = body();
      try {
        if (beacon && navigator.sendBeacon) { navigator.sendBeacon(API, new Blob([b], { type: 'text/plain' })); return; }
        fetch(API, { method: 'POST', body: b, mode: 'no-cors', keepalive: true, headers: { 'Content-Type': 'text/plain' } });
      } catch (e) {}
    }
    setInterval(function () { flush(false); }, 5000);
    // 'still here' every 30 s while the page is open and visible (admin page counts live visitors from this)
    setInterval(function () { if (d.visibilityState === 'visible') { ev('hb'); flush(false); } }, 30000);

    ev('view', qs.get('fbclid') ? 'fb' : (qs.get('utm_source') || (d.referrer ? 'ref' : 'direct')));

    function onScroll() {
      var h = d.documentElement.scrollHeight - innerHeight; if (h <= 0) return;
      var p = Math.min(100, Math.round(100 * scrollY / h));
      [25, 50, 75, 100].forEach(function (m) { if (p >= m - 2 && !seen['s' + m]) { ev('s' + m, null, true); maxS = m; } });
    }
    addEventListener('scroll', onScroll, { passive: true });

    d.addEventListener('click', function (e) {
      var t = e.target && e.target.closest ? e.target : null; if (!t) return;
      var c = t.closest('[data-cta]');
      if (c) { var all = d.querySelectorAll('[data-cta]'); ev('cta', c.id || ('b' + (Array.prototype.indexOf.call(all, c) + 1))); }
      var o = t.closest('.offer');
      if (o) { var os = d.querySelectorAll('.offer'); ev('offer', 'box' + (Array.prototype.indexOf.call(os, o) + 1)); }
      if (t.closest('#go')) {
        ev('submit');
        setTimeout(function () {
          var ph = d.getElementById('phErr'), nm = d.getElementById('nmErr');
          if (ph && ph.textContent.trim()) ev('ph_err', shape((d.getElementById('ph') || {}).value || ''));
          if (nm && nm.textContent.trim()) ev('nm_err', 'len' + ((d.getElementById('nm') || {}).value || '').trim().length);
          flush(false);
        }, 60);
      }
    }, true);

    // Shape of a rejected phone number, never the number itself
    function shape(v) {
      var ar = /[٠-٩]/.test(v), fa = /[۰-۹]/.test(v), la = /[0-9]/.test(v);
      var digits = v.replace(/[^0-9٠-٩۰-۹]/g, '');
      var script = (ar ? 'arabic' : '') + (fa ? 'persian' : '') + (la ? (ar || fa ? '+latin' : 'latin') : '') || 'none';
      var n = v.replace(/[٠-٩]/g, function (x) { return x.charCodeAt(0) - 1632; })
               .replace(/[۰-۹]/g, function (x) { return x.charCodeAt(0) - 1776; }).replace(/[\s\-().]/g, '');
      var pre = /^\+212/.test(n) ? '+212' : /^00212/.test(n) ? '00212' : /^212/.test(n) ? '212' : /^0[67]/.test(n) ? '06/07'
              : /^05/.test(n) ? '05' : /^[67]/.test(n) ? 'no0' : 'other';
      return script + ' len' + digits.length + ' ' + pre + (/[^0-9٠-٩۰-۹\s\-().+]/.test(v) ? ' letters' : '');
    }

    ['nm', 'ph'].forEach(function (id) {
      var el = d.getElementById(id); if (!el) return;
      el.addEventListener('input', function () { ev(id + '_in', null, true); }, { passive: true });
    });

    // form opened / closed (the page toggles body.pop)
    new MutationObserver(function () {
      var on = d.body.classList.contains('pop');
      if (on && !formOpened) { formOpened = 1; ev('form_open'); }
      else if (!on && formOpened) { formOpened = 0; ev('close'); flush(false); }
    }).observe(d.body, { attributes: true, attributeFilter: ['class'] });

    // order result: watch the page's own request to /api/orders
    var f0 = w.fetch;
    if (f0) w.fetch = function (u, o) {
      var p = f0.apply(this, arguments);
      try {
        if (String(u && u.url || u).indexOf('/api/orders') > -1) {
          p.then(function (r) { ev(r.ok ? 'ok' : 'send_err', r.ok ? null : 'http' + r.status); flush(true); },
                 function () { ev('send_err', 'network'); flush(true); });
        }
      } catch (e) {}
      return p;
    };

    function leave() { ev('leave', 's' + maxS + (seen.cta ? ' form' : ''), true); flush(true); }
    addEventListener('pagehide', leave);
    d.addEventListener('visibilitychange', function () { if (d.visibilityState === 'hidden') leave(); });
  } catch (e) {}
})(window, document);
