/* Keeps cross-page navigation in the visitor's chosen CuePrompt language. */
(function () {
  const paths = { 'zh-CN': '/zh/', 'zh-TW': '/zh-tw/', es: '/es/', pt: '/pt/', fr: '/fr/', de: '/de/', ja: '/ja/', ko: '/ko/', ru: '/ru/', ar: '/ar/', hi: '/hi/', id: '/id/', vi: '/vi/', th: '/th/' };
  const publicPages = new Set(['script-templates', 'script-extractor', 'publishing-assistant', 'video-converter', 'creator-guides', 'privacy', 'terms', 'teleprompter-for-youtube', 'teleprompter-for-presentations', 'teleprompter-with-camera', 'teleprompter-for-youtube-shorts', 'teleprompter-for-tiktok', 'teleprompter-for-instagram-reels', 'teleprompter-for-podcasts', 'teleprompter-for-interviews', 'teleprompter-for-sales-video']);
  const languageNames = {en:'English',es:'Español',pt:'Português',fr:'Français',de:'Deutsch',ja:'日本語',ko:'한국어',ru:'Русский',ar:'العربية',hi:'हिन्दी',id:'Bahasa Indonesia',vi:'Tiếng Việt',th:'ไทย','zh-CN':'简体中文','zh-TW':'繁體中文'};
  const browserLanguage = () => {
    for (const raw of navigator.languages || [navigator.language || 'en']) {
      const code = String(raw).toLowerCase();
      if (code.startsWith('zh')) return /tw|hk|mo|hant/.test(code) ? 'zh-TW' : 'zh-CN';
      const base = code.split('-')[0];
      if (languageNames[base]) return base;
    }
    return 'en';
  };
  let language = 'en';
  const pageLanguage = document.documentElement.lang;
  if (paths[pageLanguage]) language = pageLanguage;
  if (!paths[pageLanguage]) {
    try { language = JSON.parse(localStorage.getItem('cueprompt-settings') || '{}').uiLang || browserLanguage(); }
    catch { language = browserLanguage(); }
  }
  const home = paths[language] || '/';
  const segments = location.pathname.split('/').filter(Boolean);
  const slug = publicPages.has(segments.at(-1)) ? segments.at(-1) : '';
  if (pageLanguage === 'en' && slug && segments.length === 1 && language !== 'en') {
    location.replace(home + slug + '/' + location.search + location.hash);
    return;
  }
  document.addEventListener('DOMContentLoaded', () => {
    document.documentElement.lang = language;
    document.querySelectorAll('a[href="/"],a[href^="/#studio"]').forEach(link => {
      link.href = link.getAttribute('href') === '/' ? home : home + '#studio';
    });
    document.querySelectorAll('a[href^="/"]').forEach(link => {
      const href = link.getAttribute('href');
      const match = href.match(/^\/([^/#]+)\/(#.*)?$/);
      if (match && publicPages.has(match[1]) && language !== 'en') {
        link.href = home + match[1] + '/' + (match[2] || '');
      }
    });
    const header = document.querySelector('header');
    const currentSlug = slug;
    if (header && currentSlug && !header.querySelector('[data-locale-picker]')) {
      const picker = document.createElement('select');
      picker.dataset.localePicker = 'true';
      picker.setAttribute('aria-label', 'Language');
      picker.style.cssText = 'margin-inline-start:auto;max-width:9rem;padding:.35rem .5rem;border:1px solid #d8dfd2;border-radius:.45rem;background:#fff;color:inherit;font:inherit';
      Object.entries(languageNames).forEach(([code, name]) => {
        const option = new Option(name, code, false, code === language);
        picker.add(option);
      });
      picker.addEventListener('change', () => {
        const destination = (paths[picker.value] || '/') + currentSlug + '/';
        try {
          const settings = JSON.parse(localStorage.getItem('cueprompt-settings') || '{}');
          settings.uiLang = picker.value;
          localStorage.setItem('cueprompt-settings', JSON.stringify(settings));
        } catch { /* The explicit locale URL still works without storage. */ }
        location.assign(destination);
      });
      header.append(picker);
    }
  });
})();
