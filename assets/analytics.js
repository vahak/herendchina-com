/* Herend China Guide analytics (explained on /privacy/).
   1. Google Analytics 4 (G-6DJG6RM6WM, the same property as paristableware.com) with
      cross-domain measurement, so a visit that continues on paristableware.com counts
      as one visit (Google adds the "_gl" link parameter).
   2. A "shop_click" event for every click on a paristableware.com link.
   3. Meta Pixel (dataset 2131114557817739): one PageView, sent ONLY when the browser
      does not send a Global Privacy Control signal. No other Meta events.
   Nothing runs on previews (localhost, file://, github.io): only on the live domain. */
(function () {
  'use strict';

  var GA_ID = 'G-6DJG6RM6WM';
  var PIXEL_ID = '2131114557817739';
  var LINKER_DOMAINS = ['herend.us', 'herendchina.com', 'paristableware.com'];
  var LIVE_HOSTS = ['herendchina.com', 'www.herendchina.com'];

  if (LIVE_HOSTS.indexOf(window.location.hostname) === -1) { return; }

  // Google Analytics 4
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;
  window.gtag('js', new Date());
  window.gtag('config', GA_ID, {
    linker: { domains: LINKER_DOMAINS, accept_incoming: true }
  });
  var ga = document.createElement('script');
  ga.async = true;
  ga.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
  document.head.appendChild(ga);

  // Meta Pixel: PageView only, and only without Global Privacy Control
  if (navigator.globalPrivacyControl !== true) {
    /* Meta's standard loader */
    !function (f, b, e, v, n, t, s) {
      if (f.fbq) { return; }
      n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!f._fbq) { f._fbq = n; }
      n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = [];
      t = b.createElement(e); t.async = !0; t.src = v;
      s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    window.fbq('set', 'autoConfig', false, PIXEL_ID); // no automatic button or page-data events
    window.fbq('init', PIXEL_ID);
    window.fbq('track', 'PageView');
  }

  // shop_click event on links to the store
  function pageSlug() {
    var p = window.location.pathname.replace(/^\/+|\/+$/g, '').replace(/\//g, '-');
    return p || 'home';
  }
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
    if (!a || !/(^|\.)paristableware\.com$/i.test(a.hostname || '')) { return; }
    var type = a.getAttribute('data-link-type') ||
      (a.closest('.shop-cta') ? 'cta' : (a.closest('footer') ? 'footer' : 'in_context'));
    window.gtag('event', 'shop_click', {
      link_url: a.href,
      page_slug: pageSlug(),
      link_type: type,
      transport_type: 'beacon'
    });
  }, true);
})();
