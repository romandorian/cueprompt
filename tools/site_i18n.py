"""Shared locale metadata for every public CuePrompt page.

Keep this separate from a page generator so Studio, creator tools, guides and
legal pages all use the same language paths and text direction.
"""

LOCALES = (
    ('en', 'English', 'ltr', '/', 'en'),
    ('es', 'Español', 'ltr', '/es/', 'es'),
    ('pt', 'Português', 'ltr', '/pt/', 'pt'),
    ('fr', 'Français', 'ltr', '/fr/', 'fr'),
    ('de', 'Deutsch', 'ltr', '/de/', 'de'),
    ('ja', '日本語', 'ltr', '/ja/', 'ja'),
    ('ko', '한국어', 'ltr', '/ko/', 'ko'),
    ('ru', 'Русский', 'ltr', '/ru/', 'ru'),
    ('ar', 'العربية', 'rtl', '/ar/', 'ar'),
    ('hi', 'हिन्दी', 'ltr', '/hi/', 'hi'),
    ('id', 'Bahasa Indonesia', 'ltr', '/id/', 'id'),
    ('vi', 'Tiếng Việt', 'ltr', '/vi/', 'vi'),
    ('th', 'ไทย', 'ltr', '/th/', 'th'),
    ('zh-CN', '简体中文', 'ltr', '/zh/', 'zh-CN'),
    ('zh-TW', '繁體中文', 'ltr', '/zh-tw/', 'zh-TW'),
)

# Every public page that must eventually have a locale-specific static copy.
# Keeping this manifest independent of the individual page builders prevents a
# new guide/tool from silently shipping only in English.
PUBLIC_PAGE_SLUGS = (
    'script-templates', 'script-extractor', 'publishing-assistant', 'video-converter',
    'creator-guides', 'privacy', 'terms',
    'teleprompter-for-youtube', 'teleprompter-for-presentations',
    'teleprompter-with-camera', 'teleprompter-for-youtube-shorts',
    'teleprompter-for-tiktok', 'teleprompter-for-instagram-reels',
    'teleprompter-for-podcasts', 'teleprompter-for-interviews',
    'teleprompter-for-sales-video',
)


def page_path(locale, slug=''):
    """Return the locale-aware static route for a public page."""
    path = next(item[3] for item in LOCALES if item[0] == locale)
    return path if not slug else path + slug.strip('/') + '/'


def absolute_url(site, locale, slug=''):
    return site.rstrip('/') + page_path(locale, slug)


def hreflang_links(site, slug):
    return ''.join(
        f'<link rel="alternate" hreflang="{hreflang}" href="{absolute_url(site, code, slug)}">'
        for code, _, _, _, hreflang in LOCALES
    ) + f'<link rel="alternate" hreflang="x-default" href="{absolute_url(site, "en", slug)}">'
