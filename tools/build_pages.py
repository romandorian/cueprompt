#!/usr/bin/env python3
"""Build localized static pages and i18n bundles for CuePrompt.

Source of truth:  src/index.html (English template with data-i18n keys) and src/locales/<code>.json
Outputs (dist/):  index.html, <lang>/index.html, i18n.js, i18n/<code>.js, sitemap.xml, hreflang tags on landing pages.
Run from the project root:  python3 tools/build_pages.py
"""
import html, json, os, re, sys, subprocess

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC, DIST = os.path.join(ROOT, 'src'), os.path.join(ROOT, 'dist')
SITE = os.environ.get('CUEPROMPT_SITE', 'https://cueprompt-studio.mauvejay6.chatgpt.site').rstrip('/')
LANGS = [  # code, native name, dir, path, hreflang
    ('en', 'English', 'ltr', '/', 'en'), ('zh-CN', '简体中文', 'ltr', '/zh/', 'zh-CN'), ('zh-TW', '繁體中文', 'ltr', '/zh-tw/', 'zh-TW'),
    ('es', 'Español', 'ltr', '/es/', 'es'), ('pt', 'Português', 'ltr', '/pt/', 'pt'), ('fr', 'Français', 'ltr', '/fr/', 'fr'),
    ('de', 'Deutsch', 'ltr', '/de/', 'de'), ('ja', '日本語', 'ltr', '/ja/', 'ja'), ('ko', '한국어', 'ltr', '/ko/', 'ko'),
    ('ru', 'Русский', 'ltr', '/ru/', 'ru'), ('ar', 'العربية', 'rtl', '/ar/', 'ar'), ('hi', 'हिन्दी', 'ltr', '/hi/', 'hi'),
    ('id', 'Bahasa Indonesia', 'ltr', '/id/', 'id'), ('vi', 'Tiếng Việt', 'ltr', '/vi/', 'vi'), ('th', 'ไทย', 'ltr', '/th/', 'th'),
]
LANDING = ['teleprompter-for-youtube', 'teleprompter-for-presentations', 'teleprompter-with-camera']


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
    urls += ''.join(f'<url><loc>{SITE}/{slug}/</loc></url>' for slug in ['script-templates', 'script-extractor', 'publishing-assistant', 'video-converter'])
    write(os.path.join(DIST, 'sitemap.xml'), '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">' + urls + '</urlset>\n')
    print('\n'.join(report))


if __name__ == '__main__':
    main()
