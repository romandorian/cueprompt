"""Thai editorial copy for core scene workflows."""

COMMON = {
    'CAMERA WORKFLOW': 'เวิร์กโฟลว์การถ่ายด้วยกล้อง',
    'YOUTUBE WORKFLOW': 'เวิร์กโฟลว์วิดีโอ YOUTUBE',
    'PRESENTATION WORKFLOW': 'เวิร์กโฟลว์การนำเสนอ',
    'The workflow this page is built for': 'เวิร์กโฟลว์ที่หน้านี้ออกแบบมาเพื่อคุณ',
    'From script to finished delivery': 'ตั้งแต่สคริปต์จนถึงผลงานที่พร้อมนำเสนอ',
    'Recommended CuePrompt settings': 'การตั้งค่า CuePrompt ที่แนะนำ',
    'A script structure that fits': 'โครงสร้างสคริปต์ที่เหมาะสม',
    'Common mistakes to avoid': 'ข้อผิดพลาดที่ควรหลีกเลี่ยง',
    'Questions before you start': 'คำถามก่อนเริ่มต้น',
    'Open camera teleprompter': 'เปิดเทเลพรอมพ์เตอร์พร้อมกล้อง',
    'Compress a finished take': 'บีบอัดวิดีโอที่ถ่ายเสร็จแล้ว',
    'Start a YouTube script': 'เริ่มเขียนสคริปต์ YouTube',
    'Use the YouTube 16:9 preset': 'ใช้ค่าที่ตั้งไว้สำหรับ YouTube 16:9',
    'Prepare publishing copy': 'เตรียมข้อความสำหรับเผยแพร่',
    'Start a presentation script': 'เริ่มเขียนสคริปต์นำเสนอ',
    'Rehearse in full screen': 'ซ้อมในโหมดเต็มหน้าจอ',
}

CAMERA = (
    ('Reading from notes usually pulls your eyes away from the lens, while separate camera and prompting apps add setup and file-transfer work. CuePrompt keeps the script, camera preview and recording controls in one browser tab.', 'การอ่านจากโน้ตมักทำให้สายตาหลุดจากเลนส์ ส่วนการใช้แอปกล้องและเทเลพรอมพ์เตอร์แยกกันก็เพิ่มขั้นตอนตั้งค่าและย้ายไฟล์ CuePrompt รวมสคริปต์ ภาพตัวอย่างจากกล้อง และปุ่มบันทึกไว้ในแท็บเดียว'),
    ('Paste or write the script, then break long paragraphs into lines you can say in one breath.', 'วางหรือเขียนสคริปต์ แล้วแบ่งย่อหน้ายาวให้เป็นประโยคที่พูดได้อย่างเป็นธรรมชาติในหนึ่งลมหายใจ'),
    ('Open Camera & record, frame the shot and place the reading area close to the lens.', 'เปิดกล้องและเริ่มบันทึก จัดองค์ประกอบภาพ แล้ววางพื้นที่อ่านข้อความไว้ใกล้เลนส์'),
    ('Run a short test, check sound and eye line, then record the full take and download it locally.', 'ทดลองถ่ายสั้น ๆ ตรวจเสียงและแนวสายตา จากนั้นบันทึกฉบับเต็มและดาวน์โหลดลงเครื่อง'),
    ('Mirror the preview when it helps you frame naturally.', 'กลับภาพตัวอย่างเมื่อช่วยให้จัดเฟรมได้เป็นธรรมชาติมากขึ้น'),
    ('Start with larger text and a comfortable steady speed; switch to Smart Follow when supported.', 'เริ่มด้วยตัวอักษรขนาดใหญ่และความเร็วคงที่ที่สบายตา แล้วเปลี่ยนเป็น Smart Follow เมื่อรองรับ'),
    ('Use [pause] before important points and [slow] where the delivery should settle.', 'ใส่ [pause] ก่อนประเด็นสำคัญ และ [slow] ในช่วงที่ควรพูดช้าลง'),
    ('Hook → one clear idea → supporting example → next action.', 'ประโยคดึงความสนใจ → แนวคิดที่ชัดเจนหนึ่งเรื่อง → ตัวอย่างสนับสนุน → ขั้นตอนถัดไป'),
    ('“If your eyes keep dropping to notes, put the words beside the lens. [pause] Keep each thought short, speak it naturally, then look back at the viewer.”', '“ถ้าสายตาคุณเลื่อนลงไปหาโน้ตบ่อย ๆ ให้วางข้อความไว้ข้างเลนส์ [pause] แบ่งแต่ละความคิดให้สั้น พูดอย่างเป็นธรรมชาติ แล้วกลับมามองผู้ชม”'),
    ('Recording the first take without checking microphone input.', 'เริ่มถ่ายจริงโดยไม่ได้ตรวจสัญญาณไมโครโฟนก่อน'),
    ('Putting the prompt far from the lens and creating obvious side-to-side eye movement.', 'วางข้อความไกลจากเลนส์จนเห็นการกวาดสายตาไปมาอย่างชัดเจน'),
    ('Using dense paragraphs that are hard to scan while speaking.', 'ใช้ย่อหน้าที่แน่นเกินไปจนอ่านกวาดสายตาระหว่างพูดได้ยาก'),
    ('Is the recording uploaded?', 'ไฟล์บันทึกถูกอัปโหลดหรือไม่'),
    ('No. Camera recording is created in your browser and remains on your device unless you choose to share or upload the downloaded file.', 'ไม่ ไฟล์บันทึกถูกสร้างในเบราว์เซอร์และเก็บอยู่บนอุปกรณ์ เว้นแต่คุณจะเลือกแชร์หรืออัปโหลดไฟล์เอง'),
    ('Why does the camera need HTTPS?', 'ทำไมกล้องจึงต้องใช้ HTTPS'),
    ('Browsers require a secure page before granting camera and microphone access.', 'เบราว์เซอร์กำหนดให้หน้าเว็บต้องปลอดภัยก่อนอนุญาตให้เข้าถึงกล้องและไมโครโฟน'),
    ('Should I mirror the final video?', 'ควรกลับภาพวิดีโอฉบับสุดท้ายหรือไม่'),
    ('Mirror is mainly a preview preference. Review the downloaded take before publishing, especially when signs or text appear in frame.', 'การกลับภาพมีไว้เพื่อความสะดวกในการดูตัวอย่างเป็นหลัก ควรตรวจไฟล์ที่ดาวน์โหลดก่อนเผยแพร่ โดยเฉพาะเมื่อมีป้ายหรือตัวอักษรอยู่ในภาพ'),
)

YOUTUBE = (
    ('Long-form YouTube videos need more than continuous scrolling: the opening must establish a promise, sections must stay easy to navigate, and the speaker still needs natural eye contact. CuePrompt connects a structured script, rehearsal, recording and publishing handoff.', 'วิดีโอ YouTube แบบยาวต้องการมากกว่าการเลื่อนข้อความต่อเนื่อง ช่วงเปิดต้องบอกสิ่งที่ผู้ชมจะได้รับ เนื้อหาต้องแบ่งตอนชัดเจน และผู้พูดต้องสบตาอย่างเป็นธรรมชาติ CuePrompt เชื่อมการเขียนสคริปต์ การซ้อม การบันทึก และการเตรียมเผยแพร่ไว้ด้วยกัน'),
    ('Start with the YouTube template and define the viewer, promise and three main sections.', 'เริ่มจากเทมเพลต YouTube แล้วกำหนดกลุ่มผู้ชม สิ่งที่วิดีโอสัญญาว่าจะมอบให้ และสามหัวข้อหลัก'),
    ('Use ## headings to separate chapters, then rehearse each section with Smart Follow or steady scrolling.', 'ใช้หัวข้อ ## แบ่งบท แล้วซ้อมแต่ละส่วนด้วย Smart Follow หรือการเลื่อนแบบคงที่'),
    ('Record in landscape, review the take, and prepare the title, description, tags and captions before upload.', 'บันทึกในแนวนอน ตรวจวิดีโอ แล้วเตรียมชื่อ คำอธิบาย แท็ก และคำบรรยายก่อนอัปโหลด'),
    ('Choose a landscape 16:9 export for a standard YouTube video.', 'เลือกส่งออกแนวนอน 16:9 สำหรับวิดีโอ YouTube มาตรฐาน'),
    ('Keep the prompt close to the lens and use a readable size that avoids rapid eye movement.', 'วางข้อความใกล้เลนส์และใช้ขนาดที่อ่านง่าย เพื่อไม่ให้สายตาเคลื่อนไหวเร็วเกินไป'),
    ('Add [pause] between chapters so edits and chapter transitions have clean space.', 'ใส่ [pause] ระหว่างบทเพื่อให้มีช่องว่างสะอาดสำหรับตัดต่อและเปลี่ยนตอน'),
    ('Hook and viewer promise → context → three useful chapters → recap → subscribe or next-video action.', 'ประโยคดึงความสนใจและสิ่งที่ผู้ชมจะได้รับ → บริบท → สามบทที่มีประโยชน์ → สรุป → ชวนติดตามหรือดูวิดีโอถัดไป'),
    ('“By the end of this video, you will have a three-step workflow you can use today. [pause] First, let’s remove the part that wastes the most time.”', '“เมื่อดูวิดีโอนี้จบ คุณจะได้เวิร์กโฟลว์สามขั้นตอนที่นำไปใช้ได้ทันที [pause] เริ่มจากตัดขั้นตอนที่เสียเวลามากที่สุดออกก่อน”'),
    ('Opening with a long introduction before explaining the viewer benefit.', 'เปิดเรื่องยาวเกินไปก่อนอธิบายว่าผู้ชมจะได้ประโยชน์อะไร'),
    ('Writing one uninterrupted block instead of visible chapters.', 'เขียนเป็นข้อความก้อนเดียวแทนที่จะแบ่งเป็นบทที่เห็นชัด'),
    ('Reading every sentence at the same pace and losing conversational emphasis.', 'อ่านทุกประโยคด้วยจังหวะเดียวกันจนขาดน้ำหนักแบบบทสนทนา'),
    ('Can I create chapter-ready scripts?', 'สร้างสคริปต์ที่พร้อมแบ่งบทได้หรือไม่'),
    ('Yes. Use ## headings for the major sections, then carry those section names into your YouTube chapter plan.', 'ได้ ใช้หัวข้อ ## สำหรับส่วนหลัก แล้วนำชื่อส่วนนั้นไปใช้ในแผนบทของ YouTube'),
    ('What format should I export?', 'ควรส่งออกเป็นรูปแบบใด'),
    ('For a standard horizontal video, the local converter provides a YouTube 16:9 MP4 preset.', 'สำหรับวิดีโอแนวนอนมาตรฐาน เครื่องมือแปลงไฟล์ในเครื่องมีค่าที่ตั้งไว้เป็น YouTube 16:9 MP4'),
    ('How do I sound less scripted?', 'ทำอย่างไรให้ฟังไม่เหมือนกำลังอ่านสคริปต์'),
    ('Write short spoken sentences, rehearse once, and treat the prompt as a guide rather than forcing every word into one take.', 'เขียนเป็นประโยคพูดสั้น ๆ ซ้อมหนึ่งรอบ และใช้ข้อความเป็นแนวทางแทนการพยายามพูดทุกคำให้ครบในเทคเดียว'),
)

PRESENTATIONS = (
    ('A presentation can lose momentum when the speaker memorizes every line or keeps looking down at notes. A teleprompter works best as a speaking outline: clear transitions, intentional pauses and a readable full-screen view.', 'การนำเสนออาจเสียจังหวะเมื่อผู้พูดพยายามจำทุกบรรทัดหรือก้มมองโน้ตตลอด เทเลพรอมพ์เตอร์จะได้ผลดีที่สุดเมื่อใช้เป็นโครงร่างการพูดที่มีการเชื่อมประเด็นชัดเจน จุดพักที่ตั้งใจ และมุมมองเต็มหน้าจอที่อ่านง่าย'),
    ('Choose the speech template and turn each slide or idea into one short speaking section.', 'เลือกเทมเพลตสุนทรพจน์ แล้วเปลี่ยนแต่ละสไลด์หรือแนวคิดให้เป็นช่วงพูดสั้น ๆ หนึ่งช่วง'),
    ('Mark transitions with ## headings and add [pause] after key claims, questions or slide changes.', 'ทำเครื่องหมายจุดเปลี่ยนด้วยหัวข้อ ## และใส่ [pause] หลังประเด็นสำคัญ คำถาม หรือการเปลี่ยนสไลด์'),
    ('Rehearse in full screen, adjust text size for the viewing distance and time the complete talk.', 'ซ้อมแบบเต็มหน้าจอ ปรับขนาดตัวอักษรตามระยะมอง และจับเวลาการพูดทั้งชุด'),
    ('Use full-screen reading and increase text size when the display is farther away.', 'อ่านแบบเต็มหน้าจอและเพิ่มขนาดตัวอักษรเมื่อจออยู่ไกล'),
    ('Choose steady scrolling for a fixed rehearsal pace or Smart Follow when you need flexible pauses.', 'เลือกการเลื่อนแบบคงที่เพื่อซ้อมตามจังหวะที่กำหนด หรือใช้ Smart Follow เมื่อต้องการหยุดอย่างยืดหยุ่น'),
    ('Keep controls accessible and test the same browser, display and connection used at the event.', 'วางส่วนควบคุมให้หยิบใช้สะดวก และทดสอบด้วยเบราว์เซอร์ จอภาพ และการเชื่อมต่อเดียวกับที่จะใช้ในงาน'),
    ('Opening idea → audience relevance → three supporting points → memorable recap → clear closing.', 'แนวคิดเปิดเรื่อง → ความเกี่ยวข้องกับผู้ฟัง → สามประเด็นสนับสนุน → สรุปที่น่าจดจำ → ปิดท้ายอย่างชัดเจน'),
    ('“Here is the question I want us to keep in mind today. [pause] What would change if this process took minutes instead of hours?”', '“นี่คือคำถามที่อยากให้เรานึกถึงตลอดวันนี้ [pause] อะไรจะเปลี่ยนไป หากกระบวนการนี้ใช้เวลาเพียงไม่กี่นาทีแทนที่จะเป็นหลายชั่วโมง”'),
    ('Copying slide text word for word instead of writing natural transitions.', 'คัดลอกข้อความบนสไลด์ทุกคำแทนที่จะเขียนประโยคเชื่อมที่เป็นธรรมชาติ'),
    ('Using text that is too small for the distance between speaker and display.', 'ใช้ตัวอักษรเล็กเกินไปเมื่อเทียบกับระยะระหว่างผู้พูดกับจอ'),
    ('Skipping a full rehearsal with the actual presentation setup.', 'ข้ามการซ้อมเต็มรูปแบบด้วยอุปกรณ์ที่จะใช้จริง'),
    ('Can I use CuePrompt for a speech without slides?', 'ใช้ CuePrompt สำหรับการพูดที่ไม่มีสไลด์ได้หรือไม่'),
    ('Yes. Organize the talk with headings, pauses and a strong closing, then read in full screen.', 'ได้ จัดโครงเรื่องด้วยหัวข้อ จุดพัก และตอนจบที่หนักแน่น แล้วอ่านในโหมดเต็มหน้าจอ'),
    ('How should I rehearse slide changes?', 'ควรซ้อมเปลี่ยนสไลด์อย่างไร'),
    ('Add a heading or [pause] marker at every transition and practice advancing the slide during that space.', 'เพิ่มหัวข้อหรือเครื่องหมาย [pause] ในทุกจุดเปลี่ยน แล้วฝึกเลื่อนสไลด์ในช่วงพักนั้น'),
    ('Does it work on a tablet?', 'ใช้งานบนแท็บเล็ตได้หรือไม่'),
    ('CuePrompt works in modern mobile, tablet and desktop browsers. Test full screen and controls on the exact device before the event.', 'CuePrompt ใช้งานได้บนเบราว์เซอร์สมัยใหม่ทั้งมือถือ แท็บเล็ต และคอมพิวเตอร์ ควรทดสอบโหมดเต็มหน้าจอและส่วนควบคุมบนอุปกรณ์จริงก่อนวันงาน'),
)


def localize(page, locale, slug):
    packs = {'teleprompter-with-camera': CAMERA, 'teleprompter-for-youtube': YOUTUBE, 'teleprompter-for-presentations': PRESENTATIONS}
    if locale != 'th' or slug not in packs:
        return page
    replacements = (*COMMON.items(), *packs[slug])
    for source, target in sorted(replacements, key=lambda item: len(item[0]), reverse=True):
        page = page.replace(source, target)
    return page
