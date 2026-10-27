#!/usr/bin/env python3
"""Build localized static pages and i18n bundles for CuePrompt.

Source of truth:  src/index.html (English template with data-i18n keys) and src/locales/<code>.json
Outputs (dist/):  index.html, <lang>/index.html, i18n.js, i18n/<code>.js, sitemap.xml, hreflang tags on landing pages.
Run from the project root:  python3 tools/build_pages.py
"""
import html, json, os, re, sys, subprocess

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC, DIST = os.path.join(ROOT, 'src'), os.path.join(ROOT, 'dist')
SITE = os.environ.get('CUEPROMPT_SITE', 'https://cueprompt.io').rstrip('/')
LANGS = [  # code, native name, dir, path, hreflang
    ('en', 'English', 'ltr', '/', 'en'), ('zh-CN', '简体中文', 'ltr', '/zh/', 'zh-CN'), ('zh-TW', '繁體中文', 'ltr', '/zh-tw/', 'zh-TW'),
    ('es', 'Español', 'ltr', '/es/', 'es'), ('pt', 'Português', 'ltr', '/pt/', 'pt'), ('fr', 'Français', 'ltr', '/fr/', 'fr'),
    ('de', 'Deutsch', 'ltr', '/de/', 'de'), ('ja', '日本語', 'ltr', '/ja/', 'ja'), ('ko', '한국어', 'ltr', '/ko/', 'ko'),
    ('ru', 'Русский', 'ltr', '/ru/', 'ru'), ('ar', 'العربية', 'rtl', '/ar/', 'ar'), ('hi', 'हिन्दी', 'ltr', '/hi/', 'hi'),
    ('id', 'Bahasa Indonesia', 'ltr', '/id/', 'id'), ('vi', 'Tiếng Việt', 'ltr', '/vi/', 'vi'), ('th', 'ไทย', 'ltr', '/th/', 'th'),
]
LANDING = ['teleprompter-for-youtube', 'teleprompter-for-presentations', 'teleprompter-with-camera']
SCENE_GUIDES = {
    'teleprompter-for-youtube-shorts': ('Teleprompter for YouTube Shorts', 'Create clear YouTube Shorts with a browser teleprompter, a 9:16 export preset and a local publishing pack.', 'YouTube Shorts, without losing your place.'),
    'teleprompter-for-tiktok': ('Teleprompter for TikTok', 'Plan, rehearse and record TikTok videos with a private browser teleprompter and vertical export preset.', 'Say it naturally on TikTok.'),
    'teleprompter-for-instagram-reels': ('Teleprompter for Instagram Reels', 'Use a browser teleprompter to script, record and export Instagram Reels without uploading your draft.', 'More eye contact for your next Reel.'),
    'teleprompter-for-podcasts': ('Teleprompter for Podcasts', 'Create podcast openings, episode outlines and video-podcast scripts with a free browser teleprompter.', 'A steadier start to every episode.'),
    'teleprompter-for-interviews': ('Teleprompter for Interviews', 'Prepare a confident self-introduction and interview answers with a private browser teleprompter.', 'Introduce yourself with clarity, not memorization.'),
    'teleprompter-for-sales-video': ('Teleprompter for Sales Videos', 'Create product demos, sales videos and client walkthroughs with a browser teleprompter and publishing workflow.', 'Keep your sales message focused.'),
}


def load_locales():
    dicts = {}
    for code, *_ in LANGS:
        path = os.path.join(SRC, 'locales', code + '.json')
        if os.path.exists(path):
            with open(path, encoding='utf-8') as f:
                dicts[code] = json.load(f)
    return dicts


def hreflang_block():
    links = [f'<link rel="alternate" hreflang="{h}" href="{SITE}{p}">' for _, _, _, p, h in LANGS]
    links.append(f'<link rel="alternate" hreflang="x-default" href="{SITE}/">')
    return '<!-- hreflang:start -->' + ''.join(links) + '<!-- hreflang:end -->'


def bake(template, code, d, en):
    def t(key):
        return d.get(key, en.get(key, key))
    attr_map = {'data-i18n-ph': 'placeholder', 'data-i18n-aria': 'aria-label', 'data-i18n-title': 'title', 'data-i18n-content': 'content'}

    def fix_tag(m):
        tag = m.group(0)
        for data_attr, target in attr_map.items():
            km = re.search(data_attr + r'="([^"]+)"', tag)
            if not km:
                continue
            val = html.escape(t(km.group(1)), quote=True)
            if re.search(r'\s' + target + r'="[^"]*"', tag):
                tag = re.sub(r'(\s' + target + r'=")[^"]*(")', lambda mm: mm.group(1) + val + mm.group(2), tag, count=1)
            else:
                tag = tag[:-1] + f' {target}="{val}">'
        return tag
    out = re.sub(r'<[a-zA-Z][^>]*\sdata-i18n-(?:ph|aria|title|content)="[^"]*"[^>]*>', fix_tag, template)
    out = re.sub(r'(<(\w+)\b[^>]*\sdata-i18n="([^"]+)"[^>]*>)(.*?)(</\2>)',
                 lambda m: m.group(1) + html.escape(t(m.group(3)), quote=False) + m.group(5), out, flags=re.S)
    meta = next(l for l in LANGS if l[0] == code)
    out = re.sub(r'<html lang="[^"]*" dir="[^"]*" data-locale="[^"]*">', f'<html lang="{code}" dir="{meta[2]}" data-locale="{code}">', out, count=1)
    url = SITE + meta[3]
    out = re.sub(r'<link rel="canonical" href="[^"]*">', f'<link rel="canonical" href="{url}">', out, count=1)
    out = re.sub(r'<meta property="og:url" content="[^"]*">', f'<meta property="og:url" content="{url}">', out, count=1)
    out = re.sub(r'"url":"[^"]*"', f'"url":"{url}"', out, count=1)
    # Keep machine-readable application data aligned with the visible language,
    # rather than exposing an English-only description on localized pages.
    out = out.replace('"description":"Free browser-based teleprompter with voice-follow scrolling, a local script library and video recording."',
                      '"description":' + json.dumps(t('meta.description'), ensure_ascii=False) + ',"inLanguage":' + json.dumps(code) + ',"featureList":["Voice-follow scrolling","Browser video recording","Local script library","Fullscreen teleprompter"]')
    out = re.sub(r'<!-- hreflang:start -->.*?<!-- hreflang:end -->', hreflang_block(), out, flags=re.S)
    out = out.replace('<script src="/app.js" defer></script>', '<script src="/workflow.js" defer></script><script src="/app.js" defer></script><script src="/install.js" defer></script>')
    out = out.replace('</head>', '<link rel="manifest" href="/manifest.webmanifest"></head>')
    if code != 'en':
        out = out.replace('<script src="/align.js" defer></script>', f'<script src="/i18n/{code}.js" defer></script><script src="/align.js" defer></script>', 1)
        out = out.replace('<meta property="og:type"', f'<meta property="og:locale" content="{code.replace("-", "_")}"><meta property="og:type"', 1)
    return out


def write(path, text):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(text)


def guide_page(slug, title, description, headline):
    url = f'{SITE}/{slug}/'
    related = ''.join(f'<li><a href="/{s}/">{html.escape(t[0])}</a></li>' for s, t in SCENE_GUIDES.items() if s != slug)
    return f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{html.escape(title)} | CuePrompt</title><meta name="description" content="{html.escape(description)}"><link rel="canonical" href="{url}"><meta property="og:title" content="{html.escape(title)} | CuePrompt"><meta property="og:description" content="{html.escape(description)}"><meta property="og:type" content="article"><meta property="og:url" content="{url}"><link rel="stylesheet" href="/style.css"><script type="application/ld+json">{{"@context":"https://schema.org","@type":"Article","headline":{json.dumps(headline)},"description":{json.dumps(description)},"mainEntityOfPage":{json.dumps(url)},"author":{{"@type":"Organization","name":"CuePrompt"}}}}</script></head><body><header class="header"><a class="brand" href="/">CuePrompt</a><a href="/#studio">Open studio ↗</a></header><main class="landing"><span class="eyebrow">CUEPROMPT CREATOR GUIDE</span><h1>{html.escape(headline)}</h1><p>{html.escape(description)}</p><a class="play-button" href="/script-templates/">Choose a script template →</a><h2>Write for the camera, not the page</h2><p>Start with one audience problem, one useful idea and one clear next step. Keep sentences short enough to say naturally, then use headings and pause markers to make the read easier.</p><h2>Rehearse in your own rhythm</h2><p>Keep the reading area close to your lens, adjust text size and speed, and use Smart Follow or steady scrolling. Your draft stays in this browser while you practice.</p><h2>Record and prepare the release</h2><p>Record a take, choose a platform export preset, then use the publishing assistant for copy, captions and a local release pack.</p><h2>More creator guides</h2><ul>{related}</ul><p><a href="/creator-guides/">Browse all guides</a> · <a href="/#studio">Open CuePrompt Studio</a></p></main><footer><a href="/">CuePrompt</a><span>© 2026 CuePrompt</span></footer></body></html>'''


def main():
    subprocess.run([sys.executable, os.path.join(ROOT, 'tools', 'build_creator_tools.py')], check=True)
    dicts = load_locales()
    en = dicts['en']
    with open(os.path.join(SRC, 'index.html'), encoding='utf-8') as f:
        template = f.read()
    keys_used = set(re.findall(r'data-i18n(?:-ph|-aria|-title|-content)?="([^"]+)"', template))
    missing_en = sorted(k for k in keys_used if k not in en)
    if missing_en:
        sys.exit('Keys used in template but missing in en.json: ' + ', '.join(missing_en))
    report = []
    for code, name, direction, path, _ in LANGS:
        d = dicts.get(code, {})
        missing = [k for k in en if k not in d]
        report.append(f'{code:6} {len(d):4} keys, {len(missing)} missing' + (f' ({", ".join(missing[:5])}…)' if missing else ''))
        write(os.path.join(DIST, path.strip('/'), 'index.html'), bake(template, code, d, en))
        if code != 'en':
            write(os.path.join(DIST, 'i18n', code + '.js'), f'window.CueI18n.dicts[{json.dumps(code)}]=' + json.dumps(d, ensure_ascii=False, separators=(',', ':')) + ';\n')
    languages = [{'code': c, 'name': n, 'dir': di, 'path': p} for c, n, di, p, _ in LANGS]
    runtime = ('/* Generated by tools/build_pages.py — edit src/locales/*.json instead. */\n'
               'window.CueI18n={languages:' + json.dumps(languages, ensure_ascii=False) + ',dicts:{en:' + json.dumps(en, ensure_ascii=False, separators=(',', ':')) + '},'
               'load:function(code){var self=this;if(self.dicts[code])return Promise.resolve(self.dicts[code]);'
               'return new Promise(function(res,rej){var s=document.createElement("script");s.src="/i18n/"+code+".js";'
               's.onload=function(){self.dicts[code]?res(self.dicts[code]):rej(new Error("missing "+code))};s.onerror=function(){rej(new Error("load "+code))};document.head.appendChild(s)})}};\n')
    write(os.path.join(DIST, 'i18n.js'), runtime)
    for slug, (title, description, headline) in SCENE_GUIDES.items():
        write(os.path.join(DIST, slug, 'index.html'), guide_page(slug, title, description, headline))
    guide_links = ''.join(f'<li><a href="/{slug}/">{html.escape(title)}</a> — {html.escape(description)}</li>' for slug, (title, description, _) in SCENE_GUIDES.items())
    write(os.path.join(DIST, 'creator-guides', 'index.html'), f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Creator Guides | CuePrompt</title><meta name="description" content="Practical teleprompter guides for short video, podcasts, interviews and sales videos."><link rel="canonical" href="{SITE}/creator-guides/"><link rel="stylesheet" href="/style.css"></head><body><header class="header"><a class="brand" href="/">CuePrompt</a><a href="/#studio">Open studio ↗</a></header><main class="landing"><span class="eyebrow">CUEPROMPT CREATOR GUIDES</span><h1>Speak naturally on every kind of camera.</h1><p>Practical starting points for creators who want to write, rehearse, record and publish with less friction.</p><ul>{guide_links}</ul><a class="play-button" href="/script-templates/">Start a script →</a></main><footer><a href="/">CuePrompt</a><span>© 2026 CuePrompt</span></footer></body></html>''')
    # hreflang on English-only landing pages (self + x-default)
    for slug in LANDING:
        p = os.path.join(DIST, slug, 'index.html')
        with open(p, encoding='utf-8') as f:
            page = f.read()
        block = f'<!-- hreflang:start --><link rel="alternate" hreflang="en" href="{SITE}/{slug}/"><link rel="alternate" hreflang="x-default" href="{SITE}/{slug}/"><!-- hreflang:end -->'
        if '<!-- hreflang:start -->' in page:
            page = re.sub(r'<!-- hreflang:start -->.*?<!-- hreflang:end -->', block, page, flags=re.S)
        else:
            page = page.replace('<link rel="stylesheet"', block + '<link rel="stylesheet"', 1)
        write(p, page)
    # sitemap with language alternates
    alt = ''.join(f'<xhtml:link rel="alternate" hreflang="{h}" href="{SITE}{p}"/>' for _, _, _, p, h in LANGS) + f'<xhtml:link rel="alternate" hreflang="x-default" href="{SITE}/"/>'
    urls = ''.join(f'<url><loc>{SITE}{p}</loc>{alt}</url>' for _, _, _, p, _ in LANGS)
    urls += ''.join(f'<url><loc>{SITE}/{slug}/</loc></url>' for slug in LANDING)
    urls += ''.join(f'<url><loc>{SITE}/{slug}/</loc></url>' for slug in SCENE_GUIDES)
    urls += f'<url><loc>{SITE}/creator-guides/</loc></url>'
    urls += ''.join(f'<url><loc>{SITE}/{slug}/</loc></url>' for slug in ['script-templates', 'script-extractor', 'publishing-assistant', 'video-converter'])
    write(os.path.join(DIST, 'sitemap.xml'), '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">' + urls + '</urlset>\n')
    write(os.path.join(DIST, 'robots.txt'), f'User-agent: *\nAllow: /\nSitemap: {SITE}/sitemap.xml\n')
    print('\n'.join(report))


if __name__ == '__main__':
    main()
