"""Korean visible copy for static creator tool pages.

SEO metadata is generated separately by build_pages.py. Replacements here are
limited to the HTML body so a label cannot accidentally rewrite JSON-LD.
"""

COMMON = {
    'Choose a speaking format, add your ideas, and build a script you can rehearse immediately.': '말하기 형식을 선택하고 아이디어를 더해 바로 연습할 수 있는 대본을 만드세요.',
    'Turn a public webpage, transcript, image, audio or video into an editable speaking script. Local-first with optional user-configured transcription and precise SRT captions.': '공개 웹페이지, 녹취록, 이미지, 음성 또는 영상을 편집 가능한 대본으로 바꾸세요. 기본 작업은 기기에서 처리하며, 선택한 전사 서비스로 정확한 SRT 자막을 만들 수 있습니다.',
    'Prepare a title, description and tags from your script, then export an editable publishing package.': '대본으로 제목, 설명, 태그를 만들고 편집 가능한 게시 자료를 내보내세요.',
    'Compress a recording, convert MP4 or WebM, and fit it to landscape or portrait. Your video stays on this device.': '녹화 영상을 압축하고 MP4 또는 WebM으로 변환하세요. 가로형과 세로형 화면에 맞출 수 있으며 영상은 이 기기에 남습니다.',
    'Drafts stay in this browser. Optional transcription sends your selected recording to your chosen service.': '초안은 이 브라우저에 남습니다. 전사 기능을 선택하면 선택한 녹음만 지정한 서비스로 전송됩니다.',
    'Review, then choose your next step.': '초안을 검토하고 다음 단계를 선택하세요.',
    'Your draft will appear here. You can edit it before using it.': '초안이 여기에 표시됩니다. 사용하기 전에 편집할 수 있습니다.',
    'Script Template Builder': '스크립트 템플릿 만들기',
    'Transcript Cleaner': '스크립트 정리 도구',
    'Publishing Checklist &amp; Copy Builder': '게시 체크리스트와 문구 만들기',
    'Local Video Compressor &amp; Converter': '로컬 동영상 압축 및 변환',
    'FROM IDEA TO CAMERA': '아이디어에서 카메라까지',
    'YOUR DRAFT': '내 초안', 'LOCAL': '기기 내 처리',
    'My next video': '다음 영상',
    'Start reading ': '읽기 시작 ', 'Edit in studio': 'Studio에서 편집',
    'Download TXT': 'TXT 다운로드', 'Back to CuePrompt': 'CuePrompt로 돌아가기',
    'Title': '제목', 'Draft': '초안', 'Copy': '복사',
}

TEMPLATES = {
    'No AI key. No upload. Just a strong first draft.': 'AI 키도 업로드도 필요 없습니다. 바로 쓸 수 있는 첫 초안을 만드세요.',
    'Choose a proven speaking structure, add your words, then edit the result before you read.': '검증된 말하기 구성을 선택하고 내용을 채운 뒤 읽기 전에 초안을 다듬으세요.',
    'Choose a YouTube intro, product pitch, lesson, meeting update, podcast opener, speech, livestream welcome or self-introduction. Add your topic, audience and key points, then edit the draft before you read it.': 'YouTube 도입부, 제품 소개, 강의, 팀 업데이트, 팟캐스트 오프닝, 연설, 라이브 환영 인사, 자기소개 중에서 고르세요. 주제와 청중, 핵심 내용을 입력한 뒤 읽기 전에 초안을 편집할 수 있습니다.',
    'The template builder runs in your browser. It does not need an AI key and does not upload your ideas. Send the finished draft to CuePrompt Studio when you are ready to rehearse.': '템플릿 도구는 브라우저에서 실행됩니다. AI 키가 필요 없으며 아이디어를 업로드하지 않습니다. 연습할 준비가 되면 완성된 초안을 CuePrompt Studio로 보내세요.',
    'This uses an on-device template, not an AI model. Your inputs stay in this browser.': '기기 내 템플릿을 사용하며 AI 모델에 요청하지 않습니다. 입력 내용은 이 브라우저에 남습니다.',
    'Your practical advice': '실용적인 조언', 'A concrete example': '구체적인 예시', 'The problem you solve': '해결할 문제',
    'Try this today and share what changed': '오늘 시도하고 달라진 점을 공유하세요',
    'A simpler way to plan your week': '한 주를 더 쉽게 계획하는 방법',
    'Start with a proven script structure': '검증된 대본 구성으로 시작하세요',
    'A private first draft, ready for the teleprompter': '프롬프터에서 바로 쓸 수 있는 비공개 초안',
    'Open strong and invite the next step.': '강하게 시작하고 다음 행동으로 이끄세요.',
    'Set the theme and guide chat.': '주제를 알리고 채팅의 흐름을 이끄세요.',
    'Problem, value and proof.': '문제, 가치, 근거를 전하세요.',
    'Teach one clear outcome.': '명확한 학습 목표 하나를 전하세요.',
    'Welcome listeners to the episode.': '청취자를 이번 에피소드로 맞이하세요.',
    'Tell your story with structure.': '구성에 따라 자신의 이야기를 전하세요.',
    'Build a memorable message.': '기억에 남을 메시지를 만드세요.',
    'Progress, blockers, next steps.': '진행 상황, 장애물, 다음 단계.',
    'INSTANT TEMPLATE': '바로 쓰는 템플릿', 'CHOOSE A STARTING POINT': '시작 유형 선택',
    'What are you making?': '무엇을 만들고 있나요?',
    'Short video hook': '짧은 영상 도입부', 'Livestream welcome': '라이브 방송 환영 인사',
    'Product introduction': '제품 소개', 'Lesson or course': '강의 또는 수업',
    'Podcast opener': '팟캐스트 오프닝', 'Interview introduction': '면접 자기소개',
    'Talk or presentation': '연설 또는 발표', 'Team update': '팀 업데이트',
    'Pick a format': '형식 선택', 'Add your key points': '핵심 내용 추가', 'Make it yours': '내 말로 다듬기',
    'YouTube introduction': 'YouTube 도입부', 'Product pitch': '제품 제안',
    'Online lesson': '온라인 강의', 'Podcast opening': '팟캐스트 오프닝',
    'Short speech': '짧은 연설', 'Self introduction': '자기소개',
    'Topic / product / your name': '주제 / 제품 / 이름', 'Who is this for?': '누구를 위한 내용인가요?',
    'Script language': '대본 언어', 'Key points ': '핵심 내용 ',
    'one thought per line': '한 줄에 하나씩', 'Closing action ': '마무리 행동 ',
    'Generate template draft ': '템플릿 초안 만들기 ', 'Busy creators': '바쁜 크리에이터',
    'Format': '형식', 'optional': '선택 사항',
}

EXTRACTOR = {
    'TXT, Markdown, SRT and VTT · up to 5 MB. Paste a YouTube transcript, import captions, or use the options below for public webpages, images, audio and video.': 'TXT, Markdown, SRT, VTT 파일을 최대 5 MB까지 가져올 수 있습니다. YouTube 녹취록을 붙여넣거나 자막을 불러오세요. 공개 웹페이지, 이미지, 음성, 영상은 아래 가져오기 기능을 이용하세요.',
    'Paste your transcript or subtitle contents here': '녹취록이나 자막 내용을 여기에 붙여넣으세요',
    'Paste a YouTube transcript, import TXT, Markdown, SRT or VTT subtitles, or read a public webpage that allows browser access. Remove timestamps and filler formatting, then shape the result into an editable script.': 'YouTube 녹취록을 붙여넣거나 TXT, Markdown, SRT, VTT 자막을 가져오세요. 브라우저 접근을 허용하는 공개 웹페이지도 읽을 수 있습니다. 시간 표시와 불필요한 형식을 지우고 편집 가능한 대본으로 정리하세요.',
    'Text cleanup and OCR happen in this browser. Audio and video transcription is optional: you choose the provider, file and API key, then receive precise SRT captions when that provider returns timestamps.': '텍스트 정리와 이미지 문자 인식은 이 브라우저에서 처리됩니다. 음성·영상 전사는 선택 사항입니다. 서비스와 파일, API 키를 직접 선택하며 서비스가 시간 정보를 제공하면 정확한 SRT 자막을 받을 수 있습니다.',
    'Turn a public webpage, transcript or recording into a speaking script': '웹페이지, 녹취록, 녹화 영상을 말하기 대본으로 바꾸세요',
    'Keep control of your source material': '원본 자료를 직접 관리하세요',
    'Import text or subtitles': '텍스트 또는 자막 가져오기', 'Clean transcript': '녹취록 정리',
    'Transcript': '녹취록',
}

PUBLISHING = {
    'Uses your own words; no AI request or upload. Review the copy before publishing. Timed subtitles require a transcript aligned to your recording.': '입력한 내용을 기기에서 정리합니다. AI 요청이나 업로드는 없습니다. 게시 전 문구를 검토하세요. 시간 자막에는 영상과 맞춘 녹취록이 필요합니다.',
    'Build an editable title, description, tags and publishing checklist from the words you already wrote. Use it as a review step before posting to YouTube, social video or a course platform.': '이미 작성한 대본으로 제목, 설명, 태그와 게시 체크리스트를 만드세요. YouTube나 소셜 영상, 강의 플랫폼에 올리기 전에 검토할 수 있습니다.',
    'This tool organizes your supplied script locally. It does not generate claims or publish on your behalf, so you remain in control of the final copy.': '이 도구는 입력한 대본을 기기에서 정리합니다. 새로운 주장을 만들거나 대신 게시하지 않으므로 최종 문구를 직접 관리할 수 있습니다.',
    'Turn a finished script into a publishing package': '완성된 대본으로 게시 자료 만들기',
    'Your voice stays yours': '내 표현을 그대로 유지하세요',
    'What viewers will learn': '시청자가 배울 내용', 'Paste your finished script': '완성된 대본을 붙여넣으세요',
    'Subscribe for the next lesson': '다음 강의를 구독하세요',
    'content creation, speaking, tutorial': '콘텐츠 제작, 말하기, 튜토리얼',
    'Keywords (comma separated)': '키워드(쉼표로 구분)', 'Call to action': '행동 유도 문구',
    'Build publishing copy': '게시 문구 만들기', 'Video title': '영상 제목', 'Script': '대본',
}

CONVERTER = {
    'Up to 150 MB. Keep this tab open while processing. The first use loads a 31 MB local processing engine. Large files may exceed your device memory.': '최대 150 MB. 처리 중에는 이 탭을 열어 두세요. 처음 사용할 때 약 31 MB의 로컬 처리 엔진을 불러옵니다. 큰 파일은 기기 메모리를 초과할 수 있습니다.',
    'Choose a preset to fill recommended local export settings. Check each platform’s current upload rules before publishing.': '플랫폼 설정을 선택하면 권장 내보내기 옵션이 채워집니다. 게시 전 각 플랫폼의 최신 업로드 규칙을 확인하세요.',
    'Convert a recorded MP4 or WebM video, reduce its size, and prepare a portrait or landscape export without uploading the recording to a server.': '녹화한 MP4 또는 WebM 영상을 서버에 올리지 않고 압축하고 세로형 또는 가로형으로 내보내세요.',
    'Choose MP4 or WebM, select a quality level, review the local export, then continue to the publishing assistant to prepare your release copy.': 'MP4 또는 WebM과 화질을 선택하고 기기에서 내보낸 영상을 확인한 뒤 게시 도우미에서 소개 문구를 준비하세요.',
    'Compress video in your browser': '브라우저에서 영상 압축', 'Export for the platform you are using': '게시할 플랫폼에 맞게 내보내기',
    'Review your export': '내보낸 영상 확인', 'Download converted video': '변환한 영상 다운로드',
    'Next: prepare publishing copy →': '다음: 게시 문구 준비 →',
    'Original aspect ratio': '원본 화면 비율', 'Portrait 9:16 · fit with padding': '세로 9:16 · 여백 추가',
    'Landscape 16:9 · fit with padding': '가로 16:9 · 여백 추가',
    'Custom export': '사용자 지정', 'Smaller file': '작은 파일', 'Balanced': '균형', 'Higher quality': '높은 화질',
    'Compress / convert locally': '기기에서 압축 / 변환', 'Platform preset': '플랫폼 설정',
    'Output format': '출력 형식', 'Canvas': '화면 비율', 'Quality': '화질',
    'Recording': '녹화 파일', 'Cancel': '취소',
}


def localize(body, slug):
    replacements = dict(COMMON)
    replacements.update({'script-templates': TEMPLATES, 'script-extractor': EXTRACTOR,
                         'publishing-assistant': PUBLISHING, 'video-converter': CONVERTER}.get(slug, {}))
    for source, target in sorted(replacements.items(), key=lambda item: len(item[0]), reverse=True):
        body = body.replace(source, target)
    return body
