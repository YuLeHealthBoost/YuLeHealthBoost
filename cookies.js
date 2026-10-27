/* YuLe Health Boost – cookiebanner + Google Analytics (pas na toestemming) */
(function () {
  var GA_ID = 'G-1YDKV8LCSR';
  var KEY = 'yule_cookiekeuze';
  var GELDIG_DAGEN = 365;

  function leesKeuze() {
    try {
      var k = JSON.parse(localStorage.getItem(KEY));
      if (!k || !k.datum) return null;
      if (Date.now() - k.datum > GELDIG_DAGEN * 864e5) return null;
      return k.keuze;
    } catch (e) { return null; }
  }
  function bewaarKeuze(keuze) {
    try { localStorage.setItem(KEY, JSON.stringify({ keuze: keuze, datum: Date.now() })); } catch (e) {}
  }

  var gaGeladen = false;
  function laadAnalytics() {
    if (gaGeladen) return;
    gaGeladen = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { dataLayer.push(arguments); };
    gtag('consent', 'default', { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'granted' });
    gtag('js', new Date());
    gtag('config', GA_ID, { allow_google_signals: false, allow_ad_personalization_signals: false });
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
  }
  function verwijderGaCookies() {
    document.cookie.split(';').forEach(function (c) {
      var naam = c.split('=')[0].trim();
      if (naam.indexOf('_ga') === 0) {
        var dom = location.hostname.replace(/^www\./, '');
        ['', '; domain=' + dom, '; domain=.' + dom].forEach(function (d) {
          document.cookie = naam + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/' + d;
        });
      }
    });
  }

  var css = '' +
    '#yule-cookie{position:fixed;left:16px;right:16px;bottom:16px;z-index:9999;max-width:560px;margin:0 auto;' +
    'background:#0B0B0B;color:#fff;border:1px solid #95B605;border-radius:16px;padding:20px 22px;' +
    'box-shadow:0 10px 30px rgba(0,0,0,.25);font-family:inherit;font-size:15px;line-height:1.55}' +
    '#yule-cookie p{margin:0 0 14px}' +
    '#yule-cookie a{color:#B0D40C}' +
    '#yule-cookie .yc-knoppen{display:flex;gap:10px;flex-wrap:wrap}' +
    '#yule-cookie button{font:inherit;font-weight:600;border-radius:999px;padding:10px 18px;cursor:pointer;border:1px solid #95B605}' +
    '#yule-cookie .yc-ja{background:#95B605;color:#0B0B0B}' +
    '#yule-cookie .yc-nee{background:transparent;color:#fff}' +
    '.yc-instellingen{background:none;border:0;padding:0;font:inherit;color:inherit;text-decoration:underline;cursor:pointer}';

  function toonBanner() {
    if (document.getElementById('yule-cookie')) return;
    var b = document.createElement('div');
    b.id = 'yule-cookie';
    b.setAttribute('role', 'dialog');
    b.setAttribute('aria-label', 'Cookies');
    b.innerHTML =
      '<p><strong>Mag ik meten hoe mijn website wordt gebruikt?</strong><br>' +
      'Met jouw toestemming gebruik ik Google Analytics om te zien hoeveel mensen mijn site bezoeken en welke pagina’s ze lezen. ' +
      'Ik gebruik dit niet voor advertenties. Lees meer in de <a href="privacyverklaring.html#cookies">privacyverklaring</a>.</p>' +
      '<div class="yc-knoppen"><button type="button" class="yc-ja">Akkoord</button>' +
      '<button type="button" class="yc-nee">Liever niet</button></div>';
    document.body.appendChild(b);
    b.querySelector('.yc-ja').onclick = function () { bewaarKeuze('ja'); b.remove(); laadAnalytics(); };
    b.querySelector('.yc-nee').onclick = function () {
      bewaarKeuze('nee'); b.remove(); verwijderGaCookies();
      if (gaGeladen) location.reload();
    };
  }

  function start() {
    var st = document.createElement('style');
    st.textContent = css;
    document.head.appendChild(st);
    document.querySelectorAll('[data-cookie-instellingen]').forEach(function (el) {
      el.addEventListener('click', function (e) { e.preventDefault(); toonBanner(); });
    });
    var keuze = leesKeuze();
    if (keuze === 'ja') laadAnalytics();
    else if (keuze === null) toonBanner();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
