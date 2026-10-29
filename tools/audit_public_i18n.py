#!/usr/bin/env python3
"""Detect untranslated visible copy in generated public pages.

Run after tools/build_pages.py.  The list intentionally contains product UI
sentences rather than broad ASCII matching: URLs, brand names, code and SEO
machine data are not visual-language failures.
"""
import argparse
from pathlib import Path

from site_i18n import LOCALES, PUBLIC_PAGE_SLUGS, page_path


VISIBLE_ENGLISH = (
    'Choose a speaking format', 'Script Template Builder', 'Transcript Cleaner',
    'Publishing Checklist', 'Local Video Compressor', 'INSTANT TEMPLATE',
    'No AI key', 'Choose a proven speaking structure', 'What are you making?',
    'Short video hook', 'Busy creators', 'The problem you solve',
    'Start with a proven script structure', 'Drafts stay in this browser',
    'Paste a YouTube transcript', 'Public webpage', 'editable draft',
    'Paste your transcript', 'Open email to send', 'Help shape CuePrompt',
    'Feedback type', 'What would you like to share?', 'Open studio ↗',
    'Write for the camera, not the page', 'Browse all guides',
    'Choose a script template',
)


def findings(dist, locales=None):
    for code, *_ in LOCALES:
        if code == 'en':
            continue
        if locales and code not in locales:
            continue
        for slug in PUBLIC_PAGE_SLUGS:
            page = dist / page_path(code, slug).strip('/') / 'index.html'
            content = page.read_text(encoding='utf-8')
            for phrase in VISIBLE_ENGLISH:
                if phrase in content:
                    yield code, slug, phrase


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--strict', action='store_true', help='exit nonzero when visible English is found')
    parser.add_argument('--dist', default='dist')
    parser.add_argument('--locale', action='append', choices=[code for code, *_ in LOCALES if code != 'en'],
                        help='audit only this locale (repeatable)')
    args = parser.parse_args()
    result = list(findings(Path(args.dist), set(args.locale or ())))
    for code, slug, phrase in result:
        print(f'{code}/{slug}: {phrase}')
    print(f'visible-English findings: {len(result)}')
    if args.strict and result:
        raise SystemExit(1)


if __name__ == '__main__':
    main()
