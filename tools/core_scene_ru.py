"""Russian editorial copy for core scene workflows."""

COMMON={'CAMERA WORKFLOW':'РАБОЧИЙ ПРОЦЕСС С КАМЕРОЙ','YOUTUBE WORKFLOW':'РАБОЧИЙ ПРОЦЕСС ДЛЯ YOUTUBE','PRESENTATION WORKFLOW':'РАБОЧИЙ ПРОЦЕСС ДЛЯ ПРЕЗЕНТАЦИЙ','The workflow this page is built for':'Для какой задачи создана эта страница','From script to finished delivery':'От сценария до готового выступления','Recommended CuePrompt settings':'Рекомендуемые настройки CuePrompt','A script structure that fits':'Подходящая структура сценария','Common mistakes to avoid':'Распространённые ошибки','Questions before you start':'Вопросы перед началом','Open camera teleprompter':'Открыть телесуфлёр с камерой','Compress a finished take':'Сжать записанное видео','Start a YouTube script':'Создать сценарий для YouTube','Use the YouTube 16:9 preset':'Использовать шаблон YouTube 16:9','Prepare publishing copy':'Подготовить текст для публикации','Start a presentation script':'Создать сценарий презентации','Rehearse in full screen':'Репетировать в полноэкранном режиме'}

CAMERA=(
('Reading from notes usually pulls your eyes away from the lens, while separate camera and prompting apps add setup and file-transfer work. CuePrompt keeps the script, camera preview and recording controls in one browser tab.','При чтении заметок взгляд часто уходит от объектива, а отдельные приложения для камеры и телесуфлёра усложняют настройку и перенос файлов. CuePrompt объединяет сценарий, предпросмотр камеры и управление записью в одной вкладке браузера.'),
('Paste or write the script, then break long paragraphs into lines you can say in one breath.','Вставьте или напишите сценарий, затем разделите длинные абзацы на фразы, которые удобно произнести на одном дыхании.'),
('Open Camera & record, frame the shot and place the reading area close to the lens.','Откройте раздел камеры и записи, настройте кадр и разместите область чтения рядом с объективом.'),
('Run a short test, check sound and eye line, then record the full take and download it locally.','Сделайте короткую пробную запись, проверьте звук и направление взгляда, затем запишите полный дубль и сохраните его на устройстве.'),
('Mirror the preview when it helps you frame naturally.','Включите зеркальный предпросмотр, если так удобнее выстроить кадр.'),
('Start with larger text and a comfortable steady speed; switch to Smart Follow when supported.','Начните с крупного текста и комфортной постоянной скорости; при наличии поддержки переключитесь на Smart Follow.'),
('Use [pause] before important points and [slow] where the delivery should settle.','Добавляйте [pause] перед важными мыслями и [slow] там, где речь должна стать спокойнее.'),
('Hook → one clear idea → supporting example → next action.','Зацепка → одна ясная мысль → подтверждающий пример → следующее действие.'),
('“If your eyes keep dropping to notes, put the words beside the lens. [pause] Keep each thought short, speak it naturally, then look back at the viewer.”','«Если взгляд постоянно опускается к заметкам, поместите текст рядом с объективом. [pause] Формулируйте мысли кратко, говорите естественно и снова смотрите на зрителя».'),
('Recording the first take without checking microphone input.','Записывать первый дубль, не проверив микрофон.'),
('Putting the prompt far from the lens and creating obvious side-to-side eye movement.','Размещать текст далеко от объектива, из-за чего глаза заметно двигаются из стороны в сторону.'),
('Using dense paragraphs that are hard to scan while speaking.','Использовать плотные абзацы, которые трудно быстро читать во время речи.'),
('Is the recording uploaded?','Загружается ли запись в интернет?'),
('No. Camera recording is created in your browser and remains on your device unless you choose to share or upload the downloaded file.','Нет. Запись создаётся в браузере и остаётся на вашем устройстве, пока вы сами не решите поделиться или загрузить скачанный файл.'),
('Why does the camera need HTTPS?','Почему для камеры нужен HTTPS?'),
('Browsers require a secure page before granting camera and microphone access.','Браузеры разрешают доступ к камере и микрофону только на защищённой странице.'),
('Should I mirror the final video?','Нужно ли зеркально отражать готовое видео?'),
('Mirror is mainly a preview preference. Review the downloaded take before publishing, especially when signs or text appear in frame.','Зеркальное отображение в основном относится к предпросмотру. Проверьте скачанный дубль перед публикацией, особенно если в кадре есть надписи.'),)

YOUTUBE=(
('Long-form YouTube videos need more than continuous scrolling: the opening must establish a promise, sections must stay easy to navigate, and the speaker still needs natural eye contact. CuePrompt connects a structured script, rehearsal, recording and publishing handoff.','Для длинного видео на YouTube недостаточно непрерывной прокрутки: вступление должно обещать зрителю результат, разделы должны быть понятными, а взгляд — естественным. CuePrompt связывает структурированный сценарий, репетицию, запись и подготовку публикации.'),
('Start with the YouTube template and define the viewer, promise and three main sections.','Начните с шаблона YouTube и определите аудиторию, обещанный результат и три основных раздела.'),
('Use ## headings to separate chapters, then rehearse each section with Smart Follow or steady scrolling.','Разделите главы заголовками ## и отрепетируйте каждый раздел с помощью Smart Follow или равномерной прокрутки.'),
('Record in landscape, review the take, and prepare the title, description, tags and captions before upload.','Запишите видео в горизонтальном формате, проверьте дубль и подготовьте заголовок, описание, теги и субтитры перед загрузкой.'),
('Choose a landscape 16:9 export for a standard YouTube video.','Для обычного видео YouTube выберите горизонтальный экспорт 16:9.'),
('Keep the prompt close to the lens and use a readable size that avoids rapid eye movement.','Держите текст рядом с объективом и выберите размер, при котором глаза не будут быстро перемещаться.'),
('Add [pause] between chapters so edits and chapter transitions have clean space.','Добавляйте [pause] между главами, чтобы оставить место для монтажа и переходов.'),
('Hook and viewer promise → context → three useful chapters → recap → subscribe or next-video action.','Зацепка и обещание зрителю → контекст → три полезные главы → итог → подписка или переход к следующему видео.'),
('“By the end of this video, you will have a three-step workflow you can use today. [pause] First, let’s remove the part that wastes the most time.”','«К концу этого видео у вас будет процесс из трёх шагов, который можно применить уже сегодня. [pause] Сначала уберём этап, отнимающий больше всего времени».'),
('Opening with a long introduction before explaining the viewer benefit.','Начинать с длинного представления до объяснения пользы для зрителя.'),
('Writing one uninterrupted block instead of visible chapters.','Писать один сплошной блок вместо хорошо заметных глав.'),
('Reading every sentence at the same pace and losing conversational emphasis.','Читать все предложения в одном темпе и терять естественные речевые акценты.'),
('Can I create chapter-ready scripts?','Можно ли подготовить сценарий для деления на главы?'),
('Yes. Use ## headings for the major sections, then carry those section names into your YouTube chapter plan.','Да. Используйте заголовки ## для основных разделов, а затем перенесите их названия в план глав YouTube.'),
('What format should I export?','В каком формате экспортировать видео?'),
('For a standard horizontal video, the local converter provides a YouTube 16:9 MP4 preset.','Для обычного горизонтального видео локальный конвертер предлагает шаблон YouTube MP4 16:9.'),
('How do I sound less scripted?','Как сделать речь менее похожей на чтение?'),
('Write short spoken sentences, rehearse once, and treat the prompt as a guide rather than forcing every word into one take.','Пишите короткими разговорными фразами, один раз отрепетируйте и используйте текст как ориентир, не пытаясь дословно произнести всё за один дубль.'),)

PRESENTATIONS=(
('A presentation can lose momentum when the speaker memorizes every line or keeps looking down at notes. A teleprompter works best as a speaking outline: clear transitions, intentional pauses and a readable full-screen view.','Презентация теряет темп, если выступающий заучивает каждую строку или постоянно смотрит в заметки. Телесуфлёр лучше использовать как план речи с понятными переходами, осознанными паузами и читаемым полноэкранным режимом.'),
('Choose the speech template and turn each slide or idea into one short speaking section.','Выберите шаблон выступления и превратите каждый слайд или идею в короткий речевой раздел.'),
('Mark transitions with ## headings and add [pause] after key claims, questions or slide changes.','Отмечайте переходы заголовками ## и добавляйте [pause] после ключевых утверждений, вопросов и смены слайдов.'),
('Rehearse in full screen, adjust text size for the viewing distance and time the complete talk.','Репетируйте в полноэкранном режиме, настройте размер текста с учётом расстояния до экрана и засеките длительность всего выступления.'),
('Use full-screen reading and increase text size when the display is farther away.','Используйте полноэкранное чтение и увеличивайте текст, если экран расположен далеко.'),
('Choose steady scrolling for a fixed rehearsal pace or Smart Follow when you need flexible pauses.','Выберите равномерную прокрутку для фиксированного темпа или Smart Follow для гибких пауз.'),
('Keep controls accessible and test the same browser, display and connection used at the event.','Держите элементы управления под рукой и заранее проверьте тот же браузер, экран и подключение, которые будут использоваться на мероприятии.'),
('Opening idea → audience relevance → three supporting points → memorable recap → clear closing.','Вступительная идея → связь с аудиторией → три аргумента → запоминающийся итог → чёткое завершение.'),
('“Here is the question I want us to keep in mind today. [pause] What would change if this process took minutes instead of hours?”','«Вот вопрос, который стоит помнить сегодня. [pause] Что изменилось бы, если бы этот процесс занимал минуты, а не часы?»'),
('Copying slide text word for word instead of writing natural transitions.','Дословно копировать текст слайдов вместо естественных переходов.'),
('Using text that is too small for the distance between speaker and display.','Использовать слишком мелкий текст для расстояния между выступающим и экраном.'),
('Skipping a full rehearsal with the actual presentation setup.','Пропускать полную репетицию с реальным оборудованием.'),
('Can I use CuePrompt for a speech without slides?','Можно ли использовать CuePrompt для выступления без слайдов?'),
('Yes. Organize the talk with headings, pauses and a strong closing, then read in full screen.','Да. Организуйте речь с помощью заголовков, пауз и сильного завершения, а затем читайте в полноэкранном режиме.'),
('How should I rehearse slide changes?','Как репетировать смену слайдов?'),
('Add a heading or [pause] marker at every transition and practice advancing the slide during that space.','Добавьте заголовок или [pause] на каждом переходе и тренируйтесь переключать слайд во время этой паузы.'),
('Does it work on a tablet?','Работает ли CuePrompt на планшете?'),
('CuePrompt works in modern mobile, tablet and desktop browsers. Test full screen and controls on the exact device before the event.','CuePrompt работает в современных браузерах на телефонах, планшетах и компьютерах. До мероприятия проверьте полноэкранный режим и управление на нужном устройстве.'),)

def localize(page,locale,slug):
 packs={'teleprompter-with-camera':CAMERA,'teleprompter-for-youtube':YOUTUBE,'teleprompter-for-presentations':PRESENTATIONS}
 if locale!='ru' or slug not in packs:return page
 for source,target in sorted((*COMMON.items(),*packs[slug]),key=lambda item:len(item[0]),reverse=True):page=page.replace(source,target)
 return page
