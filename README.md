# CuePrompt

Free browser teleprompter studio: voice-following scroll (Smart Follow), steady scroll, a script library, Word/PDF import, camera recording with review, and an optional bring-your-own-key AI writer. The UI comes in 15 languages.

The site is plain static HTML/CSS/JS with no backend, no account and no CDN at runtime. Every dependency is vendored under `dist/vendor/`, so it also loads in mainland China.

## Run locally

```sh
python3 -m http.server 5173 --directory dist
```

Open http://localhost:5173. Camera, microphone and speech recognition need `localhost` or HTTPS.

## Features

- **Creator tools:** `/script-templates/` builds eight scene-specific speaking formats in English or Simplified Chinese. `/script-extractor/` cleans TXT/MD/SRT/VTT, performs local English/Simplified Chinese image OCR, and supports optional multipart API transcription using a user-supplied endpoint, model and tab-only key. The transcription service must support browser CORS and verbose JSON responses. Only this explicitly selected remote operation uploads the recording; it may incur provider charges. URL extraction is not implemented.
- **Workflow:** extracted drafts can open the existing AI writer in rewrite mode; no AI request is made automatically. The recording review offers a local IndexedDB handoff to `/video-converter/`. The studio also passes its script into `/publishing-assistant/`, which exports publishing copy, timestamped transcription SRT, or clearly labelled estimated SRT drafts. Estimated subtitles must be aligned before publishing. Transcription captions are labelled with their source recording.
- **Local video processing:** vendored single-thread ffmpeg.wasm, MP4/H.264 or WebM/VP8, original/portrait/landscape fit-with-padding presets, selectable quality, progress, cancellation, size comparison and playback before download. 150 MB input soft limit; output may be larger, and memory/performance depend on the device. Latest studio recording is held locally in IndexedDB, separate from the script library. No cloud sync or accounts have been added.
- **Install/offline:** web manifest and service worker cache the studio shell and visited language bundles. Offline reading requires a successful initial online visit. AI and service transcription require a network connection; OCR/video tools are not promised offline. Updates are network-first. Generated tool pages are maintained by `tools/build_creator_tools.py`, called by the main build. Vendored dependencies and source links are documented in `dist/vendor/creator/NOTICE.md`.

- **Smart Follow (voice follow).** Uses the browser Web Speech API (`SpeechRecognition` / `webkitSpeechRecognition`, continuous plus interim results), with 29 speech languages.
  - `align.js` fuzzy-aligns what you said to the script with a local (Smith-Waterman) alignment over a sliding window. Chinese, Japanese and Thai are matched per character; other languages per word, with accent folding and typo tolerance.
  - It tolerates skipped sentences and ad-libs, and ignores unrelated speech.
  - Scrolling eases the last spoken word to the reading guide. It holds still when you're silent, and an indicator shows listening vs. waiting.
  - Switch between **Steady** and **Smart Follow** in the toolbar, or press `M`.
  - Fallbacks:
    - Unsupported browser (Firefox): shows a message and keeps Steady mode.
    - Speech service unreachable (`network` error): switches to Steady and explains why.
    - Microphone denied or language unsupported: shows a message.
- **Markers.**
  - `## Title` makes a section heading and a bookmark in the **Sections** jump list.
  - `[pause]` holds Steady scrolling for 2 s.
  - `[slow]` scrolls that paragraph at 0.55×.
  - The current line is highlighted while playing.
- **Script library** (localStorage `cueprompt-library`): create, rename, duplicate, delete, search and autosave. Export/Import the whole library as a JSON backup; import merges by id, and the newer copy wins.
- **Import:**
  - `.txt` and `.md` (Markdown is flattened and `#` headings become `##` sections).
  - `.docx` via vendored mammoth (headings are kept).
  - `.pdf` via vendored pdf.js 3.11 (text layer only; scanned PDFs need OCR first). CJK radical code points are normalized.
  - Each import becomes a new script.
  - Import from URL is intentionally not offered: browsers block cross-site reads (CORS) without a proxy.
- **Recording:**
  - Choice of camera and microphone, 720p/1080p, and MP4 where the browser supports it (otherwise WebM).
  - Optional 3-2-1 countdown, which you can cancel by pressing Record again.
  - Mirrored selfie preview at full opacity.
  - After recording you get a review dialog with Download, Retake and Discard; Discard asks first if the take wasn't downloaded.
- **AI writer (bring your own key).** Generate a script from topic + duration + tone + language, rewrite it (shorter / conversational / clearer / custom), or translate it.
  - Works with any OpenAI-compatible `/chat/completions` endpoint. The default is Alibaba Qwen via DashScope compatible mode:
    - mainland endpoint `https://dashscope.aliyuncs.com/compatible-mode/v1`
    - international preset `https://dashscope-intl.aliyuncs.com/compatible-mode/v1`
    - model `qwen-plus` (editable: `qwen-turbo`, `qwen-max`, …)
  - The key is stored only in the user's localStorage (`cueprompt-ai`). No key is shipped.
  - DashScope answers browser CORS preflights, checked 2026-10-22, so no proxy is needed. Other providers may block browser calls; they would need a small proxy.
- **Internationalization.** 15 UI languages: en, zh-CN, zh-TW, es, pt, fr, de, ja, ko, ru, ar (RTL), hi, id, vi, th.
  - The language is auto-detected from `navigator.language`, can be switched in the header, and the choice persists. `<html lang/dir>` is updated.
  - User text uses `dir="auto"`.
  - Every language has its own pre-rendered page (`/zh/`, `/ar/`, …) with translated title/description, canonical, hreflang (+ x-default) and sitemap alternates.
- Fullscreen with on-screen controls, mirror and vertical mirror, colors, width, line spacing, keyboard shortcuts.

## Privacy (what leaves the device)

- Scripts, settings and recordings stay in the browser. There is no CuePrompt server.
- **Smart Follow** sends microphone audio to the *browser vendor's* speech service (Google for Chrome, Microsoft for Edge, Apple for Safari). Chrome's service is generally not reachable from mainland China without a VPN; CuePrompt then falls back to Steady mode.
- **AI writer** sends the chosen text straight from the browser to the provider the user configures.

## Project layout and build

```
src/index.html        English template for every app page (edit this, not dist/*/index.html)
src/locales/*.json    UI strings, 249 keys per language (en.json is the reference)
tools/build_pages.py  bakes translations into dist/index.html and dist/<lang>/index.html,
                      writes dist/i18n.js + dist/i18n/<lang>.js and sitemap.xml, adds hreflang
dist/                 the deployable static site
```

After changing `src/` or any locale, run:

```sh
python3 tools/build_pages.py               # fails on keys missing from en.json; prints per-language gaps
CUEPROMPT_SITE=https://your.domain python3 tools/build_pages.py   # for a custom domain
```

## Deploy

- Upload **only `dist/`** as the site root (ChatGPT Sites or any static host). `src/` and `tools/` are not deployed.
- Pages use root-relative paths (`/app.js`, `/vendor/...`), so serve from the domain root.
- When moving to a custom domain, rebuild with `CUEPROMPT_SITE`. The build updates canonical, og:url, JSON-LD, hreflang and the sitemap.
- Also update the URLs in the 3 English landing pages and `robots.txt`, then submit the sitemap in Google Search Console (and Baidu/Bing webmaster tools if you want them).
- The hosted preview must be public to be indexed.

## Tests

The tests live outside the deployable tree, in `cueprompt-review/` next to this project:

- `align.test.js`: node unit tests for the aligner (en/zh/es/ja, skips, ad-libs).
- `tests/t1_*`, `t2_*`, `t3_*`: headless-Chrome Playwright suites at 1440 and 390 px. They use a mocked SpeechRecognition, fake camera/mic devices and a local mock OpenAI-compatible server.

## Third-party

- mammoth.js 1.13.0 (BSD-2-Clause): `dist/vendor/mammoth.browser.min.js`
- pdf.js 3.11.174 (Apache-2.0): `dist/vendor/pdf.min.js`, `pdf.worker.min.js`

The license texts are next to them in `dist/vendor/`.
