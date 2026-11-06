"""Arabic editorial copy for core scene workflows."""

COMMON={'CAMERA WORKFLOW':'مسار التسجيل بالكاميرا','YOUTUBE WORKFLOW':'مسار فيديوهات YOUTUBE','PRESENTATION WORKFLOW':'مسار العروض التقديمية','The workflow this page is built for':'الحالة التي صُممت هذه الصفحة من أجلها','From script to finished delivery':'من النص إلى التقديم النهائي','Recommended CuePrompt settings':'إعدادات CuePrompt المقترحة','A script structure that fits':'بنية نص مناسبة','Common mistakes to avoid':'أخطاء شائعة ينبغي تجنبها','Questions before you start':'أسئلة قبل أن تبدأ','Open camera teleprompter':'فتح الملقّن مع الكاميرا','Compress a finished take':'ضغط التسجيل','Start a YouTube script':'إنشاء نص لفيديو YouTube','Use the YouTube 16:9 preset':'استخدام إعداد YouTube بنسبة 16:9','Prepare publishing copy':'إعداد نص النشر','Start a presentation script':'إنشاء نص للعرض التقديمي','Rehearse in full screen':'التدرّب بملء الشاشة'}

CAMERA=(
('Reading from notes usually pulls your eyes away from the lens, while separate camera and prompting apps add setup and file-transfer work. CuePrompt keeps the script, camera preview and recording controls in one browser tab.','غالبًا ما تُبعد قراءة الملاحظات عينيك عن العدسة، كما أن استخدام تطبيقين منفصلين للكاميرا والتلقين يزيد خطوات الإعداد ونقل الملفات. يجمع CuePrompt النص ومعاينة الكاميرا وأدوات التسجيل في علامة تبويب واحدة.'),
('Paste or write the script, then break long paragraphs into lines you can say in one breath.','الصق النص أو اكتبه، ثم قسّم الفقرات الطويلة إلى جمل يمكنك قولها بشكل طبيعي في نَفَس واحد.'),
('Open Camera & record, frame the shot and place the reading area close to the lens.','افتح الكاميرا والتسجيل، واضبط تكوين اللقطة، وضع منطقة القراءة بالقرب من العدسة.'),
('Run a short test, check sound and eye line, then record the full take and download it locally.','نفّذ تسجيلًا تجريبيًا قصيرًا، وتحقق من الصوت واتجاه النظر، ثم سجّل اللقطة كاملة واحفظها على جهازك.'),
('Mirror the preview when it helps you frame naturally.','اعكس المعاينة إذا كان ذلك يساعدك على ضبط الإطار بصورة طبيعية.'),
('Start with larger text and a comfortable steady speed; switch to Smart Follow when supported.','ابدأ بنص كبير وسرعة ثابتة مريحة، وانتقل إلى Smart Follow عندما يكون مدعومًا.'),
('Use [pause] before important points and [slow] where the delivery should settle.','أضف [pause] قبل النقاط المهمة و[slow] في المواضع التي تحتاج إلى إلقاء أهدأ.'),
('Hook → one clear idea → supporting example → next action.','افتتاحية جذابة ← فكرة واضحة ← مثال داعم ← الخطوة التالية.'),
('“If your eyes keep dropping to notes, put the words beside the lens. [pause] Keep each thought short, speak it naturally, then look back at the viewer.”','«إذا كانت عيناك تنخفضان نحو الملاحظات باستمرار، فضع الكلمات بجانب العدسة. [pause] اجعل كل فكرة قصيرة، وقلها بطبيعية، ثم أعد نظرك إلى المشاهد.»'),
('Recording the first take without checking microphone input.','تسجيل اللقطة الأولى من دون التحقق من إدخال الميكروفون.'),
('Putting the prompt far from the lens and creating obvious side-to-side eye movement.','وضع النص بعيدًا عن العدسة، مما يسبب حركة واضحة للعينين من جانب إلى آخر.'),
('Using dense paragraphs that are hard to scan while speaking.','استخدام فقرات كثيفة يصعب تتبعها أثناء الكلام.'),
('Is the recording uploaded?','هل يُرفع التسجيل إلى الإنترنت؟'),
('No. Camera recording is created in your browser and remains on your device unless you choose to share or upload the downloaded file.','لا. يُنشأ التسجيل داخل المتصفح ويبقى على جهازك، إلا إذا اخترت مشاركة الملف الذي نزّلته أو رفعه.'),
('Why does the camera need HTTPS?','لماذا تحتاج الكاميرا إلى HTTPS؟'),
('Browsers require a secure page before granting camera and microphone access.','تتطلب المتصفحات صفحة آمنة قبل السماح بالوصول إلى الكاميرا والميكروفون.'),
('Should I mirror the final video?','هل ينبغي عكس الفيديو النهائي أيضًا؟'),
('Mirror is mainly a preview preference. Review the downloaded take before publishing, especially when signs or text appear in frame.','العكس تفضيل خاص بالمعاينة في الأساس. راجع اللقطة التي نزّلتها قبل النشر، خصوصًا عند ظهور لافتات أو نصوص في الإطار.'),)

YOUTUBE=(
('Long-form YouTube videos need more than continuous scrolling: the opening must establish a promise, sections must stay easy to navigate, and the speaker still needs natural eye contact. CuePrompt connects a structured script, rehearsal, recording and publishing handoff.','تحتاج فيديوهات YouTube الطويلة إلى أكثر من تمرير مستمر: يجب أن توضح البداية ما سيحصل عليه المشاهد، وأن تبقى الأقسام سهلة التصفح، مع الحفاظ على نظرة طبيعية. يربط CuePrompt بين النص المنظم والتدريب والتسجيل والاستعداد للنشر.'),
('Start with the YouTube template and define the viewer, promise and three main sections.','ابدأ بقالب YouTube وحدد الجمهور والنتيجة التي يعد بها الفيديو وثلاثة أقسام رئيسية.'),
('Use ## headings to separate chapters, then rehearse each section with Smart Follow or steady scrolling.','استخدم عناوين ## لفصل الفصول، ثم تدرّب على كل قسم باستخدام Smart Follow أو التمرير الثابت.'),
('Record in landscape, review the take, and prepare the title, description, tags and captions before upload.','سجّل بالوضع الأفقي، وراجع اللقطة، وجهّز العنوان والوصف والوسوم والترجمات قبل الرفع.'),
('Choose a landscape 16:9 export for a standard YouTube video.','اختر تصديرًا أفقيًا بنسبة 16:9 لفيديو YouTube عادي.'),
('Keep the prompt close to the lens and use a readable size that avoids rapid eye movement.','أبقِ النص قريبًا من العدسة واستخدم حجمًا مقروءًا لا يتطلب حركة سريعة للعينين.'),
('Add [pause] between chapters so edits and chapter transitions have clean space.','أضف [pause] بين الفصول لترك مساحة واضحة للمونتاج والانتقالات.'),
('Hook and viewer promise → context → three useful chapters → recap → subscribe or next-video action.','افتتاحية ووعد للمشاهد ← سياق ← ثلاثة فصول مفيدة ← خلاصة ← اشتراك أو انتقال إلى الفيديو التالي.'),
('“By the end of this video, you will have a three-step workflow you can use today. [pause] First, let’s remove the part that wastes the most time.”','«بنهاية هذا الفيديو سيكون لديك مسار من ثلاث خطوات يمكنك استخدامه اليوم. [pause] لنبدأ بإزالة الجزء الذي يهدر أكبر قدر من الوقت.»'),
('Opening with a long introduction before explaining the viewer benefit.','البدء بمقدمة طويلة قبل توضيح الفائدة للمشاهد.'),
('Writing one uninterrupted block instead of visible chapters.','كتابة كتلة واحدة متصلة بدلًا من فصول واضحة.'),
('Reading every sentence at the same pace and losing conversational emphasis.','قراءة كل الجمل بالسرعة نفسها وفقدان النبرة الطبيعية للمحادثة.'),
('Can I create chapter-ready scripts?','هل يمكنني إنشاء نص جاهز للتقسيم إلى فصول؟'),
('Yes. Use ## headings for the major sections, then carry those section names into your YouTube chapter plan.','نعم. استخدم عناوين ## للأقسام الرئيسية، ثم استخدم أسماء هذه الأقسام في خطة فصول YouTube.'),
('What format should I export?','بأي تنسيق ينبغي أن أصدّر؟'),
('For a standard horizontal video, the local converter provides a YouTube 16:9 MP4 preset.','يوفر المحول المحلي إعداد YouTube بصيغة MP4 ونسبة 16:9 للفيديو الأفقي العادي.'),
('How do I sound less scripted?','كيف أجعل كلامي أقل شبهًا بالقراءة؟'),
('Write short spoken sentences, rehearse once, and treat the prompt as a guide rather than forcing every word into one take.','اكتب جملًا قصيرة بأسلوب منطوق، وتدرّب مرة، واستخدم النص كدليل بدلًا من إجبار نفسك على قول كل كلمة في لقطة واحدة.'),)

PRESENTATIONS=(
('A presentation can lose momentum when the speaker memorizes every line or keeps looking down at notes. A teleprompter works best as a speaking outline: clear transitions, intentional pauses and a readable full-screen view.','قد يفقد العرض إيقاعه عندما يحفظ المتحدث كل سطر أو يواصل النظر إلى الملاحظات. يعمل الملقّن بأفضل صورة كمخطط للكلام، مع انتقالات واضحة ووقفات مقصودة وعرض مقروء بملء الشاشة.'),
('Choose the speech template and turn each slide or idea into one short speaking section.','اختر قالب الخطاب وحوّل كل شريحة أو فكرة إلى قسم قصير للكلام.'),
('Mark transitions with ## headings and add [pause] after key claims, questions or slide changes.','حدّد الانتقالات بعناوين ## وأضف [pause] بعد الأفكار المهمة والأسئلة وتغيير الشرائح.'),
('Rehearse in full screen, adjust text size for the viewing distance and time the complete talk.','تدرّب بملء الشاشة، واضبط حجم النص وفق مسافة المشاهدة، وقِس مدة العرض كاملًا.'),
('Use full-screen reading and increase text size when the display is farther away.','استخدم القراءة بملء الشاشة وكبّر النص عندما تكون الشاشة بعيدة.'),
('Choose steady scrolling for a fixed rehearsal pace or Smart Follow when you need flexible pauses.','اختر التمرير الثابت لإيقاع تدريب محدد أو Smart Follow عندما تحتاج إلى وقفات مرنة.'),
('Keep controls accessible and test the same browser, display and connection used at the event.','أبقِ أدوات التحكم في متناولك واختبر المتصفح والشاشة والاتصال نفسها التي ستستخدمها في الحدث.'),
('Opening idea → audience relevance → three supporting points → memorable recap → clear closing.','فكرة افتتاحية ← صلتها بالجمهور ← ثلاث نقاط داعمة ← خلاصة سهلة التذكر ← نهاية واضحة.'),
('“Here is the question I want us to keep in mind today. [pause] What would change if this process took minutes instead of hours?”','«هذا هو السؤال الذي أريد أن نتذكره اليوم. [pause] ماذا سيتغير لو استغرقت هذه العملية دقائق بدلًا من ساعات؟»'),
('Copying slide text word for word instead of writing natural transitions.','نسخ نص الشرائح كلمة بكلمة بدلًا من كتابة انتقالات طبيعية.'),
('Using text that is too small for the distance between speaker and display.','استخدام نص صغير جدًا مقارنة بالمسافة بين المتحدث والشاشة.'),
('Skipping a full rehearsal with the actual presentation setup.','تجاوز التدريب الكامل باستخدام تجهيزات العرض الفعلية.'),
('Can I use CuePrompt for a speech without slides?','هل يمكنني استخدام CuePrompt لخطاب بلا شرائح؟'),
('Yes. Organize the talk with headings, pauses and a strong closing, then read in full screen.','نعم. نظّم الخطاب بالعناوين والوقفات ونهاية قوية، ثم اقرأه بملء الشاشة.'),
('How should I rehearse slide changes?','كيف أتدرّب على تغيير الشرائح؟'),
('Add a heading or [pause] marker at every transition and practice advancing the slide during that space.','أضف عنوانًا أو [pause] عند كل انتقال وتدرّب على تغيير الشريحة خلال هذه الوقفة.'),
('Does it work on a tablet?','هل يعمل على الجهاز اللوحي؟'),
('CuePrompt works in modern mobile, tablet and desktop browsers. Test full screen and controls on the exact device before the event.','يعمل CuePrompt في المتصفحات الحديثة على الهاتف والجهاز اللوحي والكمبيوتر. اختبر ملء الشاشة وأدوات التحكم على الجهاز نفسه قبل الحدث.'),)

def localize(page,locale,slug):
 packs={'teleprompter-with-camera':CAMERA,'teleprompter-for-youtube':YOUTUBE,'teleprompter-for-presentations':PRESENTATIONS}
 if locale!='ar' or slug not in packs:return page
 for source,target in sorted((*COMMON.items(),*packs[slug]),key=lambda item:len(item[0]),reverse=True):page=page.replace(source,target)
 return page
