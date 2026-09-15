(() => {
  const CONSENT_KEY = 'dey6_analytics_consent';
  const banner = document.getElementById('analytics-consent');
  const getConsent = () => localStorage.getItem(CONSENT_KEY);
  const send = (name, params={}) => {
    if (typeof window.gtag !== 'function') return;
    window.gtag('event', name, params);
  };
  const pageView = () => send('page_view', {
    page_title: document.title,
    page_location: location.href,
    page_path: location.pathname + location.search
  });
  const applyConsent = (state, persist=false) => {
    window.gtag?.('consent','update',{
      analytics_storage: state === 'granted' ? 'granted' : 'denied',
      ad_storage:'denied', ad_user_data:'denied', ad_personalization:'denied'
    });
    if (persist) localStorage.setItem(CONSENT_KEY, state);
    if (banner) banner.hidden = true;
    pageView();
    send('consent_update', {consent_state: state});
  };

  const saved = getConsent();
  if (saved === 'granted' || saved === 'denied') {
    applyConsent(saved, false);
  } else if (banner) {
    banner.hidden = false;
  }

  document.querySelectorAll('[data-consent]').forEach(btn => {
    btn.addEventListener('click', () => applyConsent(btn.dataset.consent, true));
  });

  const gameName = (el) => {
    const card = el.closest('.game-card');
    if (card) return card.querySelector('h3')?.innerText.trim() || '';
    const h1 = document.querySelector('h1');
    return h1 ? h1.innerText.replace(/\s+/g,' ').replace(/русификатор/ig,'').trim() : '';
  };

  document.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if (!a) return;
    const href = a.href || '';
    const label = a.innerText.trim().slice(0,120);
    const game = gameName(a);
    if (/dey6\.s\.gy/i.test(href) || /скач/i.test(label)) {
      send('download_click', {game_name: game, link_url: href, link_text: label});
    } else if (/boosty\.to/i.test(href)) {
      send('boosty_click', {game_name: game, link_url: href, link_text: label});
    } else if (/t\.me\/dey6tran/i.test(href)) {
      send('telegram_click', {game_name: game, link_url: href, link_text: label});
    } else if (href.includes('/rusifikatory/')) {
      send('translation_open', {game_name: game || label, link_url: href});
    }
  }, {passive:true});

  document.querySelectorAll('[data-copy]').forEach(btn => btn.addEventListener('click', () => {
    send('copy_link', {page_path: location.pathname});
  }));

  const q = document.getElementById('search');
  if (q) {
    let timer;
    q.addEventListener('input', () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        const term = q.value.trim();
        if (term.length < 2) return;
        const results = [...document.querySelectorAll('[data-search]')].filter(x => !x.classList.contains('hidden')).length;
        send('site_search', {search_term: term, results_count: results});
      }, 700);
    });
  }
})();
