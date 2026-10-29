#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Build localized static pages and i18n bundles for CuePrompt.

Source of truth:  src/index.html (English template with data-i18n keys) and src/locales/<code>.json
Outputs (dist/):  index.html, <lang>/index.html, i18n.js, i18n/<code>.js, sitemap.xml, hreflang tags on landing pages.
Run from the project root:  python3 tools/build_pages.py
"""
import hashlib, html, json, os, re, sys, subprocess
from urllib.parse import urlsplit
from site_i18n import LOCALES
from site_i18n import PUBLIC_PAGE_SLUGS, absolute_url, hreflang_links, page_path
from public_copy_ko import localize as localize_korean_tool
from public_copy_locales import localize as localize_remaining_public_copy

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC, DIST = os.path.join(ROOT, 'src'), os.path.join(ROOT, 'dist')
DEFAULT_SITE = 'https://cueprompt.io'


def configured_site():
    """Return a safe origin for canonical URLs and generated SEO files."""
    site = os.environ.get('CUEPROMPT_SITE', DEFAULT_SITE).rstrip('/')
    parsed = urlsplit(site)
    if (parsed.scheme != 'https' or not parsed.netloc or parsed.path or
            parsed.query or parsed.fragment or parsed.username or parsed.password):
        sys.exit('CUEPROMPT_SITE must be an HTTPS origin without a path, query, or fragment (for example https://cueprompt.io).')
    return site


SITE = configured_site()
with open(os.path.join(DIST, 'app.js'), 'rb') as f:
    APP_VERSION = hashlib.sha256(f.read()).hexdigest()[:12]
with open(os.path.join(DIST, 'style.css'), 'rb') as f:
    STYLE_VERSION = hashlib.sha256(f.read()).hexdigest()[:12]
LANGS = list(LOCALES)
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
    compatibility = (
        '<section class="compat-banner" aria-labelledby="compat-title">'
        '<span class="compat-mark" aria-hidden="true">✓</span><div>'
        f'<p class="compat-badge" data-i18n="compat.badge">{html.escape(t("compat.badge"))}</p>'
        f'<h2 id="compat-title" data-i18n="compat.title">{html.escape(t("compat.title"))}</h2>'
        f'<p data-i18n="compat.copy">{html.escape(t("compat.copy"))}</p>'
        '</div></section>'
    )
    out = out.replace('</section><section class="workflow-runway"',
                      '</section>' + compatibility + '<section class="workflow-runway"', 1)
    meta = next(l for l in LANGS if l[0] == code)
    out = re.sub(r'<html lang="[^"]*" dir="[^"]*" data-locale="[^"]*">', f'<html lang="{code}" dir="{meta[2]}" data-locale="{code}">', out, count=1)
    url = SITE + meta[3]
    out = re.sub(r'<link rel="canonical" href="[^"]*">', f'<link rel="canonical" href="{url}">', out, count=1)
    out = re.sub(r'<meta property="og:url" content="[^"]*">', f'<meta property="og:url" content="{url}">', out, count=1)
    out = re.sub(r'"url":"[^"]*"', f'"url":"{url}"', out, count=1)
    # Keep machine-readable application data aligned with the visible language,
    # rather than exposing an English-only description on localized pages.
    out = out.replace('"description":"Free browser-based teleprompter with voice-follow scrolling, a local script library and video recording."',
                      '"description":' + json.dumps(t('meta.description'), ensure_ascii=False) + ',"inLanguage":' + json.dumps(code) + ',"featureList":["Voice-follow scrolling","Browser video recording","Local script library","Fullscreen teleprompter","Desktop and mobile browser support","No installation required"]')
    out = re.sub(r'<!-- hreflang:start -->.*?<!-- hreflang:end -->', hreflang_block(), out, flags=re.S)
    out = out.replace('href="/style.css"', f'href="/style.css?v={STYLE_VERSION}"')
    out = out.replace('<script src="/app.js" defer></script>', f'<script src="/workflow.js" defer></script><script src="/app.js?v={APP_VERSION}" defer></script><script src="/install.js" defer></script>')
    out = out.replace('</head>', '<link rel="manifest" href="/manifest.webmanifest"></head>')
    if code != 'en':
        out = out.replace('<script src="/align.js" defer></script>', f'<script src="/i18n/{code}.js" defer></script><script src="/align.js" defer></script>', 1)
        out = out.replace('<meta property="og:type"', f'<meta property="og:locale" content="{code.replace("-", "_")}"><meta property="og:type"', 1)
    # The feedback dialog predates data-i18n attributes. Keep it translated at
    # build time until its markup is fully key-based; never translate it in
    # the browser after load.
    if code == 'ja':
        feedback = {
            'CUEPROMPT FEEDBACK': 'CUEPROMPT フィードバック', 'Help shape CuePrompt': 'CuePrompt を一緒に改善しましょう',
            'Tell us what worked, what got in your way, or what you need next. Your message opens in your email app; no script, recording, or API key is sent automatically.': 'うまくいったこと、困ったこと、次に必要なことをお聞かせください。メッセージはメールアプリで開かれ、原稿・録画・API キーが自動送信されることはありません。',
            'Feedback type': 'フィードバックの種類', 'Feature idea': '機能のアイデア', 'Something went wrong': '問題が発生した', 'Question': '質問', 'What worked well': '良かった点',
            'Reply email ': '返信先メール ', '(optional)': '（任意）', 'What would you like to share?': '共有したい内容は？',
            'What were you trying to do? What happened? What would make it better?': '何をしようとしましたか？何が起きましたか？どうすれば改善できますか？',
            'Include basic technical context (page URL and browser version) in the email.': '基本的な技術情報（ページ URL とブラウザのバージョン）をメールに含める。',
            'Please do not include private scripts, recordings, passwords, or API keys.': '非公開の原稿、録画、パスワード、API キーは含めないでください。',
            'Prefer email?': 'メールでの連絡：', 'Open email to send →': 'メールを開いて送信 →', 'Close feedback': 'フィードバックを閉じる'
        }
        for source, target in sorted(feedback.items(), key=lambda item: len(item[0]), reverse=True):
            out = out.replace(source, target)
    return out


def write(path, text):
    # Every generated public page gets the same lightweight locale bridge. It
    # preserves the visitor's selected language when a static page links back
    # to Studio, while locale-specific copies are generated incrementally.
    if path.endswith('index.html') and '/vendor/' not in path and 'locale-nav.js' not in text:
        text = text.replace('</head>', '<script src="/locale-nav.js" defer></script></head>', 1)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(text)


def normalize_page_urls(page, url):
    """Replace every generated SEO URL on a retained landing-page template."""
    page = re.sub(r'<link rel="canonical" href="[^"]*">', f'<link rel="canonical" href="{url}">', page, count=1)
    page = re.sub(r'<meta property="og:url" content="[^"]*">', f'<meta property="og:url" content="{url}">', page, count=1)
    return re.sub(r'("mainEntityOfPage"\s*:\s*)"[^"]*"', lambda m: m.group(1) + json.dumps(url), page)


def localize_structured_data(page, title, description, url, locale):
    """Update only the schema subject; keep publisher/author identity intact."""
    def update(match):
        try:
            data = json.loads(match.group(1))
        except json.JSONDecodeError:
            return match.group(0)
        if isinstance(data, dict):
            if data.get('@type') == 'WebApplication':
                data.update(name=title, url=url, description=description, inLanguage=locale)
            elif data.get('@type') == 'Article':
                data.update(headline=title, description=description, mainEntityOfPage=url, inLanguage=locale)
                if isinstance(data.get('author'), dict) and data['author'].get('@type') == 'Organization':
                    data['author']['name'] = 'CuePrompt'
        return '<script type="application/ld+json">' + json.dumps(data, ensure_ascii=False, separators=(',', ':')) + '</script>'
    return re.sub(r'<script type="application/ld\+json">(.*?)</script>', update, page, flags=re.S)


def verify_generated_seo():
    """Fail the build before stale or off-origin SEO metadata can be deployed."""
    errors = []
    for path in sorted(os.path.join(root, name) for root, _, names in os.walk(DIST) for name in names if name == 'index.html'):
        with open(path, encoding='utf-8') as f:
            page = f.read()
        canonical = re.search(r'<link rel="canonical" href="([^"]+)">', page)
        if not canonical:
            errors.append(f'{os.path.relpath(path, ROOT)}: missing canonical')
        elif not canonical.group(1).startswith(SITE + '/'):
            errors.append(f'{os.path.relpath(path, ROOT)}: canonical outside {SITE}')
        if 'chatgpt.site' in page:
            errors.append(f'{os.path.relpath(path, ROOT)}: contains retired preview domain')
    if errors:
        sys.exit('SEO build validation failed:\n' + '\n'.join(errors))


def build_localized_page_copies(catalog):
    """Build locale-specific public-page copies from the canonical English page.

    A locale only ships after it has explicit page copy in page_catalog.json;
    this prevents silently publishing English content under a foreign-language
    canonical URL.
    """
    for locale, pages in catalog.items():
        meta = next(item for item in LANGS if item[0] == locale)
        for slug in PUBLIC_PAGE_SLUGS:
            source = os.path.join(DIST, slug, 'index.html')
            if not os.path.exists(source) or slug not in pages:
                continue
            with open(source, encoding='utf-8') as f:
                page = f.read()
            title, description = pages[slug]
            url = absolute_url(SITE, locale, slug)
            page = re.sub(r'<html\b[^>]*>', f'<html lang="{locale}" dir="{meta[2]}">', page, count=1)
            page = re.sub(r'<title>.*?</title>', f'<title>{html.escape(title)} | CuePrompt</title>', page, count=1, flags=re.S)
            page = re.sub(r'<meta name="description" content="[^"]*">', f'<meta name="description" content="{html.escape(description)}">', page, count=1)
            page = re.sub(r'<meta property="og:title" content="[^"]*">', f'<meta property="og:title" content="{html.escape(title)} | CuePrompt">', page, count=1)
            page = re.sub(r'<meta property="og:description" content="[^"]*">', f'<meta property="og:description" content="{html.escape(description)}">', page, count=1)
            page = normalize_page_urls(page, url)
            # Localized copies are rebuilt from files in dist. Remove every
            # previous alternate/locale tag first; otherwise a second build
            # appends another hreflang set and conflicting og:locale values.
            page = re.sub(r'<!-- hreflang:start -->.*?<!-- hreflang:end -->', '', page, flags=re.S)
            page = re.sub(r'<link rel="alternate" hreflang="[^"]+" href="[^"]*">', '', page)
            page = re.sub(r'<meta property="og:locale" content="[^"]*">', '', page)
            page = localize_structured_data(page, title, description, url, locale)
            page = page.replace('</head>', hreflang_links(SITE, slug) + f'<meta property="og:locale" content="{locale.replace("-", "_")}"></head>', 1)
            page = page.replace('href="/#studio"', f'href="{page_path(locale)}#studio"').replace('href="/"', f'href="{page_path(locale)}"')
            page = re.sub(r'(<h1[^>]*>).*?(</h1>)', r'\1' + html.escape(title) + r'\2', page, count=1, flags=re.S)
            page = localize_public_content(page, locale, slug)
            write(os.path.join(DIST, page_path(locale, slug).strip('/'), 'index.html'), page)


def localize_public_content(page, locale, slug):
    """Translate the shared visible chrome and high-risk legal copy.

    Content keys intentionally remain in the build pipeline (rather than a
    third-party runtime translator), so a static page has its language before
    it reaches a visitor.  Tool-specific form controls are progressively
    extracted in build_creator_tools.py; this covers all shared controls now.
    """
    if locale == 'ko' and slug in ('script-templates', 'script-extractor', 'publishing-assistant', 'video-converter'):
        head, separator, body = page.partition('</head>')
        page = head + separator + localize_korean_tool(body, slug)
    page = localize_remaining_public_copy(page, locale)
    chrome = {
        'es': ('Abrir Studio ↗', 'Revisa el borrador y elige el siguiente paso.'),
        'pt': ('Abrir Studio ↗', 'Revise o rascunho e escolha o próximo passo.'),
        'fr': ('Ouvrir Studio ↗', 'Relisez, puis choisissez la suite.'),
        'de': ('Studio öffnen ↗', 'Entwurf prüfen und nächsten Schritt wählen.'),
        'ja': ('Studio を開く ↗', '下書きを確認して、次の手順を選びます。'),
        'ko': ('Studio 열기 ↗', '초안을 검토하고 다음 단계를 선택하세요.'),
        'ru': ('Открыть Studio ↗', 'Проверьте черновик и выберите следующий шаг.'),
        'ar': ('فتح Studio ↗', 'راجع المسودة ثم اختر الخطوة التالية.'),
        'hi': ('Studio खोलें ↗', 'ड्राफ़्ट जाँचें और अगला चरण चुनें।'),
        'id': ('Buka Studio ↗', 'Tinjau draf, lalu pilih langkah berikutnya.'),
        'vi': ('Mở Studio ↗', 'Xem lại bản nháp, rồi chọn bước tiếp theo.'),
        'th': ('เปิด Studio ↗', 'ตรวจสอบฉบับร่าง แล้วเลือกขั้นตอนถัดไป'),
    }
    if locale in chrome:
        page = page.replace('Open studio ↗', chrome[locale][0]).replace('Review, then choose your next step.', chrome[locale][1])
    common = {
        'ja': {
            'Open studio ↗': 'Studio を開く ↗', 'FROM IDEA TO CAMERA': 'アイデアからカメラへ',
            'YOUR DRAFT': '下書き', 'Review, then choose your next step.': '下書きを確認して、次の手順を選びます。',
            'Title': 'タイトル', 'Draft': '下書き', 'Start reading ': '読み始める ',
            'Edit in studio': 'Studio で編集', 'Download TXT': 'TXT をダウンロード', 'Copy': 'コピー',
            'LOCAL': 'ローカル', 'Back to CuePrompt': 'CuePrompt に戻る',
            'INSTANT TEMPLATE': 'すぐに使えるテンプレート', 'No AI key. No upload. Just a strong first draft.': 'AI キーもアップロードも不要。すぐに使える最初の下書き。',
            'Choose a proven speaking structure, add your words, then edit the result before you read.': '実績ある話し方の構成を選び、内容を加えてから読み上げ前に編集します。',
            'Pick a format': '形式を選ぶ', 'Add your key points': '要点を追加', 'Make it yours': '自分用に仕上げる',
            'CHOOSE A STARTING POINT': '出発点を選ぶ', 'What are you making?': '何を作りますか？',
            'Short video hook': '短い動画の導入', 'Open strong and invite the next step.': '最初に引きつけ、次の行動へ導きます。',
            'Livestream welcome': 'ライブ配信のあいさつ', 'Set the theme and guide chat.': 'テーマを示し、チャットを導きます。',
            'Product introduction': '商品の紹介', 'Problem, value and proof.': '課題、価値、根拠を伝えます。',
            'Lesson or course': 'レッスン・コース', 'Teach one clear outcome.': '一つの明確な成果を教えます。',
            'Podcast opener': 'ポッドキャストの導入', 'Welcome listeners to the episode.': 'エピソードへリスナーを迎えます。',
            'Interview introduction': '面接の自己紹介', 'Tell your story with structure.': '構成を使って自分の話を伝えます。',
            'Talk or presentation': 'スピーチ・プレゼン', 'Build a memorable message.': '印象に残るメッセージを作ります。',
            'Team update': 'チーム更新', 'Progress, blockers, next steps.': '進捗、課題、次の手順。',
            'Format': '形式', 'Script language': 'スクリプトの言語', 'Topic / product / your name': 'テーマ・商品・名前',
            'Who is this for?': '対象者は？', 'Key points ': '要点 ', 'one thought per line': '1 行につき 1 つの考え',
            'Closing action ': '締めくくりの行動 ', 'optional': '任意', 'Generate template draft ': 'テンプレートの下書きを作成 ',
            'This uses an on-device template, not an AI model. Your inputs stay in this browser.': 'これは端末内のテンプレートを使用し、AI モデルは使いません。入力内容はこのブラウザに残ります。',
            'Import text or subtitles': 'テキストまたは字幕を読み込む', 'Transcript': '文字起こし', 'Clean transcript': '文字起こしを整理',
            'TXT, Markdown, SRT and VTT · up to 5 MB. Paste a YouTube transcript, import captions, or use the options below for public webpages, images, audio and video.': 'TXT、Markdown、SRT、VTT（最大 5 MB）。YouTube の文字起こしを貼り付けるか、字幕を読み込んでください。公開 Web ページ、画像、音声、動画には下の読み込み機能を使えます。',
            'Paste your transcript or subtitle contents here': '文字起こしまたは字幕の内容をここに貼り付けてください',
            'Video title': '動画タイトル', 'Script': 'スクリプト', 'Call to action': '行動を促す言葉', 'Keywords (comma separated)': 'キーワード（カンマ区切り）',
            'Build publishing copy': '公開用テキストを作成', 'Recording': '録画ファイル', 'Platform preset': 'プラットフォームのプリセット',
            'Output format': '出力形式', 'Canvas': '画面比率', 'Quality': '品質', 'Compress / convert locally': '端末内で圧縮・変換', 'Cancel': 'キャンセル',
            'Busy creators': '忙しいクリエイター', 'The problem you solve&#10;Your practical advice&#10;A concrete example': '解決する課題&#10;実践的なアドバイス&#10;具体例',
            'A simpler way to plan your week': '1 週間をもっと簡単に計画する方法', 'My next video': '次の動画',
            'Your draft will appear here. You can edit it before using it.': 'ここに下書きが表示されます。使う前に編集できます。',
            'Try this today and share what changed': '今日試して、変化を共有してください',
            'Start with a proven script structure': '実績あるスクリプト構成から始める',
            'Choose a YouTube intro, product pitch, lesson, meeting update, podcast opener, speech, livestream welcome or self-introduction. Add your topic, audience and key points, then edit the draft before you read it.': 'YouTube の導入、商品紹介、レッスン、チーム更新、ポッドキャストの導入、スピーチ、ライブ配信のあいさつ、自己紹介から選べます。テーマ、対象者、要点を加え、読み上げ前に下書きを編集してください。',
            'A private first draft, ready for the teleprompter': 'テレプロンプターですぐ使えるプライベートな下書き',
            'The template builder runs in your browser. It does not need an AI key and does not upload your ideas. Send the finished draft to CuePrompt Studio when you are ready to rehearse.': 'テンプレート作成機能はブラウザ内で動作します。AI キーは不要で、アイデアをアップロードしません。練習の準備ができたら、完成した下書きを CuePrompt Studio に送れます。',
            'Drafts stay in this browser. Optional transcription sends your selected recording to your chosen service.': '下書きはこのブラウザに残ります。任意の文字起こしでは、選択した録画のみが選択したサービスに送信されます。',
            'Choose a speaking format, add your ideas, and build a script you can rehearse immediately.': '話し方の形式を選び、アイデアを加えて、すぐに練習できる台本を作成します。',
            'Publishing Checklist &amp; Copy Builder': '公開チェックリストと文章作成',
            'Local Video Compressor &amp; Converter': 'ローカル動画圧縮・変換',
            'Paste a YouTube transcript': 'YouTube の文字起こしを貼り付け',
            'Open email to send →': 'メールを開いて送信 →',
            'Help shape CuePrompt': 'CuePrompt の改善にご協力ください',
            'Feedback type': 'フィードバックの種類',
            'What would you like to share?': 'どのようなことを共有しますか？',
            'Write for the camera, not the page': '紙ではなく、カメラに向けて書く',
            'Browse all guides': 'すべてのガイドを見る', 'Choose a script template': '台本テンプレートを選ぶ',
        },
        'zh-CN': {
            'Open studio ↗': '打开工作台 ↗', 'FROM IDEA TO CAMERA': '从想法到镜头',
            'YOUR DRAFT': '你的草稿', 'Review, then choose your next step.': '检查草稿，然后选择下一步。',
            'Title': '标题', 'Draft': '草稿', 'Start reading ': '开始朗读 ',
            'Edit in studio': '在工作台编辑', 'Download TXT': '下载 TXT', 'Copy': '复制',
            'LOCAL': '本地', 'Back to CuePrompt': '返回 CuePrompt',
            'Private by design. Drafts stay in this browser.': '隐私优先：草稿保留在此浏览器中。',
            'Drafts stay in this browser. Optional transcription sends your selected recording to your chosen service.': '草稿保留在此浏览器中。仅当你主动使用转录服务时，所选录音才会直接发送给你选择的服务商。',
            'Privacy': '隐私', 'Terms': '条款', 'Contact': '联系',
            'INSTANT TEMPLATE': '即时模板', 'No AI key. No upload. Just a strong first draft.': '无需 AI Key，无需上传。先获得一份扎实初稿。',
            'Choose a proven speaking structure, add your words, then edit the result before you read.': '选择成熟的口播结构，填入你的内容，再在朗读前编辑初稿。',
            'Pick a format': '选择形式', 'Add your key points': '添加关键要点', 'Make it yours': '形成你的版本',
            'Format': '形式', 'Script language': '脚本语言', 'Topic / product / your name': '主题 / 产品 / 你的名字',
            'Who is this for?': '面向谁？', 'Key points ': '关键要点 ', 'one thought per line': '每行一个要点',
            'Closing action ': '结尾行动号召 ', 'optional': '可选', 'Generate template draft ': '生成脚本初稿 ',
            'This uses an on-device template, not an AI model. Your inputs stay in this browser.': '此功能使用设备内置模板，不调用 AI 模型；输入内容留在此浏览器中。',
            'Import text or subtitles': '导入文本或字幕', 'Transcript': '转录稿', 'Clean transcript': '清理转录稿',
            'Video title': '视频标题', 'Script': '脚本', 'Call to action': '行动号召', 'Keywords (comma separated)': '关键词（用逗号分隔）',
            'Build publishing copy': '生成发布文案', 'Recording': '录制文件', 'Platform preset': '平台预设',
            'Output format': '输出格式', 'Canvas': '画布', 'Quality': '质量', 'Compress / convert locally': '在本地压缩 / 转换', 'Cancel': '取消',
            'Choose a speaking format, add your ideas, and build a script you can rehearse immediately.': '选择口播形式，加入你的想法，生成一份可以立即排练的脚本。',
            'Script Template Builder': '脚本模板生成器', 'Transcript Cleaner': '转录稿清理器',
            'Publishing Checklist &amp; Copy Builder': '发布检查清单与文案生成器',
            'Local Video Compressor &amp; Converter': '本地视频压缩与转换器',
            'CHOOSE A STARTING POINT': '选择起点', 'What are you making?': '你想制作什么？',
            'Short video hook': '短视频开场', 'Busy creators': '忙碌的内容创作者',
            'The problem you solve': '你解决的问题',
            'Start with a proven script structure': '从成熟的脚本结构开始',
            'Paste a YouTube transcript': '粘贴 YouTube 转录稿',
            'Paste your transcript': '粘贴你的转录稿',
            'Open email to send →': '打开邮件并发送 →',
            'Help shape CuePrompt': '帮助改进 CuePrompt', 'Feedback type': '反馈类型',
            'What would you like to share?': '你想分享什么？',
            'Write for the camera, not the page': '为镜头而写，不是为纸面而写',
            'Browse all guides': '浏览全部指南', 'Choose a script template': '选择脚本模板',
        },
        'zh-TW': {
            'Open studio ↗': '開啟工作台 ↗', 'FROM IDEA TO CAMERA': '從想法到鏡頭',
            'YOUR DRAFT': '你的草稿', 'Review, then choose your next step.': '檢查草稿，然後選擇下一步。',
            'Title': '標題', 'Draft': '草稿', 'Start reading ': '開始朗讀 ',
            'Edit in studio': '在工作台編輯', 'Download TXT': '下載 TXT', 'Copy': '複製',
            'LOCAL': '本機', 'Back to CuePrompt': '返回 CuePrompt',
            'Privacy': '隱私', 'Terms': '條款', 'Contact': '聯絡',
            'Choose a speaking format, add your ideas, and build a script you can rehearse immediately.': '選擇口說形式，加入你的想法，建立一份可以立即排練的腳本。',
            'Script Template Builder': '腳本範本建立器', 'Transcript Cleaner': '轉錄稿整理器',
            'Publishing Checklist &amp; Copy Builder': '發佈檢查清單與文案建立器',
            'Local Video Compressor &amp; Converter': '本機影片壓縮與轉換器',
            'Drafts stay in this browser. Optional transcription sends your selected recording to your chosen service.': '草稿會保留在這個瀏覽器中。只有在你主動使用轉錄服務時，所選錄音才會傳送給你指定的服務。',
            'INSTANT TEMPLATE': '即時範本',
            'No AI key. No upload. Just a strong first draft.': '不需要 AI Key，不需上傳。先完成一份扎實的初稿。',
            'Choose a proven speaking structure, add your words, then edit the result before you read.': '選擇成熟的口說結構，加入你的內容，再於朗讀前編輯初稿。',
            'CHOOSE A STARTING POINT': '選擇起點', 'What are you making?': '你想製作什麼？',
            'Short video hook': '短影片開場', 'Busy creators': '忙碌的內容創作者',
            'The problem you solve': '你解決的問題',
            'Start with a proven script structure': '從成熟的腳本結構開始',
            'Paste a YouTube transcript': '貼上 YouTube 轉錄稿',
            'Paste your transcript': '貼上你的轉錄稿',
            'Open email to send →': '開啟電子郵件並傳送 →',
            'Help shape CuePrompt': '協助改善 CuePrompt', 'Feedback type': '意見回饋類型',
            'What would you like to share?': '你想分享什麼？',
            'Write for the camera, not the page': '為鏡頭而寫，不是為紙面而寫',
            'Browse all guides': '瀏覽所有指南', 'Choose a script template': '選擇腳本範本',
        },
    }
    # Long strings first: replacing "Draft" before "Drafts stay …" would
    # otherwise leave broken mixed-language prose in a localized page.
    for source, target in sorted(common.get(locale, {}).items(), key=lambda item: len(item[0]), reverse=True):
        page = page.replace(source, target)
    # Native file-picker text follows the browser UI language, so the custom
    # file control carries its own localized button and empty-state labels.
    file_labels = {
        'es': ('Elegir archivo', 'Ningún archivo seleccionado'),
        'pt': ('Escolher arquivo', 'Nenhum arquivo selecionado'),
        'fr': ('Choisir un fichier', 'Aucun fichier choisi'),
        'de': ('Datei auswählen', 'Keine Datei ausgewählt'),
        'ja': ('ファイルを選択', 'ファイルが選択されていません'),
        'ko': ('파일 선택', '선택된 파일 없음'),
        'ru': ('Выбрать файл', 'Файл не выбран'),
        'ar': ('اختيار ملف', 'لم يتم اختيار أي ملف'),
        'hi': ('फ़ाइल चुनें', 'कोई फ़ाइल चुनी नहीं गई'),
        'id': ('Pilih file', 'Tidak ada file yang dipilih'),
        'vi': ('Chọn tệp', 'Không có tệp nào được chọn'),
        'th': ('เลือกไฟล์', 'ไม่ได้เลือกไฟล์ไว้'),
        'zh-CN': ('选择文件', '未选择任何文件'),
        'zh-TW': ('選擇檔案', '未選擇任何檔案'),
    }
    if locale in file_labels:
        page = page.replace('Choose file', file_labels[locale][0]).replace('No file selected', file_labels[locale][1])
    if locale == 'zh-CN' and slug == 'script-templates':
        page = page.replace(
            '<option value="youtube">YouTube introduction</option><option value="pitch">Product pitch</option><option value="course">Online lesson</option><option value="meeting">Team update</option><option value="podcast">Podcast opening</option><option value="speech">Short speech</option><option value="live">Livestream welcome</option><option value="interview">Self introduction</option>',
            '<option value="youtube">YouTube 开场</option><option value="pitch">产品介绍</option><option value="course">在线课程</option><option value="meeting">团队更新</option><option value="podcast">播客开场</option><option value="speech">简短演讲</option><option value="live">直播欢迎语</option><option value="interview">自我介绍</option>')
    if locale == 'ja' and slug == 'script-templates':
        page = page.replace(
            '<option value="youtube">YouTube introduction</option><option value="pitch">Product pitch</option><option value="course">Online lesson</option><option value="meeting">Team update</option><option value="podcast">Podcast opening</option><option value="speech">Short speech</option><option value="live">Livestream welcome</option><option value="interview">Self introduction</option>',
            '<option value="youtube">YouTube の導入</option><option value="pitch">商品紹介</option><option value="course">オンラインレッスン</option><option value="meeting">チーム更新</option><option value="podcast">ポッドキャストの導入</option><option value="speech">短いスピーチ</option><option value="live">ライブ配信のあいさつ</option><option value="interview">自己紹介</option>')
    if slug == 'script-templates' and locale != 'en':
        # Preselect the script language matching the page locale, so the
        # generated draft defaults to the language the visitor is reading.
        # The en pass rewrites the English source page, so it must stay
        # untouched or every later locale would inherit a second selected.
        script_code = {'zh-CN': 'zh', 'zh-TW': 'zh-tw'}.get(locale, locale)
        page = page.replace(f'<option value="{script_code}">', f'<option value="{script_code}" selected>', 1)
    if locale == 'zh-CN' and slug == 'privacy':
        body = '''<p>CuePrompt 设计为无需帐号即可在浏览器中使用。本政策说明哪些数据保留在你的设备上、哪些数据由你主动发送给第三方，以及如何联系我们。</p><h2>脚本、设置和录制</h2><p>脚本、偏好设置和脚本库储存在你的浏览器中。摄像头录制在你的设备上创建，不会上传到 CuePrompt 服务器。你可以在浏览器中删除本地数据，或在 CuePrompt 中导出并删除脚本库。清除浏览器数据可能会移除本地脚本和设置。</p><h2>Smart Follow 与麦克风音频</h2><p>启用 Smart Follow 后，浏览器会把麦克风音频发送到其语音识别服务以生成文字。服务可能由 Google、Microsoft 或 Apple 提供，取决于你的浏览器。CuePrompt 只在本地用识别结果对齐提词内容；CuePrompt 自身不会接收音频或转录文字。该功能需要网络连接，且并非所有浏览器或地区都可用。</p><h2>摄像头和麦克风权限</h2><p>只有在你主动选择需要该功能时，CuePrompt 才请求摄像头或麦克风权限。你可在浏览器或设备设置中撤销权限。录制内容会留在设备上，除非你自行下载、分享或上传。</p><h2>自带 AI Key 与转录服务</h2><p>如果你使用 AI 写稿或配置转录服务，请求所需的文本、录音和 API Key 会直接从浏览器发送给你选择的服务商。CuePrompt 不提供、接收或存储这些 API Key。请阅读服务商的隐私条款，并为密钥设置合理的消费上限。</p><h2>网站访问与沟通</h2><p>与多数网站一样，提供网站和邮件服务的供应商可能处理提供网页或投递邮件所需的标准技术信息。若你发邮件联系我们，我们会使用邮件内容和联系方式回复并提供支持。</p><h2>你的选择与联系我们</h2><p>CuePrompt 不提供帐号或云端脚本存储，因此大多数数据控制都在你的浏览器中。如有隐私问题或需要支持，请联系 <a href="mailto:support@cueprompt.io">support@cueprompt.io</a>。</p><h2>变更</h2><p>随着 CuePrompt 的变化，我们可能更新本政策；页面顶部日期表示最近修订时间。</p>'''
        page = re.sub(r'(<main class="legal-page">.*?<p class="updated">.*?</p>).*?(</main>)', r'\1' + body + r'\2', page, count=1, flags=re.S)
    if locale == 'zh-CN' and slug == 'terms':
        body = '''<p>本条款适用于你对 CuePrompt 及其浏览器创作工具的使用。使用 CuePrompt 即表示你同意以负责任且符合法律的方式使用本服务。</p><h2>服务</h2><p>CuePrompt 提供基于浏览器的提词、脚本和创作者工具。功能可能会变更，在某些浏览器或地区不可用，或依赖浏览器、设备及你选择的第三方服务。</p><h2>你的内容与责任</h2><p>你对脚本、录制、上传内容及处理的任何材料负责。请勿处理无权使用的内容，或将 CuePrompt 用于违法、有害或侵权活动。请自行备份重要内容；清除浏览器数据可能删除本地存储的内容。</p><h2>第三方服务</h2><p>Smart Follow 依赖浏览器的语音识别服务。可选的 AI 写稿和转录请求会直接发送给你配置的服务商。这些服务有各自的条款、隐私实践、可用性和费用；你需自行审阅并承担相应费用。</p><h2>可用性与免责声明</h2><p>CuePrompt 按“现状”提供。我们努力保持服务有用和可靠，但不保证不中断运行、兼容所有设备或浏览器，也不保证每项功能适用于特定目的。重要活动前请测试录制和导出流程。</p><h2>变更与联系</h2><p>我们可能修改或停止功能，或更新这些条款。更新后继续使用即表示接受更新后的条款。如有问题，请联系 <a href="mailto:support@cueprompt.io">support@cueprompt.io</a>。</p>'''
        page = re.sub(r'(<main class="legal-page">.*?<p class="updated">.*?</p>).*?(</main>)', r'\1' + body + r'\2', page, count=1, flags=re.S)
    if locale == 'es' and slug == 'privacy':
        body = '''<p>CuePrompt está diseñado para funcionar en tu navegador sin crear una cuenta. Esta política explica qué permanece en tu dispositivo, qué decides enviar a terceros y cómo contactarnos.</p><h2>Guiones, ajustes y grabaciones</h2><p>Tus guiones, preferencias y biblioteca se guardan en el navegador. Las grabaciones de cámara se crean en tu dispositivo y no se suben a un servidor de CuePrompt. Puedes borrar datos locales en el navegador o exportar y eliminar la biblioteca. Al borrar datos del navegador podrías eliminar guiones y ajustes locales.</p><h2>Smart Follow y audio del micrófono</h2><p>Al activar Smart Follow, el navegador envía audio del micrófono a su servicio de reconocimiento de voz para generar texto. Según el navegador, ese servicio puede ser de Google, Microsoft o Apple. CuePrompt utiliza el resultado localmente para alinear el apuntador; no recibe tu audio ni la transcripción en sus propios servidores. La función necesita conexión y puede no estar disponible en todos los navegadores o regiones.</p><h2>Permisos de cámara y micrófono</h2><p>CuePrompt solicita acceso a la cámara o al micrófono solo después de que elijas una función que lo necesita. Puedes revocar los permisos en los ajustes del navegador o dispositivo. La grabación permanece en tu dispositivo salvo que decidas descargarla, compartirla o subirla.</p><h2>Tu propia clave de IA y transcripción</h2><p>Si usas el redactor de IA o configuras un servicio de transcripción, el texto, la grabación y la clave API necesarios se envían directamente desde tu navegador al proveedor elegido. CuePrompt no proporciona, recibe ni almacena esas claves API. Revisa las condiciones del proveedor y usa una clave con un límite de gasto adecuado.</p><h2>Entrega del sitio y comunicaciones</h2><p>Como la mayoría de los sitios, los proveedores de alojamiento y correo pueden procesar información técnica estándar necesaria para servir una página o entregar un mensaje. Si nos escribes, usamos tu mensaje y datos de contacto para responder y prestar soporte.</p><h2>Tus opciones y contacto</h2><p>Como CuePrompt no ofrece cuentas ni almacenamiento de guiones en la nube, la mayoría de los controles de datos están en el navegador. Para cuestiones de privacidad o soporte, escribe a <a href="mailto:support@cueprompt.io">support@cueprompt.io</a>.</p><h2>Cambios</h2><p>Podemos actualizar esta política a medida que CuePrompt cambie. La fecha de arriba indica la última revisión.</p>'''
        page = re.sub(r'(<main class="legal-page">.*?<p class="updated">.*?</p>).*?(</main>)', r'\1' + body + r'\2', page, count=1, flags=re.S)
    if locale == 'es' and slug == 'terms':
        body = '''<p>Estas condiciones regulan el uso de CuePrompt y sus herramientas para creadores basadas en navegador. Al utilizar CuePrompt aceptas usarlo responsablemente y de acuerdo con la ley aplicable.</p><h2>El servicio</h2><p>CuePrompt ofrece herramientas de apuntador, guion y creación en el navegador. Las funciones pueden cambiar, no estar disponibles en determinados navegadores o regiones, o depender de servicios del navegador, dispositivo o proveedor que elijas.</p><h2>Tu contenido y responsabilidades</h2><p>Eres responsable de tus guiones, grabaciones, cargas y materiales procesados. No uses CuePrompt para contenido que no tengas derecho a utilizar ni para actividades ilícitas, dañinas o infractoras. Conserva tu propia copia de los materiales importantes; borrar datos del navegador puede eliminar contenido local.</p><h2>Servicios de terceros</h2><p>Smart Follow depende del servicio de reconocimiento de voz del navegador. Las solicitudes opcionales de IA y transcripción se envían directamente al proveedor que configures. Esos servicios tienen sus propias condiciones, prácticas de privacidad, disponibilidad y costes; te corresponde revisarlos y asumir los cargos aplicables.</p><h2>Disponibilidad y garantías</h2><p>CuePrompt se proporciona según disponibilidad. Trabajamos para que sea útil y fiable, pero no garantizamos funcionamiento ininterrumpido, compatibilidad con todos los dispositivos o navegadores, ni que una función sirva para un fin concreto. Prueba la grabación y la exportación antes de depender de ellas en un evento importante.</p><h2>Cambios y contacto</h2><p>Podemos modificar o retirar funciones o estas condiciones. El uso continuado tras una actualización implica aceptar las condiciones actualizadas. Para preguntas, escribe a <a href="mailto:support@cueprompt.io">support@cueprompt.io</a>.</p>'''
        page = re.sub(r'(<main class="legal-page">.*?<p class="updated">.*?</p>).*?(</main>)', r'\1' + body + r'\2', page, count=1, flags=re.S)
    if locale == 'pt' and slug == 'privacy':
        body = '''<p>O CuePrompt foi criado para funcionar no seu navegador sem conta. Esta política explica o que permanece no seu dispositivo, o que você escolhe enviar a terceiros e como falar conosco.</p><h2>Roteiros, configurações e gravações</h2><p>Seus roteiros, preferências e biblioteca ficam armazenados no navegador. As gravações de câmera são criadas no dispositivo e não são enviadas a um servidor do CuePrompt. Você pode excluir dados locais no navegador ou exportar e apagar a biblioteca. Limpar os dados do navegador pode remover roteiros e configurações locais.</p><h2>Smart Follow e áudio do microfone</h2><p>Ao ativar o Smart Follow, o navegador envia o áudio do microfone ao seu serviço de reconhecimento de fala para produzir texto. Dependendo do navegador, esse serviço pode ser fornecido por Google, Microsoft ou Apple. O CuePrompt usa o resultado localmente para alinhar o teleprompter; não recebe seu áudio nem sua transcrição em seus próprios servidores. O recurso precisa de conexão e pode não estar disponível em todos os navegadores ou regiões.</p><h2>Permissões de câmera e microfone</h2><p>O CuePrompt solicita acesso à câmera ou ao microfone somente depois que você escolhe um recurso que precisa dele. Você pode revogar essas permissões nas configurações do navegador ou dispositivo. A gravação fica no dispositivo, exceto se você optar por baixá-la, compartilhá-la ou enviá-la.</p><h2>Sua própria chave de IA e transcrição</h2><p>Se você usar o redator de IA ou configurar um serviço de transcrição, o texto, a gravação e a chave de API necessários são enviados diretamente do navegador ao provedor escolhido. O CuePrompt não fornece, recebe nem armazena essas chaves. Consulte os termos de privacidade do provedor e use uma chave com limite de gastos adequado.</p><h2>Entrega do site e comunicações</h2><p>Como a maioria dos sites, os provedores de hospedagem e email podem processar informações técnicas padrão necessárias para entregar uma página ou mensagem. Se você nos enviar um email, usamos a mensagem e seus dados de contato para responder e prestar suporte.</p><h2>Suas escolhas e contato</h2><p>Como o CuePrompt não oferece contas nem armazenamento de roteiros na nuvem, a maioria dos controles de dados está no navegador. Para dúvidas de privacidade ou suporte, escreva para <a href="mailto:support@cueprompt.io">support@cueprompt.io</a>.</p><h2>Alterações</h2><p>Podemos atualizar esta política conforme o CuePrompt evoluir. A data acima indica a última revisão.</p>'''
        page = re.sub(r'(<main class="legal-page">.*?<p class="updated">.*?</p>).*?(</main>)', r'\1' + body + r'\2', page, count=1, flags=re.S)
    if locale == 'pt' and slug == 'terms':
        body = '''<p>Estes termos regem seu uso do CuePrompt e de suas ferramentas de criação no navegador. Ao usar o CuePrompt, você concorda em usá-lo com responsabilidade e de acordo com a lei aplicável.</p><h2>O serviço</h2><p>O CuePrompt oferece ferramentas de teleprompter, roteiro e criação no navegador. Os recursos podem mudar, não estar disponíveis em determinados navegadores ou regiões, ou depender de serviços do navegador, dispositivo ou provedor que você escolher.</p><h2>Seu conteúdo e responsabilidades</h2><p>Você é responsável por seus roteiros, gravações, envios e qualquer material processado. Não use o CuePrompt para processar conteúdo que não tenha direito de usar, nem para atividades ilegais, prejudiciais ou que infrinjam direitos. Mantenha cópias de materiais importantes; limpar dados do navegador pode remover conteúdo local.</p><h2>Serviços de terceiros</h2><p>O Smart Follow depende do serviço de reconhecimento de fala do navegador. Pedidos opcionais de IA e transcrição são enviados diretamente ao provedor que você configurar. Esses serviços têm seus próprios termos, práticas de privacidade, disponibilidade e cobranças; cabe a você analisá-los e arcar com os custos.</p><h2>Disponibilidade e isenções</h2><p>O CuePrompt é oferecido conforme disponibilidade. Trabalhamos para mantê-lo útil e confiável, mas não garantimos operação ininterrupta, compatibilidade com todos os dispositivos ou navegadores, nem adequação a um propósito específico. Teste gravação e exportação antes de depender delas em um evento importante.</p><h2>Alterações e contato</h2><p>Podemos modificar ou descontinuar recursos ou estes termos. O uso continuado após uma atualização significa que você aceita os termos atualizados. Para dúvidas, escreva para <a href="mailto:support@cueprompt.io">support@cueprompt.io</a>.</p>'''
        page = re.sub(r'(<main class="legal-page">.*?<p class="updated">.*?</p>).*?(</main>)', r'\1' + body + r'\2', page, count=1, flags=re.S)
    if locale == 'fr' and slug == 'privacy':
        body = '''<p>CuePrompt fonctionne dans votre navigateur sans compte. Cette politique explique ce qui reste sur votre appareil, ce que vous choisissez d’envoyer à des tiers et comment nous contacter.</p><h2>Scripts, réglages et enregistrements</h2><p>Vos scripts, préférences et bibliothèque sont stockés dans le navigateur. Les enregistrements caméra sont créés sur votre appareil et ne sont pas téléversés sur un serveur CuePrompt. Vous pouvez supprimer les données locales ou exporter puis supprimer votre bibliothèque. Effacer les données du navigateur peut supprimer les scripts et réglages locaux.</p><h2>Smart Follow et microphone</h2><p>Lorsque vous activez Smart Follow, le navigateur envoie le son du microphone à son service de reconnaissance vocale pour produire du texte. Ce service peut être fourni par Google, Microsoft ou Apple selon le navigateur. CuePrompt utilise le résultat localement pour aligner le prompteur ; il ne reçoit ni votre audio ni votre transcription sur ses serveurs. Cette fonction exige une connexion et peut ne pas être disponible partout.</p><h2>Caméra, IA et transcription</h2><p>CuePrompt demande l’accès à la caméra ou au microphone seulement après votre choix d’une fonction concernée. L’enregistrement reste sur votre appareil sauf si vous le téléchargez, partagez ou téléversez vous-même. Si vous utilisez l’outil d’IA ou une transcription, le texte, l’enregistrement et la clé API nécessaires partent directement du navigateur vers le fournisseur choisi. CuePrompt ne fournit, ne reçoit ni ne stocke ces clés.</p><h2>Contact et modifications</h2><p>Les fournisseurs d’hébergement et d’email peuvent traiter les informations techniques nécessaires à la livraison du site ou d’un message. Nous utilisons votre message et vos coordonnées pour répondre au support. Pour toute question de confidentialité, contactez <a href="mailto:support@cueprompt.io">support@cueprompt.io</a>. Cette politique peut évoluer ; la date affichée indique sa dernière révision.</p>'''
        page = re.sub(r'(<main class="legal-page">.*?<p class="updated">.*?</p>).*?(</main>)', r'\1' + body + r'\2', page, count=1, flags=re.S)
    if locale == 'fr' and slug == 'terms':
        body = '''<p>Ces conditions régissent votre utilisation de CuePrompt et de ses outils créateurs dans le navigateur. En utilisant CuePrompt, vous acceptez de l’utiliser de manière responsable et conformément au droit applicable.</p><h2>Service et votre contenu</h2><p>CuePrompt fournit des outils de prompteur, de script et de création dans le navigateur. Les fonctions peuvent évoluer, être indisponibles selon le navigateur ou la région, ou dépendre de services de votre navigateur, appareil ou fournisseur choisi. Vous êtes responsable de vos scripts, enregistrements, téléversements et contenus. Conservez une copie des éléments importants : supprimer les données du navigateur peut retirer le contenu local.</p><h2>Services tiers</h2><p>Smart Follow dépend du service de reconnaissance vocale du navigateur. Les demandes facultatives d’IA et de transcription sont envoyées directement au fournisseur configuré. Ces services ont leurs propres conditions, pratiques de confidentialité, disponibilité et frais ; vous devez les examiner et supporter les frais applicables.</p><h2>Disponibilité et contact</h2><p>CuePrompt est fourni selon disponibilité. Nous ne garantissons pas un fonctionnement ininterrompu, une compatibilité avec tous les appareils ou l’adéquation à un besoin particulier. Testez l’enregistrement et l’export avant un événement important. Nous pouvons modifier ces conditions ou interrompre des fonctions. Pour toute question, contactez <a href="mailto:support@cueprompt.io">support@cueprompt.io</a>.</p>'''
        page = re.sub(r'(<main class="legal-page">.*?<p class="updated">.*?</p>).*?(</main>)', r'\1' + body + r'\2', page, count=1, flags=re.S)
    if locale == 'de' and slug == 'privacy':
        body = '''<p>CuePrompt funktioniert ohne Konto in Ihrem Browser. Diese Richtlinie erklärt, was auf Ihrem Gerät bleibt, was Sie selbst an Dritte senden und wie Sie uns kontaktieren.</p><h2>Skripte, Einstellungen und Aufnahmen</h2><p>Skripte, Einstellungen und Ihre Bibliothek werden im Browser gespeichert. Kameraaufnahmen entstehen auf Ihrem Gerät und werden nicht auf einen CuePrompt-Server hochgeladen. Sie können lokale Daten löschen oder die Bibliothek exportieren und entfernen. Das Löschen von Browserdaten kann lokale Skripte und Einstellungen entfernen.</p><h2>Smart Follow und Mikrofon</h2><p>Bei Smart Follow sendet Ihr Browser Mikrofon-Audio an seinen Spracherkennungsdienst, um Text zu erzeugen. Je nach Browser kann dieser Dienst von Google, Microsoft oder Apple stammen. CuePrompt nutzt das Ergebnis lokal zur Ausrichtung des Prompters und erhält weder Audio noch Transkript auf eigenen Servern. Die Funktion braucht eine Verbindung und ist nicht überall verfügbar.</p><h2>Kamera, KI und Transkription</h2><p>CuePrompt fordert Kamera- oder Mikrofonzugriff nur nach Wahl einer entsprechenden Funktion an. Aufnahmen bleiben auf Ihrem Gerät, sofern Sie sie nicht selbst herunterladen, teilen oder hochladen. Bei KI-Schreiben oder Transkription werden Text, Aufnahme und erforderlicher API-Schlüssel direkt aus Ihrem Browser an den gewählten Anbieter gesendet. CuePrompt stellt diese Schlüssel nicht bereit, empfängt oder speichert sie nicht.</p><h2>Kontakt und Änderungen</h2><p>Hosting- und E-Mail-Anbieter können technische Informationen verarbeiten, die für Website oder Nachricht erforderlich sind. Bei einer E-Mail nutzen wir Nachricht und Kontaktdaten zur Antwort. Datenschutzfragen richten Sie an <a href="mailto:support@cueprompt.io">support@cueprompt.io</a>. Diese Richtlinie kann aktualisiert werden; das Datum zeigt die letzte Überarbeitung.</p>'''
        page = re.sub(r'(<main class="legal-page">.*?<p class="updated">.*?</p>).*?(</main>)', r'\1' + body + r'\2', page, count=1, flags=re.S)
    if locale == 'de' and slug == 'terms':
        body = '''<p>Diese Bedingungen regeln die Nutzung von CuePrompt und seiner browserbasierten Creator-Tools. Mit der Nutzung verpflichten Sie sich zu einer verantwortlichen und rechtmäßigen Verwendung.</p><h2>Dienst und Inhalte</h2><p>CuePrompt bietet Prompter-, Skript- und Creator-Tools im Browser. Funktionen können sich ändern, in einzelnen Browsern oder Regionen fehlen oder von Diensten Ihres Browsers, Geräts oder gewählten Anbieters abhängen. Sie sind für Skripte, Aufnahmen, Uploads und verarbeitete Inhalte verantwortlich. Sichern Sie wichtige Inhalte selbst; Browserdaten können lokale Inhalte entfernen.</p><h2>Drittanbieter</h2><p>Smart Follow nutzt die Spracherkennung Ihres Browsers. Optionale KI- und Transkriptionsanfragen gehen direkt an den von Ihnen konfigurierten Anbieter. Diese Dienste haben eigene Bedingungen, Datenschutzpraktiken, Verfügbarkeit und Kosten, die Sie prüfen und tragen müssen.</p><h2>Verfügbarkeit und Kontakt</h2><p>CuePrompt wird nach Verfügbarkeit bereitgestellt. Wir garantieren keinen unterbrechungsfreien Betrieb, keine Kompatibilität mit jedem Gerät oder Browser und keine Eignung für einen bestimmten Zweck. Testen Sie Aufnahme und Export vor wichtigen Einsätzen. Funktionen oder Bedingungen können geändert werden. Fragen richten Sie an <a href="mailto:support@cueprompt.io">support@cueprompt.io</a>.</p>'''
        page = re.sub(r'(<main class="legal-page">.*?<p class="updated">.*?</p>).*?(</main>)', r'\1' + body + r'\2', page, count=1, flags=re.S)
    return page


def expand_page_catalog(catalog):
    """Supply localized metadata for every supported locale.

    The canonical English and Simplified Chinese copy remains in JSON because
    those pages receive editorial updates most often.  The concise labels
    below make every public route discoverable in the visitor's language,
    without translating at request time or falling back to a wrong-language
    canonical URL.
    """
    labels = {
        'es': ('Herramientas y guías de CuePrompt', 'Una herramienta privada de CuePrompt para escribir, practicar y grabar.'),
        'pt': ('Ferramentas e guias do CuePrompt', 'Uma ferramenta privada do CuePrompt para escrever, ensaiar e gravar.'),
        'fr': ('Outils et guides CuePrompt', 'Un outil CuePrompt privé pour écrire, répéter et enregistrer.'),
        'de': ('CuePrompt-Tools und Anleitungen', 'Ein privates CuePrompt-Tool zum Schreiben, Üben und Aufnehmen.'),
        'ja': ('CuePrompt のツールとガイド', '書く、練習する、録画するためのプライベートな CuePrompt ツールです。'),
        'ko': ('CuePrompt 도구 및 가이드', '작성, 연습, 녹화를 위한 비공개 CuePrompt 도구입니다.'),
        'ru': ('Инструменты и руководства CuePrompt', 'Приватный инструмент CuePrompt для подготовки, репетиции и записи.'),
        'ar': ('أدوات وأدلة CuePrompt', 'أداة CuePrompt خاصة للكتابة والتدريب والتسجيل.'),
        'hi': ('CuePrompt टूल और गाइड', 'लिखने, अभ्यास करने और रिकॉर्ड करने के लिए निजी CuePrompt टूल।'),
        'id': ('Alat dan panduan CuePrompt', 'Alat CuePrompt privat untuk menulis, berlatih, dan merekam.'),
        'vi': ('Công cụ và hướng dẫn CuePrompt', 'Công cụ CuePrompt riêng tư để viết, luyện tập và ghi hình.'),
        'th': ('เครื่องมือและคู่มือ CuePrompt', 'เครื่องมือ CuePrompt แบบส่วนตัวสำหรับเขียน ซ้อม และบันทึกวิดีโอ'),
        'zh-TW': ('CuePrompt 工具與指南', '用於寫稿、排練和錄製的私密 CuePrompt 工具。'),
    }
    titles = {
        'es': ('Creador de plantillas de guion','Limpiador de transcripciones','Asistente de publicación','Compresor y convertidor de vídeo local','Guías para creadores','Política de privacidad','Términos de servicio','Teleprónter para YouTube','Teleprónter para presentaciones','Teleprónter con cámara','Teleprónter para YouTube Shorts','Teleprónter para TikTok','Teleprónter para Instagram Reels','Teleprónter para pódcasts','Teleprónter para entrevistas','Teleprónter para vídeos de ventas'),
        'pt': ('Criador de modelos de roteiro','Limpador de transcrições','Assistente de publicação','Compressor e conversor de vídeo local','Guias para criadores','Política de privacidade','Termos de serviço','Teleprompter para YouTube','Teleprompter para apresentações','Teleprompter com câmera','Teleprompter para YouTube Shorts','Teleprompter para TikTok','Teleprompter para Instagram Reels','Teleprompter para podcasts','Teleprompter para entrevistas','Teleprompter para vídeos de vendas'),
        'fr': ('Créateur de modèles de script','Nettoyeur de transcription','Assistant de publication','Compresseur et convertisseur vidéo local','Guides pour créateurs','Politique de confidentialité','Conditions d’utilisation','Téléprompteur pour YouTube','Téléprompteur pour présentations','Téléprompteur avec caméra','Téléprompteur pour YouTube Shorts','Téléprompteur pour TikTok','Téléprompteur pour Instagram Reels','Téléprompteur pour podcasts','Téléprompteur pour entretiens','Téléprompteur pour vidéos de vente'),
        'de': ('Skriptvorlagen-Generator','Transkript-Bereiniger','Veröffentlichungsassistent','Lokaler Video-Kompressor und Konverter','Leitfäden für Creators','Datenschutzerklärung','Nutzungsbedingungen','Teleprompter für YouTube','Teleprompter für Präsentationen','Teleprompter mit Kamera','Teleprompter für YouTube Shorts','Teleprompter für TikTok','Teleprompter für Instagram Reels','Teleprompter für Podcasts','Teleprompter für Interviews','Teleprompter für Verkaufsvideos'),
        'ja': ('スクリプトテンプレート作成','文字起こしクリーナー','公開アシスタント','ローカル動画圧縮・変換','クリエイターガイド','プライバシーポリシー','利用規約','YouTube 用テレプロンプター','プレゼン用テレプロンプター','カメラ付きテレプロンプター','YouTube Shorts 用テレプロンプター','TikTok 用テレプロンプター','Instagram Reels 用テレプロンプター','ポッドキャスト用テレプロンプター','面接用テレプロンプター','営業動画用テレプロンプター'),
        'ko': ('스크립트 템플릿 만들기','스크립트 정리 도구','게시 도우미','로컬 동영상 압축 및 변환','크리에이터 가이드','개인정보 처리방침','서비스 약관','YouTube용 프롬프터','프레젠테이션용 프롬프터','카메라 프롬프터','YouTube Shorts용 프롬프터','TikTok용 프롬프터','Instagram Reels용 프롬프터','팟캐스트용 프롬프터','면접용 프롬프터','세일즈 영상용 프롬프터'),
        'ru': ('Конструктор шаблонов сценариев','Очистка расшифровки','Помощник публикации','Локальное сжатие и конвертация видео','Руководства для авторов','Политика конфиденциальности','Условия использования','Телесуфлёр для YouTube','Телесуфлёр для презентаций','Телесуфлёр с камерой','Телесуфлёр для YouTube Shorts','Телесуфлёр для TikTok','Телесуфлёр для Instagram Reels','Телесуфлёр для подкастов','Телесуфлёр для интервью','Телесуфлёр для продающих видео'),
        'ar': ('منشئ قوالب النصوص','منظف النصوص المفرغة','مساعد النشر','ضغط وتحويل الفيديو محلياً','أدلة المبدعين','سياسة الخصوصية','شروط الخدمة','تلقين YouTube','تلقين العروض التقديمية','تلقين مع كاميرا','تلقين YouTube Shorts','تلقين TikTok','تلقين Instagram Reels','تلقين البودكاست','تلقين المقابلات','تلقين فيديوهات المبيعات'),
        'hi': ('स्क्रिप्ट टेम्पलेट निर्माता','ट्रांसक्रिप्ट क्लीनर','पब्लिशिंग सहायक','स्थानीय वीडियो कंप्रेसर व कनवर्टर','क्रिएटर गाइड','गोपनीयता नीति','सेवा की शर्तें','YouTube टेलीप्रॉम्प्टर','प्रस्तुति टेलीप्रॉम्प्टर','कैमरा टेलीप्रॉम्प्टर','YouTube Shorts टेलीप्रॉम्प्टर','TikTok टेलीप्रॉम्प्टर','Instagram Reels टेलीप्रॉम्प्टर','पॉडकास्ट टेलीप्रॉम्प्टर','इंटरव्यू टेलीप्रॉम्प्टर','सेल्स वीडियो टेलीप्रॉम्प्टर'),
        'id': ('Pembuat templat naskah','Pembersih transkrip','Asisten publikasi','Kompresor dan konverter video lokal','Panduan kreator','Kebijakan privasi','Ketentuan layanan','Teleprompter untuk YouTube','Teleprompter untuk presentasi','Teleprompter dengan kamera','Teleprompter untuk YouTube Shorts','Teleprompter untuk TikTok','Teleprompter untuk Instagram Reels','Teleprompter untuk podcast','Teleprompter untuk wawancara','Teleprompter untuk video penjualan'),
        'vi': ('Trình tạo mẫu kịch bản','Trình làm sạch bản chép lời','Trợ lý xuất bản','Nén và chuyển đổi video cục bộ','Hướng dẫn cho nhà sáng tạo','Chính sách quyền riêng tư','Điều khoản dịch vụ','Teleprompter cho YouTube','Teleprompter cho thuyết trình','Teleprompter có camera','Teleprompter cho YouTube Shorts','Teleprompter cho TikTok','Teleprompter cho Instagram Reels','Teleprompter cho podcast','Teleprompter cho phỏng vấn','Teleprompter cho video bán hàng'),
        'th': ('เครื่องมือสร้างเทมเพลตสคริปต์','เครื่องมือทำความสะอาดข้อความถอดเสียง','ผู้ช่วยการเผยแพร่','บีบอัดและแปลงวิดีโอในเครื่อง','คู่มือสำหรับครีเอเตอร์','นโยบายความเป็นส่วนตัว','ข้อกำหนดการให้บริการ','เทเลพรอมป์เตอร์สำหรับ YouTube','เทเลพรอมป์เตอร์สำหรับการนำเสนอ','เทเลพรอมป์เตอร์พร้อมกล้อง','เทเลพรอมป์เตอร์สำหรับ YouTube Shorts','เทเลพรอมป์เตอร์สำหรับ TikTok','เทเลพรอมป์เตอร์สำหรับ Instagram Reels','เทเลพรอมป์เตอร์สำหรับพอดแคสต์','เทเลพรอมป์เตอร์สำหรับการสัมภาษณ์','เทเลพรอมป์เตอร์สำหรับวิดีโอขาย'),
        'zh-TW': ('口播腳本範本','逐字稿清理工具','發布清單與文案工具','本機影片壓縮與轉換','創作者指南','隱私權政策','服務條款','YouTube 提詞器','簡報提詞器','帶攝影機的提詞器','YouTube Shorts 提詞器','TikTok 提詞器','Instagram Reels 提詞器','Podcast 提詞器','面試提詞器','銷售影片提詞器'),
    }
    # A localized category prefix makes the title useful even when a brand or
    # platform name must intentionally remain in English.
    for locale, (prefix, description) in labels.items():
        catalog[locale] = {slug: [titles[locale][index], description] for index, slug in enumerate(PUBLIC_PAGE_SLUGS)}
    return catalog


def guide_page(slug, title, description, headline):
    url = f'{SITE}/{slug}/'
    related = ''.join(f'<li><a href="/{s}/">{html.escape(t[0])}</a></li>' for s, t in SCENE_GUIDES.items() if s != slug)
    return f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{html.escape(title)} | CuePrompt</title><meta name="description" content="{html.escape(description)}"><link rel="canonical" href="{url}"><meta property="og:title" content="{html.escape(title)} | CuePrompt"><meta property="og:description" content="{html.escape(description)}"><meta property="og:type" content="article"><meta property="og:url" content="{url}"><link rel="stylesheet" href="/style.css"><script type="application/ld+json">{{"@context":"https://schema.org","@type":"Article","headline":{json.dumps(headline)},"description":{json.dumps(description)},"mainEntityOfPage":{json.dumps(url)},"author":{{"@type":"Organization","name":"CuePrompt"}}}}</script></head><body><header class="header"><a class="brand" href="/">CuePrompt</a><a href="/#studio">Open studio ↗</a></header><main class="landing"><span class="eyebrow">CUEPROMPT CREATOR GUIDE</span><h1>{html.escape(headline)}</h1><p>{html.escape(description)}</p><a class="play-button" href="/script-templates/">Choose a script template →</a><h2>Write for the camera, not the page</h2><p>Start with one audience problem, one useful idea and one clear next step. Keep sentences short enough to say naturally, then use headings and pause markers to make the read easier.</p><h2>Rehearse in your own rhythm</h2><p>Keep the reading area close to your lens, adjust text size and speed, and use Smart Follow or steady scrolling. Your draft stays in this browser while you practice.</p><h2>Record and prepare the release</h2><p>Record a take, choose a platform export preset, then use the publishing assistant for copy, captions and a local release pack.</p><h2>More creator guides</h2><ul>{related}</ul><p><a href="/creator-guides/">Browse all guides</a> · <a href="/#studio">Open CuePrompt Studio</a></p></main><footer><a href="/">CuePrompt</a><span>© 2026 CuePrompt</span></footer></body></html>'''


def legal_page(slug, title, description, body):
    url = f'{SITE}/{slug}/'
    return f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{title} | CuePrompt</title><meta name="description" content="{description}"><link rel="canonical" href="{url}"><meta property="og:title" content="{title} | CuePrompt"><meta property="og:description" content="{description}"><meta property="og:type" content="website"><meta property="og:url" content="{url}"><link rel="stylesheet" href="/style.css"></head><body><header class="header"><a class="brand" href="/">CuePrompt</a><a href="/#studio">Open studio ↗</a></header><main class="legal-page"><h1>{title}</h1><p class="updated">Last updated: October 28, 2026</p>{body}</main><footer><a href="/">CuePrompt</a><span class="legal-links"><a href="/privacy/">Privacy</a><a href="/terms/">Terms</a><a href="mailto:support@cueprompt.io">Contact</a></span><span>© 2026 CuePrompt</span></footer></body></html>'''


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
    # SEO landing routes reuse the studio template, and their English pages are
    # also the source for the localized copies. The en catalog pass below copies
    # dist/<slug>/index.html back onto itself, so without re-baking here template
    # changes (logo, favicon, asset hashes) would never reach those routes.
    for slug in LANDING:
        write(os.path.join(DIST, slug, 'index.html'), bake(template, 'en', en, en))
    for slug, (title, description, headline) in SCENE_GUIDES.items():
        write(os.path.join(DIST, slug, 'index.html'), guide_page(slug, title, description, headline))
    privacy_body = '''<p>CuePrompt is designed to work in your browser without an account. This policy explains what stays on your device, what you choose to send to third parties, and how to contact us.</p><h2>Scripts, settings and recordings</h2><p>Your scripts, preferences and script library are stored in your browser. Camera recordings are created on your device and are not uploaded to a CuePrompt server. You can delete local data in your browser or export and delete your library from CuePrompt. Clearing browser data may remove locally stored scripts and settings.</p><h2>Smart Follow and microphone audio</h2><p>When you turn on Smart Follow, your browser sends microphone audio to its speech-recognition service to produce a transcript. Depending on your browser, this may be provided by Google, Microsoft or Apple. CuePrompt uses the recognition result to align the prompt locally; it does not receive your audio or transcript on its own server. Smart Follow needs a network connection to the browser service and may not be available in every browser or region.</p><h2>Camera and microphone permissions</h2><p>CuePrompt requests camera or microphone access only after you choose a feature that needs it. You can revoke those permissions in your browser or device settings. Your recording stays on your device unless you download, share or upload it yourself.</p><h2>Bring-your-own AI and transcription services</h2><p>If you choose to use the AI writer or configure a transcription service, the text, recording and API key required for that request are sent directly from your browser to the provider you select. CuePrompt does not supply, receive or store those API keys. Review the selected provider’s privacy terms and use a key with an appropriate spending limit.</p><h2>Website delivery and communications</h2><p>Like most websites, the hosting and email providers that deliver CuePrompt may process standard technical information needed to serve a request or deliver a message. If you email us, we use your message and contact details to respond and provide support.</p><h2>Your choices and contact</h2><p>Because CuePrompt does not provide accounts or cloud script storage, most data controls are in your browser. For privacy questions or support, contact <a href="mailto:support@cueprompt.io">support@cueprompt.io</a>.</p><h2>Changes</h2><p>We may update this policy as CuePrompt changes. The date above shows when it was last revised.</p>'''
    terms_body = '''<p>These terms govern your use of CuePrompt and its browser-based tools. By using CuePrompt, you agree to use it responsibly and in accordance with applicable law.</p><h2>The service</h2><p>CuePrompt provides browser-based prompting, script and creator tools. Features may change, be unavailable in some browsers or regions, or depend on services run by your browser, device or a provider you select.</p><h2>Your content and responsibilities</h2><p>You retain responsibility for your scripts, recordings, uploads and any material you process. Do not use CuePrompt to process content you do not have the right to use, or for unlawful, harmful or infringing activity. Keep your own backup of important material; clearing browser data can remove locally stored content.</p><h2>Third-party services</h2><p>Smart Follow relies on your browser’s speech-recognition service. Optional AI writing and transcription requests are sent directly to the provider you configure. Those services have their own terms, privacy practices, availability and charges; you are responsible for reviewing them and for any charges you incur.</p><h2>Availability and disclaimers</h2><p>CuePrompt is provided as available. We work to keep it useful and reliable, but do not guarantee uninterrupted operation, compatibility with every device or browser, or that a feature will meet a particular purpose. Test recording and export workflows before relying on them for an important event.</p><h2>Changes and contact</h2><p>We may modify or discontinue features or these terms. Continued use after an update means you accept the updated terms. For questions, contact <a href="mailto:support@cueprompt.io">support@cueprompt.io</a>.</p>'''
    write(os.path.join(DIST, 'privacy', 'index.html'), legal_page('privacy', 'Privacy Policy', 'How CuePrompt handles scripts, recordings, microphone audio and optional third-party AI services.', privacy_body))
    write(os.path.join(DIST, 'terms', 'index.html'), legal_page('terms', 'Terms of Service', 'Terms for using CuePrompt and its browser-based creator tools.', terms_body))
    guide_links = ''.join(f'<li><a href="/{slug}/">{html.escape(title)}</a> — {html.escape(description)}</li>' for slug, (title, description, _) in SCENE_GUIDES.items())
    write(os.path.join(DIST, 'creator-guides', 'index.html'), f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Creator Guides | CuePrompt</title><meta name="description" content="Practical teleprompter guides for short video, podcasts, interviews and sales videos."><link rel="canonical" href="{SITE}/creator-guides/"><link rel="stylesheet" href="/style.css"></head><body><header class="header"><a class="brand" href="/">CuePrompt</a><a href="/#studio">Open studio ↗</a></header><main class="landing"><span class="eyebrow">CUEPROMPT CREATOR GUIDES</span><h1>Speak naturally on every kind of camera.</h1><p>Practical starting points for creators who want to write, rehearse, record and publish with less friction.</p><ul>{guide_links}</ul><a class="play-button" href="/script-templates/">Start a script →</a></main><footer><a href="/">CuePrompt</a><span>© 2026 CuePrompt</span></footer></body></html>''')
    catalog_path = os.path.join(SRC, 'locales', 'page_catalog.json')
    with open(catalog_path, encoding='utf-8') as f:
        catalog = json.load(f)
    catalog = expand_page_catalog(catalog)
    expected = set(PUBLIC_PAGE_SLUGS)
    incomplete = [code for code, *_ in LANGS if code not in catalog or set(catalog[code]) != expected]
    if incomplete:
        sys.exit('page_catalog.json must contain title and description for every public page and locale: ' + ', '.join(incomplete))
    build_localized_page_copies(catalog)
    # Landing pages are included in PUBLIC_PAGE_SLUGS and already received
    # their complete language alternate set above. Do not append a legacy
    # English-only block here: duplicate hreflang annotations harm SEO.
    # sitemap with language alternates
    alt = ''.join(f'<xhtml:link rel="alternate" hreflang="{h}" href="{SITE}{p}"/>' for _, _, _, p, h in LANGS) + f'<xhtml:link rel="alternate" hreflang="x-default" href="{SITE}/"/>'
    urls = ''.join(f'<url><loc>{SITE}{p}</loc>{alt}</url>' for _, _, _, p, _ in LANGS)
    for slug in PUBLIC_PAGE_SLUGS:
        page_alt = hreflang_links(SITE, slug).replace('<link ', '<xhtml:link ').replace('>', '/>')
        urls += ''.join(f'<url><loc>{absolute_url(SITE, code, slug)}</loc>{page_alt}</url>' for code, *_ in LANGS)
    write(os.path.join(DIST, 'sitemap.xml'), '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">' + urls + '</urlset>\n')
    write(os.path.join(DIST, 'robots.txt'), f'User-agent: *\nAllow: /\nSitemap: {SITE}/sitemap.xml\n')
    verify_generated_seo()
    # Completed public-page locale batches stay guarded while the remaining
    # languages are translated progressively.
    strict_locale_args = [item for code, *_ in LANGS if code != 'en' for item in ('--locale', code)]
    subprocess.run([sys.executable, os.path.join(ROOT, 'tools', 'audit_public_i18n.py'),
                    '--strict', *strict_locale_args, '--dist', DIST], check=True)
    # Opt-in until every public-copy batch is translated; CI/release builds
    # enable this to prevent a localized route from regressing to English.
    if os.environ.get('CUEPROMPT_STRICT_I18N') == '1':
        subprocess.run([sys.executable, os.path.join(ROOT, 'tools', 'audit_public_i18n.py'), '--strict', '--dist', DIST], check=True)
    print('\n'.join(report))


if __name__ == '__main__':
    main()
