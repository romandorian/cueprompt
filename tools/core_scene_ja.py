"""Japanese editorial copy for core scene workflows."""

COMMON = {
    'CAMERA WORKFLOW': 'カメラ収録のワークフロー',
    'The workflow this page is built for': 'このページが想定する利用シーン',
    'From script to finished delivery': '原稿から本番までの流れ',
    'Recommended CuePrompt settings': 'CuePromptのおすすめ設定',
    'A script structure that fits': 'この用途に合う原稿構成',
    'Common mistakes to avoid': 'よくある失敗と対策',
    'Questions before you start': '始める前によくある質問',
    'Open camera teleprompter': 'カメラ付きテレプロンプターを開く',
    'Compress a finished take': '収録した動画を圧縮する',
    'YOUTUBE WORKFLOW': 'YOUTUBE動画のワークフロー',
    'PRESENTATION WORKFLOW': 'プレゼンテーションのワークフロー',
    'Start a YouTube script': 'YouTube原稿を作る',
    'Use the YouTube 16:9 preset': 'YouTube 16:9プリセットを使う',
    'Prepare publishing copy': '公開用テキストを準備する',
    'Start a presentation script': 'プレゼン原稿を作る',
    'Rehearse in full screen': '全画面でリハーサルする',
}

CAMERA = (
    ('Reading from notes usually pulls your eyes away from the lens, while separate camera and prompting apps add setup and file-transfer work. CuePrompt keeps the script, camera preview and recording controls in one browser tab.', 'メモを見ながら話すと視線がレンズから外れやすく、カメラとテレプロンプターを別々のアプリで使うと設定やファイル移動の手間も増えます。CuePromptなら、原稿、カメラプレビュー、録画操作を1つのブラウザータブにまとめられます。'),
    ('Paste or write the script, then break long paragraphs into lines you can say in one breath.', '原稿を貼り付けるか入力し、長い段落を一息で自然に話せる長さに分けます。'),
    ('Open Camera & record, frame the shot and place the reading area close to the lens.', '「カメラと録画」を開いて構図を整え、読み上げ領域をレンズの近くに配置します。'),
    ('Run a short test, check sound and eye line, then record the full take and download it locally.', '短いテスト録画で音声と目線を確認してから本番を収録し、端末に保存します。'),
    ('Mirror the preview when it helps you frame naturally.', '自然に構図を決めやすい場合は、プレビューを左右反転します。'),
    ('Start with larger text and a comfortable steady speed; switch to Smart Follow when supported.', '最初は大きめの文字と無理のない一定速度を使い、対応環境ではSmart Followに切り替えます。'),
    ('Use [pause] before important points and [slow] where the delivery should settle.', '重要なポイントの前には [pause]、落ち着いて伝えたい箇所には [slow] を入れます。'),
    ('Hook → one clear idea → supporting example → next action.', '興味を引く導入 → 明確な主張 → 補足する例 → 次の行動。'),
    ('“If your eyes keep dropping to notes, put the words beside the lens. [pause] Keep each thought short, speak it naturally, then look back at the viewer.”', '「メモを見るたびに視線が下がるなら、言葉をレンズのそばに置きましょう。[pause] 要点を短く区切り、自然に話してから視線を視聴者に戻します。」'),
    ('Recording the first take without checking microphone input.', 'マイク入力を確認せずに最初のテイクを録画する。'),
    ('Putting the prompt far from the lens and creating obvious side-to-side eye movement.', '原稿をレンズから離れた場所に置き、目線が大きく左右に動いてしまう。'),
    ('Using dense paragraphs that are hard to scan while speaking.', '文章を詰め込みすぎて、話しながら素早く追えなくなる。'),
    ('Is the recording uploaded?', '録画データはアップロードされますか？'),
    ('No. Camera recording is created in your browser and remains on your device unless you choose to share or upload the downloaded file.', 'いいえ。録画はブラウザー内で作成され、ダウンロードしたファイルを自分で共有またはアップロードしない限り端末に残ります。'),
    ('Why does the camera need HTTPS?', 'カメラにHTTPSが必要なのはなぜですか？'),
    ('Browsers require a secure page before granting camera and microphone access.', 'ブラウザーがカメラとマイクへのアクセスを許可するには、安全なページが必要です。'),
    ('Should I mirror the final video?', '完成動画も左右反転したほうがよいですか？'),
    ('Mirror is mainly a preview preference. Review the downloaded take before publishing, especially when signs or text appear in frame.', '左右反転は主にプレビューの好みです。看板や文字が映る場合は、公開前にダウンロードした動画を確認してください。'),
)

YOUTUBE = (
    ('Long-form YouTube videos need more than continuous scrolling: the opening must establish a promise, sections must stay easy to navigate, and the speaker still needs natural eye contact. CuePrompt connects a structured script, rehearsal, recording and publishing handoff.', 'YouTubeの長尺動画では、単に原稿を流すだけでは不十分です。冒頭で視聴者が得られることを示し、内容を分かりやすいセクションに分け、自然な目線も保つ必要があります。CuePromptは、構成した原稿からリハーサル、収録、公開準備までをつなげます。'),
    ('Start with the YouTube template and define the viewer, promise and three main sections.', 'YouTubeテンプレートを選び、想定視聴者、動画で約束する成果、3つの主要セクションを決めます。'),
    ('Use ## headings to separate chapters, then rehearse each section with Smart Follow or steady scrolling.', '## 見出しでチャプターを分け、Smart Followまたは一定速度のスクロールでセクションごとに練習します。'),
    ('Record in landscape, review the take, and prepare the title, description, tags and captions before upload.', '横向きで収録し、テイクを確認してから、アップロード前にタイトル、説明、タグ、字幕を準備します。'),
    ('Choose a landscape 16:9 export for a standard YouTube video.', '通常のYouTube動画には横向き16:9の書き出しを選びます。'),
    ('Keep the prompt close to the lens and use a readable size that avoids rapid eye movement.', '原稿をレンズの近くに置き、目線を頻繁に動かさず読める文字サイズにします。'),
    ('Add [pause] between chapters so edits and chapter transitions have clean space.', 'チャプター間に [pause] を入れ、編集や場面転換に使える間を作ります。'),
    ('Hook and viewer promise → context → three useful chapters → recap → subscribe or next-video action.', '興味を引く導入と視聴者への約束 → 背景 → 役立つ3つのチャプター → まとめ → チャンネル登録または次の動画への案内。'),
    ('“By the end of this video, you will have a three-step workflow you can use today. [pause] First, let’s remove the part that wastes the most time.”', '「この動画を見終える頃には、今日から使える3段階の手順が分かります。[pause] まず、最も時間を無駄にしている部分をなくしましょう。」'),
    ('Opening with a long introduction before explaining the viewer benefit.', '視聴者のメリットを伝える前に長い自己紹介を入れる。'),
    ('Writing one uninterrupted block instead of visible chapters.', '見やすいチャプターに分けず、原稿を一続きの文章にする。'),
    ('Reading every sentence at the same pace and losing conversational emphasis.', 'すべての文を同じ速さで読み、会話らしい強弱を失う。'),
    ('Can I create chapter-ready scripts?', 'チャプター分けしやすい原稿を作れますか？'),
    ('Yes. Use ## headings for the major sections, then carry those section names into your YouTube chapter plan.', 'はい。主要セクションに ## 見出しを付け、その見出しをYouTubeのチャプター名にも利用できます。'),
    ('What format should I export?', 'どの形式で書き出せばよいですか？'),
    ('For a standard horizontal video, the local converter provides a YouTube 16:9 MP4 preset.', '通常の横向き動画には、ローカル変換ツールのYouTube 16:9 MP4プリセットを利用できます。'),
    ('How do I sound less scripted?', '原稿を読んでいる感じを減らすには？'),
    ('Write short spoken sentences, rehearse once, and treat the prompt as a guide rather than forcing every word into one take.', '話し言葉の短い文を書き、一度リハーサルを行い、一字一句を無理に再現するのではなく原稿をガイドとして使いましょう。'),
)

PRESENTATIONS = (
    ('A presentation can lose momentum when the speaker memorizes every line or keeps looking down at notes. A teleprompter works best as a speaking outline: clear transitions, intentional pauses and a readable full-screen view.', '一言一句を暗記したり、何度も手元のメモに目を落としたりすると、プレゼンの流れが途切れます。テレプロンプターは、分かりやすい話題転換、意図的な間、読みやすい全画面表示を備えた話すためのアウトラインとして使うと効果的です。'),
    ('Choose the speech template and turn each slide or idea into one short speaking section.', 'スピーチテンプレートを選び、各スライドやアイデアを短い話し言葉のセクションにします。'),
    ('Mark transitions with ## headings and add [pause] after key claims, questions or slide changes.', '## 見出しで話題転換を示し、重要な主張、問いかけ、スライド切り替えの後に [pause] を入れます。'),
    ('Rehearse in full screen, adjust text size for the viewing distance and time the complete talk.', '全画面でリハーサルし、画面までの距離に合わせて文字サイズを調整して、全体の所要時間を計ります。'),
    ('Use full-screen reading and increase text size when the display is farther away.', '全画面表示を使い、画面が離れている場合は文字を大きくします。'),
    ('Choose steady scrolling for a fixed rehearsal pace or Smart Follow when you need flexible pauses.', '一定のテンポで練習するなら定速スクロール、柔軟に間を取りたいならSmart Followを選びます。'),
    ('Keep controls accessible and test the same browser, display and connection used at the event.', '操作ボタンにすぐ手が届く状態にし、本番で使うブラウザー、画面、接続方法で事前にテストします。'),
    ('Opening idea → audience relevance → three supporting points → memorable recap → clear closing.', '冒頭のアイデア → 聴衆との関係 → 3つの根拠 → 記憶に残るまとめ → 明確な結び。'),
    ('“Here is the question I want us to keep in mind today. [pause] What would change if this process took minutes instead of hours?”', '「今日、皆さんに覚えておいてほしい問いがあります。[pause] この作業が何時間もかからず、数分で終わるとしたら何が変わるでしょうか。」'),
    ('Copying slide text word for word instead of writing natural transitions.', '自然なつなぎの言葉を書かず、スライドの文章をそのままコピーする。'),
    ('Using text that is too small for the distance between speaker and display.', '話し手と画面の距離に対して文字が小さすぎる。'),
    ('Skipping a full rehearsal with the actual presentation setup.', '本番と同じプレゼン環境で通し練習をしない。'),
    ('Can I use CuePrompt for a speech without slides?', 'スライドを使わないスピーチにも利用できますか？'),
    ('Yes. Organize the talk with headings, pauses and a strong closing, then read in full screen.', 'はい。見出し、間、力強い結びで話を構成し、全画面で読み上げられます。'),
    ('How should I rehearse slide changes?', 'スライド切り替えはどう練習すればよいですか？'),
    ('Add a heading or [pause] marker at every transition and practice advancing the slide during that space.', '各切り替え位置に見出しまたは [pause] を入れ、その間にスライドを送る練習をします。'),
    ('Does it work on a tablet?', 'タブレットでも使えますか？'),
    ('CuePrompt works in modern mobile, tablet and desktop browsers. Test full screen and controls on the exact device before the event.', 'CuePromptは現在のスマートフォン、タブレット、デスクトップブラウザーで動作します。本番前に、実際に使う端末で全画面表示と操作を確認してください。'),
)


def localize(page, locale, slug):
    packs = {'teleprompter-with-camera': CAMERA, 'teleprompter-for-youtube': YOUTUBE, 'teleprompter-for-presentations': PRESENTATIONS}
    if locale != 'ja' or slug not in packs:
        return page
    for source, target in sorted((*COMMON.items(), *packs[slug]), key=lambda item: len(item[0]), reverse=True):
        page = page.replace(source, target)
    return page
