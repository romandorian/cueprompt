"""Editorial source for the three highest-value teleprompter workflows."""

CORE_SCENES = {
    'teleprompter-with-camera': {
        'label': 'CAMERA WORKFLOW',
        'problem': 'Reading from notes usually pulls your eyes away from the lens, while separate camera and prompting apps add setup and file-transfer work. CuePrompt keeps the script, camera preview and recording controls in one browser tab.',
        'steps': ('Paste or write the script, then break long paragraphs into lines you can say in one breath.', 'Open Camera & record, frame the shot and place the reading area close to the lens.', 'Run a short test, check sound and eye line, then record the full take and download it locally.'),
        'settings': ('Mirror the preview when it helps you frame naturally.', 'Start with larger text and a comfortable steady speed; switch to Smart Follow when supported.', 'Use [pause] before important points and [slow] where the delivery should settle.'),
        'structure': 'Hook → one clear idea → supporting example → next action.',
        'example': '“If your eyes keep dropping to notes, put the words beside the lens. [pause] Keep each thought short, speak it naturally, then look back at the viewer.”',
        'mistakes': ('Recording the first take without checking microphone input.', 'Putting the prompt far from the lens and creating obvious side-to-side eye movement.', 'Using dense paragraphs that are hard to scan while speaking.'),
        'faqs': (('Is the recording uploaded?', 'No. Camera recording is created in your browser and remains on your device unless you choose to share or upload the downloaded file.'), ('Why does the camera need HTTPS?', 'Browsers require a secure page before granting camera and microphone access.'), ('Should I mirror the final video?', 'Mirror is mainly a preview preference. Review the downloaded take before publishing, especially when signs or text appear in frame.')),
        'ctas': (('/#studio', 'Open camera teleprompter', ' data-open-camera'), ('/video-converter/', 'Compress a finished take', '')),
    },
    'teleprompter-for-youtube': {
        'label': 'YOUTUBE WORKFLOW',
        'problem': 'Long-form YouTube videos need more than continuous scrolling: the opening must establish a promise, sections must stay easy to navigate, and the speaker still needs natural eye contact. CuePrompt connects a structured script, rehearsal, recording and publishing handoff.',
        'steps': ('Start with the YouTube template and define the viewer, promise and three main sections.', 'Use ## headings to separate chapters, then rehearse each section with Smart Follow or steady scrolling.', 'Record in landscape, review the take, and prepare the title, description, tags and captions before upload.'),
        'settings': ('Choose a landscape 16:9 export for a standard YouTube video.', 'Keep the prompt close to the lens and use a readable size that avoids rapid eye movement.', 'Add [pause] between chapters so edits and chapter transitions have clean space.'),
        'structure': 'Hook and viewer promise → context → three useful chapters → recap → subscribe or next-video action.',
        'example': '“By the end of this video, you will have a three-step workflow you can use today. [pause] First, let’s remove the part that wastes the most time.”',
        'mistakes': ('Opening with a long introduction before explaining the viewer benefit.', 'Writing one uninterrupted block instead of visible chapters.', 'Reading every sentence at the same pace and losing conversational emphasis.'),
        'faqs': (('Can I create chapter-ready scripts?', 'Yes. Use ## headings for the major sections, then carry those section names into your YouTube chapter plan.'), ('What format should I export?', 'For a standard horizontal video, the local converter provides a YouTube 16:9 MP4 preset.'), ('How do I sound less scripted?', 'Write short spoken sentences, rehearse once, and treat the prompt as a guide rather than forcing every word into one take.')),
        'ctas': (('/script-templates/?scene=youtube', 'Start a YouTube script', ''), ('/video-converter/?preset=youtube', 'Use the YouTube 16:9 preset', ''), ('/publishing-assistant/', 'Prepare publishing copy', '')),
    },
    'teleprompter-for-presentations': {
        'label': 'PRESENTATION WORKFLOW',
        'problem': 'A presentation can lose momentum when the speaker memorizes every line or keeps looking down at notes. A teleprompter works best as a speaking outline: clear transitions, intentional pauses and a readable full-screen view.',
        'steps': ('Choose the speech template and turn each slide or idea into one short speaking section.', 'Mark transitions with ## headings and add [pause] after key claims, questions or slide changes.', 'Rehearse in full screen, adjust text size for the viewing distance and time the complete talk.'),
        'settings': ('Use full-screen reading and increase text size when the display is farther away.', 'Choose steady scrolling for a fixed rehearsal pace or Smart Follow when you need flexible pauses.', 'Keep controls accessible and test the same browser, display and connection used at the event.'),
        'structure': 'Opening idea → audience relevance → three supporting points → memorable recap → clear closing.',
        'example': '“Here is the question I want us to keep in mind today. [pause] What would change if this process took minutes instead of hours?”',
        'mistakes': ('Copying slide text word for word instead of writing natural transitions.', 'Using text that is too small for the distance between speaker and display.', 'Skipping a full rehearsal with the actual presentation setup.'),
        'faqs': (('Can I use CuePrompt for a speech without slides?', 'Yes. Organize the talk with headings, pauses and a strong closing, then read in full screen.'), ('How should I rehearse slide changes?', 'Add a heading or [pause] marker at every transition and practice advancing the slide during that space.'), ('Does it work on a tablet?', 'CuePrompt works in modern mobile, tablet and desktop browsers. Test full screen and controls on the exact device before the event.')),
        'ctas': (('/script-templates/?scene=speech', 'Start a presentation script', ''), ('/#studio', 'Rehearse in full screen', '')),
    },
}


def render(slug):
    scene = CORE_SCENES[slug]
    steps = ''.join(f'<li>{step}</li>' for step in scene['steps'])
    settings = ''.join(f'<li>{item}</li>' for item in scene['settings'])
    mistakes = ''.join(f'<li>{item}</li>' for item in scene['mistakes'])
    faqs = ''.join(f'<details><summary>{question}</summary><p>{answer}</p></details>' for question, answer in scene['faqs'])
    ctas = ''.join(f'<a class="play-button" href="{url}"{attrs}>{label} →</a>' for url, label, attrs in scene['ctas'])
    return f'''<section class="landing scene-guide" data-scene-guide="{slug}"><span class="eyebrow">{scene['label']}</span><h2>The workflow this page is built for</h2><p>{scene['problem']}</p><h2>From script to finished delivery</h2><ol>{steps}</ol><h2>Recommended CuePrompt settings</h2><ul>{settings}</ul><h2>A script structure that fits</h2><p><strong>{scene['structure']}</strong></p><blockquote>{scene['example']}</blockquote><h2>Common mistakes to avoid</h2><ul>{mistakes}</ul><h2>Questions before you start</h2>{faqs}<div class="scene-actions">{ctas}</div></section>'''
