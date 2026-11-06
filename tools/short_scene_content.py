"""Editorial workflows for the three vertical short-video scene pages."""

SHORT_SCENES = {
    'teleprompter-for-youtube-shorts': {
        'label': 'YOUTUBE SHORTS WORKFLOW',
        'problem': 'A Short has very little time to earn attention and deliver a complete payoff. The script needs a clear promise in the first three seconds, short spoken lines, and a finish that does not feel rushed. CuePrompt turns that timing plan into a readable recording workflow.',
        'steps': ('Choose the YouTube Shorts template, define one viewer problem, and write the promised result before the explanation.', 'Split the script into a 0–3 second hook, a compact explanation, a visible payoff, and one next action.', 'Rehearse against a 60-second target, record vertically, then review the first frame, captions, and ending before export.'),
        'settings': ('Use large text, short lines, and a slightly faster but still conversational scroll.', 'Record in 9:16 and keep your face and important visuals inside the center safe area.', 'Add [pause] before the payoff and leave a clean beat at the end for editing or a loop.'),
        'structure': '0–3s promise → problem in one line → two or three fast steps → visible result → next-video or subscribe action.',
        'example': '“Your script is not too long—it starts too slowly. [pause] Put the result first, explain only the two steps viewers need, and save the background for a longer video.”',
        'mistakes': ('Spending the opening seconds introducing yourself instead of stating the result.', 'Packing multiple unrelated tips into one Short.', 'Ending immediately after the final word with no room for captions, a cut, or a loop.'),
        'faqs': (('Must every Short be exactly 60 seconds?', 'No. Use the shortest length that delivers the promised result, then verify the current YouTube upload rules before publishing.'), ('How can I make the first frame stronger?', 'Start with the result, a specific question, or a visible before-and-after. Avoid greetings that delay the reason to keep watching.'), ('Can CuePrompt help with a seamless loop?', 'Yes. Write an ending that naturally leads back to the opening line and leave a short editing beat at both ends.')),
        'ctas': (('/script-templates/?scene=shorts', 'Start a Shorts script'), ('/video-converter/?preset=shorts', 'Use the Shorts 9:16 preset'), ('/publishing-assistant/', 'Prepare title and captions')),
    },
    'teleprompter-for-tiktok': {
        'label': 'TIKTOK WORKFLOW',
        'problem': 'TikTok delivery works when it feels immediate, spoken, and native to the feed. A polished paragraph often sounds like an advertisement, while overlays can cover important words or gestures. CuePrompt helps shape a conversational hook, quick proof, and a vertical recording that respects screen safe areas.',
        'steps': ('Choose the TikTok template and write the hook as something you would genuinely say to one person.', 'Build the middle from short claims, demonstrations, or cuts; mark where on-screen text and B-roll will appear.', 'Rehearse without memorizing, record in 9:16, then check caption placement and the final call to action in preview.'),
        'settings': ('Keep each prompt line to one spoken thought and use Smart Follow when you want flexible reactions.', 'Place the reading area near the lens but away from the lower caption zone and right-side controls.', 'Use [pause] for cuts or demonstrations and [slow] only where a key phrase needs emphasis.'),
        'structure': 'Conversational hook → name the frustration → show the proof or process → concise takeaway → comment, save, or follow action.',
        'example': '“If you keep re-recording the same opening, try this. [pause] Say the problem exactly as your viewer would say it, then show the fix before you explain why it works.”',
        'mistakes': ('Writing formal marketing copy that does not sound natural when spoken.', 'Placing captions or product details where interface controls will cover them.', 'Using a generic “follow for more” before giving viewers a concrete payoff.'),
        'faqs': (('Should I read every word exactly?', 'Usually not. Keep the hook and key claim precise, but treat supporting lines as prompts so your delivery stays conversational.'), ('Where should captions go?', 'Keep essential text away from the bottom edge and platform controls. Always inspect the exported video in a vertical preview before posting.'), ('Can I plan cuts in the script?', 'Yes. Add [pause] where you will change angle, demonstrate an action, or insert B-roll so the recording leaves clean edit points.')),
        'ctas': (('/script-templates/?scene=tiktok', 'Start a TikTok script'), ('/video-converter/?preset=tiktok', 'Use the TikTok 9:16 preset'), ('/publishing-assistant/', 'Prepare caption and hashtags')),
    },
    'teleprompter-for-instagram-reels': {
        'label': 'INSTAGRAM REELS WORKFLOW',
        'problem': 'A Reel often needs to communicate before sound is on: the opening visual, on-screen headline, and spoken line must work together. It also needs room for captions and a consistent brand voice. CuePrompt connects that visual opening to a concise script, vertical recording, and release copy.',
        'steps': ('Choose the Reels template and define the opening visual, on-screen headline, and first spoken sentence as one combined moment.', 'Write a compact story or tutorial with deliberate spaces for captions, product shots, and B-roll.', 'Record vertically, review the cover frame and text-safe areas, then prepare the caption and call to action before posting.'),
        'settings': ('Use a 9:16 frame and keep faces, products, and headline text away from interface edges.', 'Place the prompt close to the lens and choose a calm speed that matches your brand voice.', 'Add [pause] around visual transitions so captions and B-roll have room to breathe.'),
        'structure': 'Visual opening plus headline → relatable tension → useful reveal or mini-story → branded takeaway → save, share, or profile action.',
        'example': '“This is the five-minute setup I use before every client recording. [pause] One light, one clear promise, and the script close enough to keep natural eye contact.”',
        'mistakes': ('Relying on the spoken hook while the opening frame says nothing with sound off.', 'Filling every part of the frame and leaving no readable caption space.', 'Using a trendy tone that conflicts with the rest of the brand or profile.'),
        'faqs': (('How should I plan the Reel cover?', 'Choose a frame with one clear subject and a short readable headline. Check how it crops in both the profile grid and vertical feed.'), ('Do I need different spoken and on-screen text?', 'Often yes. Let the headline carry the quick context while the spoken line adds personality or advances the idea instead of repeating it.'), ('Can I keep a consistent brand voice?', 'Yes. Save a reusable opening, pacing style, and closing action in your template, then adapt the central story for each Reel.')),
        'ctas': (('/script-templates/?scene=reels', 'Start a Reels script'), ('/video-converter/?preset=reels', 'Use the Reels 9:16 preset'), ('/publishing-assistant/', 'Prepare caption and release copy')),
    },
}


def render(slug):
    scene = SHORT_SCENES.get(slug)
    if not scene:
        return ''
    steps = ''.join(f'<li>{item}</li>' for item in scene['steps'])
    settings = ''.join(f'<li>{item}</li>' for item in scene['settings'])
    mistakes = ''.join(f'<li>{item}</li>' for item in scene['mistakes'])
    faqs = ''.join(f'<details><summary>{q}</summary><p>{a}</p></details>' for q, a in scene['faqs'])
    ctas = ''.join(f'<a class="play-button" href="{url}">{label} →</a>' for url, label in scene['ctas'])
    return f'''<section class="landing scene-guide" data-scene-guide="{slug}"><span class="eyebrow">{scene['label']}</span><h2>The workflow this page is built for</h2><p>{scene['problem']}</p><h2>From hook to vertical export</h2><ol>{steps}</ol><h2>Recommended CuePrompt settings</h2><ul>{settings}</ul><h2>A short-video structure that fits</h2><p><strong>{scene['structure']}</strong></p><blockquote>{scene['example']}</blockquote><h2>Common mistakes to avoid</h2><ul>{mistakes}</ul><h2>Questions before you record</h2>{faqs}<div class="scene-actions">{ctas}</div></section>'''
