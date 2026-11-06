/* Keeps cross-page navigation in the visitor's chosen CuePrompt language. */
(function () {
  const paths = { 'zh-CN': '/zh/', 'zh-TW': '/zh-tw/', es: '/es/', pt: '/pt/', fr: '/fr/', de: '/de/', ja: '/ja/', ko: '/ko/', ru: '/ru/', ar: '/ar/', hi: '/hi/', id: '/id/', vi: '/vi/', th: '/th/' };
  const publicPages = new Set(['script-templates', 'script-extractor', 'publishing-assistant', 'video-converter', 'creator-guides', 'privacy', 'terms', 'teleprompter-for-youtube', 'teleprompter-for-presentations', 'teleprompter-with-camera', 'teleprompter-for-youtube-shorts', 'teleprompter-for-tiktok', 'teleprompter-for-instagram-reels', 'teleprompter-for-podcasts', 'teleprompter-for-interviews', 'teleprompter-for-sales-video']);
  const languageNames = {en:'English',es:'Español',pt:'Português',fr:'Français',de:'Deutsch',ja:'日本語',ko:'한국어',ru:'Русский',ar:'العربية',hi:'हिन्दी',id:'Bahasa Indonesia',vi:'Tiếng Việt',th:'ไทย','zh-CN':'简体中文','zh-TW':'繁體中文'};
  const pageLanguage = document.documentElement.lang;
  // The URL is authoritative. English uses the unprefixed route; every other
  // language uses its explicit locale prefix. A stale browser preference must
  // never rewrite an English canonical URL into another language.
  const language = languageNames[pageLanguage] ? pageLanguage : 'en';
  const home = paths[language] || '/';
  const segments = location.pathname.split('/').filter(Boolean);
  const slug = publicPages.has(segments.at(-1)) ? segments.at(-1) : '';
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
    const siteNav = document.querySelector('.site-nav');
    if (siteNav) {
      const currentPath = location.pathname.replace(/\/+$/, '') || '/';
      siteNav.querySelectorAll('a').forEach(link => {
        link.classList.remove('selected');
        link.removeAttribute('aria-current');
        const linkPath = new URL(link.href, location.origin).pathname.replace(/\/+$/, '') || '/';
        if (linkPath === currentPath) {
          link.classList.add('selected');
          link.setAttribute('aria-current', 'page');
          const menu = link.closest('.nav-menu');
          if (menu) menu.querySelector('summary').classList.add('is-current');
        }
      });
      const menus = [...siteNav.querySelectorAll('.nav-menu')];
      menus.forEach(menu => menu.addEventListener('toggle', () => {
        if (menu.open) menus.forEach(other => { if (other !== menu) other.open = false; });
      }));
      document.addEventListener('click', event => {
        if (!siteNav.contains(event.target)) menus.forEach(menu => { menu.open = false; });
      });
      document.addEventListener('keydown', event => {
        if (event.key === 'Escape') {
          const openMenu = menus.find(menu => menu.open);
          if (openMenu) {
            openMenu.open = false;
            openMenu.querySelector('summary').focus();
          }
        }
      });
    }
    const header = document.querySelector('header');
    const currentSlug = slug;
    // Most public pages already include the global language selector. Only add
    // this fallback on a standalone page that does not have one.
    if (header && currentSlug && !header.querySelector('#ui-language') && !header.querySelector('[data-locale-picker]')) {
      const picker = document.createElement('select');
      picker.dataset.localePicker = 'true';
      picker.className = 'locale-page-picker';
      picker.setAttribute('aria-label', 'Language');
      Object.entries(languageNames).forEach(([code, name]) => {
        const option = new Option(name, code, false, code === language);
        picker.add(option);
      });
      picker.addEventListener('change', () => {
        const destination = (paths[picker.value] || '/') + currentSlug + '/' + location.search + location.hash;
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
