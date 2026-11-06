"""Localized editorial copy for the three core scene workflows."""

COMMON = {
    'zh-CN': {
        'CAMERA WORKFLOW': '摄像头录制工作流',
        'YOUTUBE WORKFLOW': 'YOUTUBE 视频工作流',
        'PRESENTATION WORKFLOW': '演讲与简报工作流',
        'The workflow this page is built for': '这个页面解决什么问题',
        'From script to finished delivery': '从脚本到完成表达',
        'Recommended CuePrompt settings': '推荐的 CuePrompt 设置',
        'A script structure that fits': '适合这个场景的脚本结构',
        'Common mistakes to avoid': '需要避免的常见错误',
        'Questions before you start': '开始前的常见问题',
        'Open camera teleprompter': '打开摄像头提词器',
        'Compress a finished take': '压缩录制视频',
        'Start a YouTube script': '创建 YouTube 脚本',
        'Use the YouTube 16:9 preset': '使用 YouTube 16:9 预设',
        'Prepare publishing copy': '准备发布文案',
        'Start a presentation script': '创建演讲脚本',
        'Rehearse in full screen': '进入全屏排练',
    }
}

ZH_CN = {
    'teleprompter-with-camera': (
        ('Reading from notes usually pulls your eyes away from the lens, while separate camera and prompting apps add setup and file-transfer work. CuePrompt keeps the script, camera preview and recording controls in one browser tab.', '照着笔记读通常会让视线离开镜头，而分别使用摄像和提词应用又会增加设置与文件传输步骤。CuePrompt 把脚本、摄像头预览和录制控制集中在同一个浏览器标签页中。'),
        ('Paste or write the script, then break long paragraphs into lines you can say in one breath.', '粘贴或编写脚本，再把长段落拆成一口气可以自然说完的短句。'),
        ('Open Camera & record, frame the shot and place the reading area close to the lens.', '打开“摄像头与录制”，调整画面构图，并把阅读区域放在靠近镜头的位置。'),
        ('Run a short test, check sound and eye line, then record the full take and download it locally.', '先进行短暂试录，检查声音和视线，再录制完整版本并保存到本地。'),
        ('Mirror the preview when it helps you frame naturally.', '如果镜像预览更方便构图，可以打开镜像。'),
        ('Start with larger text and a comfortable steady speed; switch to Smart Follow when supported.', '先使用较大的文字和舒适的匀速滚动；浏览器支持时可切换到智能跟随。'),
        ('Use [pause] before important points and [slow] where the delivery should settle.', '在重要观点前加入 [pause]，需要放慢表达时加入 [slow]。'),
        ('Hook → one clear idea → supporting example → next action.', '吸引注意 → 一个明确观点 → 支撑示例 → 下一步行动。'),
        ('“If your eyes keep dropping to notes, put the words beside the lens. [pause] Keep each thought short, speak it naturally, then look back at the viewer.”', '“如果你的视线总是落到笔记上，就把文字放到镜头旁边。[pause] 每个观点保持简短，自然地说出来，再把目光回到观众身上。”'),
        ('Recording the first take without checking microphone input.', '没有检查麦克风输入就直接录制第一遍。'),
        ('Putting the prompt far from the lens and creating obvious side-to-side eye movement.', '提词区域离镜头太远，造成明显的左右眼神移动。'),
        ('Using dense paragraphs that are hard to scan while speaking.', '使用过于密集的长段落，讲话时难以快速扫读。'),
        ('Is the recording uploaded?', '录制内容会上传吗？'),
        ('No. Camera recording is created in your browser and remains on your device unless you choose to share or upload the downloaded file.', '不会。摄像头录制在浏览器中完成，并保留在你的设备上；只有你主动分享或上传下载的文件时，内容才会离开设备。'),
        ('Why does the camera need HTTPS?', '为什么摄像头需要 HTTPS？'),
        ('Browsers require a secure page before granting camera and microphone access.', '浏览器只有在安全页面中才会授予摄像头和麦克风权限。'),
        ('Should I mirror the final video?', '最终视频需要镜像吗？'),
        ('Mirror is mainly a preview preference. Review the downloaded take before publishing, especially when signs or text appear in frame.', '镜像主要是预览偏好。发布前请检查下载的视频，尤其是画面中出现标志或文字时。'),
    ),
    'teleprompter-for-youtube': (
        ('Long-form YouTube videos need more than continuous scrolling: the opening must establish a promise, sections must stay easy to navigate, and the speaker still needs natural eye contact. CuePrompt connects a structured script, rehearsal, recording and publishing handoff.', 'YouTube 长视频不仅需要连续滚动：开头要明确观众能获得什么，章节要便于理解和导航，表达者还要保持自然视线。CuePrompt 把结构化脚本、排练、录制和发布准备连接成一个工作流。'),
        ('Start with the YouTube template and define the viewer, promise and three main sections.', '从 YouTube 模板开始，明确目标观众、视频承诺和三个主要章节。'),
        ('Use ## headings to separate chapters, then rehearse each section with Smart Follow or steady scrolling.', '使用 ## 标题分隔章节，再通过智能跟随或匀速滚动逐段排练。'),
        ('Record in landscape, review the take, and prepare the title, description, tags and captions before upload.', '使用横屏录制，检查成片，并在上传前准备标题、描述、标签和字幕。'),
        ('Choose a landscape 16:9 export for a standard YouTube video.', '标准 YouTube 视频请选择横屏 16:9 导出。'),
        ('Keep the prompt close to the lens and use a readable size that avoids rapid eye movement.', '让提词区域靠近镜头，并使用无需频繁移动视线的合适字号。'),
        ('Add [pause] between chapters so edits and chapter transitions have clean space.', '在章节之间加入 [pause]，为剪辑和章节转换留出清晰空间。'),
        ('Hook and viewer promise → context → three useful chapters → recap → subscribe or next-video action.', '开场吸引与观众承诺 → 背景 → 三个实用章节 → 总结 → 订阅或观看下一条视频。'),
        ('“By the end of this video, you will have a three-step workflow you can use today. [pause] First, let’s remove the part that wastes the most time.”', '“看完这期视频，你将获得一套今天就能使用的三步工作流。[pause] 首先，我们先去掉最浪费时间的环节。”'),
        ('Opening with a long introduction before explaining the viewer benefit.', '在说明观众收益之前使用过长的自我介绍。'),
        ('Writing one uninterrupted block instead of visible chapters.', '把内容写成连续大段，而没有清晰可见的章节。'),
        ('Reading every sentence at the same pace and losing conversational emphasis.', '所有句子都使用相同速度，失去自然对话中的轻重变化。'),
        ('Can I create chapter-ready scripts?', '可以创建适合章节划分的脚本吗？'),
        ('Yes. Use ## headings for the major sections, then carry those section names into your YouTube chapter plan.', '可以。使用 ## 标题标记主要部分，再把这些标题用于 YouTube 章节规划。'),
        ('What format should I export?', '应该导出什么格式？'),
        ('For a standard horizontal video, the local converter provides a YouTube 16:9 MP4 preset.', '对于标准横屏视频，本地转换工具提供 YouTube 16:9 MP4 预设。'),
        ('How do I sound less scripted?', '怎样让表达听起来不那么像照稿读？'),
        ('Write short spoken sentences, rehearse once, and treat the prompt as a guide rather than forcing every word into one take.', '使用简短的口语句子，先排练一遍，并把提词内容当作提示，而不是强迫自己一字不差地完成整段录制。'),
    ),
    'teleprompter-for-presentations': (
        ('A presentation can lose momentum when the speaker memorizes every line or keeps looking down at notes. A teleprompter works best as a speaking outline: clear transitions, intentional pauses and a readable full-screen view.', '当演讲者逐字背诵或不断低头看笔记时，演示很容易失去节奏。提词器最适合作为口头表达提纲：清晰的转场、有意识的停顿，以及易读的全屏视图。'),
        ('Choose the speech template and turn each slide or idea into one short speaking section.', '选择演讲模板，把每张幻灯片或每个观点整理成一个简短的口述段落。'),
        ('Mark transitions with ## headings and add [pause] after key claims, questions or slide changes.', '使用 ## 标题标记转场，并在关键结论、问题或换页后加入 [pause]。'),
        ('Rehearse in full screen, adjust text size for the viewing distance and time the complete talk.', '使用全屏模式排练，根据观看距离调整字号，并记录完整演讲所需时间。'),
        ('Use full-screen reading and increase text size when the display is farther away.', '使用全屏阅读；显示设备距离较远时增大字号。'),
        ('Choose steady scrolling for a fixed rehearsal pace or Smart Follow when you need flexible pauses.', '固定节奏排练时使用匀速滚动；需要灵活停顿时使用智能跟随。'),
        ('Keep controls accessible and test the same browser, display and connection used at the event.', '确保控制按钮方便操作，并使用活动现场相同的浏览器、显示设备和连接方式进行测试。'),
        ('Opening idea → audience relevance → three supporting points → memorable recap → clear closing.', '开场观点 → 与观众的关系 → 三个支撑要点 → 容易记住的总结 → 明确结尾。'),
        ('“Here is the question I want us to keep in mind today. [pause] What would change if this process took minutes instead of hours?”', '“今天我希望大家始终记住这个问题。[pause] 如果这个过程只需要几分钟而不是几小时，会发生什么变化？”'),
        ('Copying slide text word for word instead of writing natural transitions.', '逐字复制幻灯片文字，而没有编写自然的转场。'),
        ('Using text that is too small for the distance between speaker and display.', '文字太小，不适合演讲者与显示设备之间的距离。'),
        ('Skipping a full rehearsal with the actual presentation setup.', '没有使用真实演示设备进行完整排练。'),
        ('Can I use CuePrompt for a speech without slides?', '没有幻灯片的演讲也能使用 CuePrompt 吗？'),
        ('Yes. Organize the talk with headings, pauses and a strong closing, then read in full screen.', '可以。使用标题、停顿和有力的结尾组织演讲，然后使用全屏模式阅读。'),
        ('How should I rehearse slide changes?', '应该怎样排练幻灯片切换？'),
        ('Add a heading or [pause] marker at every transition and practice advancing the slide during that space.', '在每次转场处加入标题或 [pause] 标记，并练习在这段停顿时间内切换幻灯片。'),
        ('Does it work on a tablet?', '可以在平板电脑上使用吗？'),
        ('CuePrompt works in modern mobile, tablet and desktop browsers. Test full screen and controls on the exact device before the event.', 'CuePrompt 支持现代手机、平板和桌面浏览器。活动前请在实际使用的设备上测试全屏模式和控制操作。'),
    ),
}


def _to_zh_tw(text):
    phrases = {
        '这个页面解决什么问题': '此頁面適合什麼使用情境',
        '从脚本到完成表达': '從講稿到完成呈現',
        '推荐的 CuePrompt 设置': '建議的 CuePrompt 設定',
        '适合这个场景的脚本结构': '適合此情境的講稿結構',
        '需要避免的常见错误': '常見錯誤與避免方式',
        '开始前的常见问题': '開始前的常見問題',
        '打开摄像头提词器': '開啟攝影機提詞器',
        '压缩录制视频': '壓縮錄製完成的影片',
        '创建 YouTube 脚本': '建立 YouTube 講稿',
        '使用 YouTube 16:9 预设': '使用 YouTube 16:9 預設',
        '准备发布文案': '準備發布文案',
        '创建演讲脚本': '建立簡報講稿',
        '进入全屏排练': '進入全螢幕排練',
        '文件传输': '檔案傳輸', '文件': '檔案', '设置': '設定',
        '检查成片': '檢查完成的影片', '保存到本地': '儲存在本機',
        '本地转换工具': '本機轉換工具', '本地': '本機',
        '一口气': '一口氣', '视频承诺': '影片帶給觀眾的收穫',
        '标准 YouTube 视频': '標準 YouTube 影片', '横屏录制': '橫向錄製',
        '观看下一条视频': '觀看下一支影片', '这期视频': '這支影片',
        '幻灯片切换': '投影片切換', '幻灯片文字': '投影片文字',
        '显示设备': '顯示器', '活动现场': '活動現場',
        '摄像头': '攝影機', '视频': '影片', '浏览器': '瀏覽器', '标签页': '分頁',
        '智能跟随': '智慧跟隨', '全屏': '全螢幕', '幻灯片': '投影片',
        '平板电脑': '平板電腦', '麦克风': '麥克風', '横屏': '橫向',
        '提词器': '提詞器', '脚本': '講稿', '章节': '章節', '字幕': '字幕',
        '发布': '發布', '上传': '上傳', '下载': '下載', '链接': '連結',
        '工作流': '工作流程', '转换工具': '轉換工具', '预设': '預設',
        '字号': '字級', '导出': '匯出', '画面构图': '畫面構圖',
        '匀速滚动': '等速捲動', '滚动': '捲動', '阅读区域': '閱讀區域',
    }
    for source, target in sorted(phrases.items(), key=lambda item: len(item[0]), reverse=True):
        text = text.replace(source, target)
    text = text.translate(str.maketrans({
        '这':'這','个':'個','为':'為','与':'與','开':'開','关':'關','录':'錄','制':'製','内':'內','容':'容',
        '会':'會','离':'離','应':'應','用':'用','增':'增','设':'設','置':'置','传':'傳','输':'輸','骤':'驟',
        '把':'把','头':'頭','览':'覽','预':'預','签':'籤','页':'頁','进':'進','行':'行','查':'查','声':'聲',
        '线':'線','再':'再','并':'並','载':'載','镜':'鏡','帮':'幫','时':'時','较':'較','滚':'滾','动':'動',
        '浏':'瀏','换':'換','随':'隨','览':'覽','暂':'暫','点':'點','话':'話','说':'說','观':'觀','众':'眾',
        '显':'顯','视':'視','移':'移','长':'長','扫':'掃','读':'讀','录':'錄','权':'權','限':'限','终':'終',
        '频':'頻','发':'發','布':'布','标':'標','志':'誌','现':'現','准':'準','获':'獲','将':'將','结':'結',
        '构':'構','练':'練','连':'連','观':'觀','频':'頻','节':'節','导':'導','航':'航','还':'還','要':'要',
        '过':'過','续':'續','诺':'諾','个':'個','主':'主','义':'義','题':'題','备':'備','述':'述','签':'籤',
        '号':'號','频':'頻','让':'讓','区':'區','并':'並','频':'頻','为':'為','辑':'輯','间':'間','划':'劃',
        '实':'實','总':'總','订':'訂','阅':'閱','条':'條','获':'獲','套':'套','当':'當','浪':'浪','费':'費',
        '说':'說','块':'塊','没':'沒','清':'清','进':'進','择':'擇','供':'供','听':'聽','来':'來','强':'強',
        '迫':'迫','字':'字','完':'完','达':'達','讲':'講','时':'時','节':'節','奏':'奏','转':'轉','场':'場',
        '记':'記','读':'讀','图':'圖','问':'問','键':'鍵','论':'論','页':'頁','间':'間','记':'記','显':'顯',
        '备':'備','连':'連','线':'線','试':'試','际':'際','简':'簡','单':'單','顺':'順','题':'題','关':'關',
        '系':'係','撑':'撐','忆':'憶','确':'確','没':'沒','习':'習','组':'組','织':'織','现':'現','代':'代',
        '脑':'腦','动':'動','过':'過','试':'試','际':'際','备':'備','操':'操','作':'作','创':'創','压':'壓',
        '缩':'縮','写':'寫','头':'頭','语':'語','够':'夠','复':'複','杂':'雜','场':'場','景':'景','错':'錯',
        '误':'誤','问':'問','题':'題','么':'麼','仅':'僅','选':'選','择':'擇','门':'門','别':'別','确':'確',
        '认':'認','间':'間','际':'際','络':'絡','状':'狀','态':'態','带':'帶','线':'線','览':'覽','器':'器',
        '决':'決','着':'著','笔':'筆','摄':'攝','词':'詞','应':'應','贴':'貼','编':'編','气':'氣',
        '调':'調','画':'畫','检':'檢','荐':'薦','适':'適','匀':'勻','于':'於','请':'請','无':'無',
        '诵':'誦','断':'斷','纲':'綱','识':'識','顿':'頓','张':'張','后':'後','据':'據','远':'遠',
        '灵':'靈','钮':'鈕','测':'測','储':'儲','机':'機','获':'獲','纲':'綱','讲':'講','稿':'稿','简':'簡','报':'報',
    }))
    fixes = {
        '分別使用攝像和提詞應用': '分別使用攝影與提詞工具',
        '錄製控制集中': '錄製控制功能集中', '控製': '控制',
        '粘貼': '貼上', '打開': '開啟', '支持時': '支援時',
        '支撐示例': '補充範例', '旁边': '旁邊', '难以': '難以', '吗': '嗎',
        '从 YouTube': '從 YouTube', '再通過': '再透過', '首先，我们': '首先，我們',
        '环節': '環節', '自我介绍': '自我介紹', '清晰可见': '清楚可見',
        '自然对話中的轻重变化': '自然對話中的語氣變化', '創建': '建立',
        '章节规劃': '章節規劃', '應该': '應該', '对於': '對於',
        '怎样讓': '如何讓', '應該怎样': '應該如何', '演示很容易': '簡報很容易', '真實演示設備': '實際簡報設備',
        '几分钟': '幾分鐘', '几小時': '幾小時', '变化': '變化', '轉場处': '轉場處',
        '支持現代手機': '支援現代手機', '桌面瀏覽器': '桌面版瀏覽器',
        '連接方式': '連線方式', '觀眾收益': '觀眾收穫',
        '觀眾承諾': '對觀眾的承諾', '所有句子都使用相同速度': '每句都使用相同速度',
        '設備上': '裝置上', '你的設備': '你的裝置', '顯示設備': '顯示器',
    }
    for source, target in fixes.items():
        text = text.replace(source, target)
    return text


COMMON['zh-TW'] = {source: _to_zh_tw(target) for source, target in COMMON['zh-CN'].items()}
ZH_TW = {slug: tuple((source, _to_zh_tw(target)) for source, target in pairs) for slug, pairs in ZH_CN.items()}


def localize(page, locale, slug):
    packs = {'zh-CN': ZH_CN, 'zh-TW': ZH_TW}
    if locale not in packs or slug not in packs[locale]:
        return page
    replacements = list(COMMON[locale].items()) + list(packs[locale][slug])
    for source, target in sorted(replacements, key=lambda item: len(item[0]), reverse=True):
        page = page.replace(source, target)
    return page
