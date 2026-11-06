"""German editorial copy for core scene workflows."""

COMMON={'CAMERA WORKFLOW':'WORKFLOW FÜR KAMERAAUFNAHMEN','YOUTUBE WORKFLOW':'WORKFLOW FÜR YOUTUBE-VIDEOS','PRESENTATION WORKFLOW':'WORKFLOW FÜR PRÄSENTATIONEN','The workflow this page is built for':'Für diesen Anwendungsfall ist die Seite gedacht','From script to finished delivery':'Vom Skript bis zum fertigen Vortrag','Recommended CuePrompt settings':'Empfohlene CuePrompt-Einstellungen','A script structure that fits':'Eine passende Skriptstruktur','Common mistakes to avoid':'Häufige Fehler, die du vermeiden solltest','Questions before you start':'Fragen vor dem Start','Open camera teleprompter':'Teleprompter mit Kamera öffnen','Compress a finished take':'Aufnahme komprimieren','Start a YouTube script':'YouTube-Skript erstellen','Use the YouTube 16:9 preset':'YouTube-Vorgabe 16:9 verwenden','Prepare publishing copy':'Veröffentlichungstext vorbereiten','Start a presentation script':'Präsentationsskript erstellen','Rehearse in full screen':'Im Vollbild proben'}

CAMERA=(
('Reading from notes usually pulls your eyes away from the lens, while separate camera and prompting apps add setup and file-transfer work. CuePrompt keeps the script, camera preview and recording controls in one browser tab.','Beim Lesen von Notizen wandert der Blick leicht vom Objektiv weg. Getrennte Kamera- und Teleprompter-Apps verursachen außerdem zusätzlichen Einrichtungs- und Dateiübertragungsaufwand. CuePrompt bündelt Skript, Kameravorschau und Aufnahmesteuerung in einem Browser-Tab.'),
('Paste or write the script, then break long paragraphs into lines you can say in one breath.','Füge dein Skript ein oder schreibe es direkt und teile lange Absätze in Sätze, die du bequem in einem Atemzug sprechen kannst.'),
('Open Camera & record, frame the shot and place the reading area close to the lens.','Öffne Kamera und Aufnahme, richte den Bildausschnitt ein und platziere den Lesebereich nahe am Objektiv.'),
('Run a short test, check sound and eye line, then record the full take and download it locally.','Mache eine kurze Testaufnahme, prüfe Ton und Blickrichtung, nimm dann den vollständigen Take auf und speichere ihn auf deinem Gerät.'),
('Mirror the preview when it helps you frame naturally.','Spiegle die Vorschau, wenn dir das bei einer natürlichen Bildgestaltung hilft.'),
('Start with larger text and a comfortable steady speed; switch to Smart Follow when supported.','Beginne mit größerer Schrift und einem angenehmen gleichmäßigen Tempo. Wechsle zu Smart Follow, wenn dein Browser es unterstützt.'),
('Use [pause] before important points and [slow] where the delivery should settle.','Setze [pause] vor wichtige Aussagen und [slow] an Stellen, die ruhiger gesprochen werden sollen.'),
('Hook → one clear idea → supporting example → next action.','Einstieg → eine klare Idee → unterstützendes Beispiel → nächste Handlung.'),
('“If your eyes keep dropping to notes, put the words beside the lens. [pause] Keep each thought short, speak it naturally, then look back at the viewer.”','„Wenn dein Blick immer wieder zu den Notizen sinkt, platziere die Wörter neben dem Objektiv. [pause] Halte jeden Gedanken kurz, sprich natürlich und blicke dann wieder zum Publikum.“'),
('Recording the first take without checking microphone input.','Den ersten Take aufnehmen, ohne den Mikrofoneingang zu prüfen.'),
('Putting the prompt far from the lens and creating obvious side-to-side eye movement.','Den Text weit vom Objektiv entfernt platzieren und dadurch auffällige Augenbewegungen erzeugen.'),
('Using dense paragraphs that are hard to scan while speaking.','Dichte Absätze verwenden, die sich beim Sprechen nur schwer erfassen lassen.'),
('Is the recording uploaded?','Wird die Aufnahme hochgeladen?'),
('No. Camera recording is created in your browser and remains on your device unless you choose to share or upload the downloaded file.','Nein. Die Aufnahme wird im Browser erstellt und bleibt auf deinem Gerät, sofern du die heruntergeladene Datei nicht selbst teilst oder hochlädst.'),
('Why does the camera need HTTPS?','Warum benötigt die Kamera HTTPS?'),
('Browsers require a secure page before granting camera and microphone access.','Browser verlangen eine sichere Seite, bevor sie den Zugriff auf Kamera und Mikrofon erlauben.'),
('Should I mirror the final video?','Soll ich auch das fertige Video spiegeln?'),
('Mirror is mainly a preview preference. Review the downloaded take before publishing, especially when signs or text appear in frame.','Die Spiegelung ist hauptsächlich eine Vorschauoption. Prüfe den heruntergeladenen Take vor der Veröffentlichung, besonders wenn Schilder oder Text im Bild erscheinen.'),)

YOUTUBE=(
('Long-form YouTube videos need more than continuous scrolling: the opening must establish a promise, sections must stay easy to navigate, and the speaker still needs natural eye contact. CuePrompt connects a structured script, rehearsal, recording and publishing handoff.','Lange YouTube-Videos brauchen mehr als fortlaufendes Scrollen: Der Einstieg muss einen Nutzen versprechen, Abschnitte müssen leicht erfassbar bleiben und der Blick soll natürlich wirken. CuePrompt verbindet strukturiertes Skript, Probe, Aufnahme und Veröffentlichungsvorbereitung.'),
('Start with the YouTube template and define the viewer, promise and three main sections.','Beginne mit der YouTube-Vorlage und definiere Zielgruppe, Nutzenversprechen und drei Hauptabschnitte.'),
('Use ## headings to separate chapters, then rehearse each section with Smart Follow or steady scrolling.','Trenne Kapitel mit ## Überschriften und probe jeden Abschnitt mit Smart Follow oder gleichmäßigem Scrollen.'),
('Record in landscape, review the take, and prepare the title, description, tags and captions before upload.','Nimm im Querformat auf, prüfe den Take und bereite vor dem Upload Titel, Beschreibung, Tags und Untertitel vor.'),
('Choose a landscape 16:9 export for a standard YouTube video.','Wähle für ein normales YouTube-Video einen Export im Querformat 16:9.'),
('Keep the prompt close to the lens and use a readable size that avoids rapid eye movement.','Halte den Text nahe am Objektiv und verwende eine lesbare Größe, die schnelle Augenbewegungen vermeidet.'),
('Add [pause] between chapters so edits and chapter transitions have clean space.','Füge zwischen Kapiteln [pause] ein, damit Schnitte und Übergänge ausreichend Platz haben.'),
('Hook and viewer promise → context → three useful chapters → recap → subscribe or next-video action.','Einstieg und Zusage an das Publikum → Kontext → drei hilfreiche Kapitel → Zusammenfassung → Abo oder nächstes Video.'),
('“By the end of this video, you will have a three-step workflow you can use today. [pause] First, let’s remove the part that wastes the most time.”','„Am Ende dieses Videos kennst du einen dreistufigen Ablauf, den du noch heute verwenden kannst. [pause] Entfernen wir zuerst den Teil, der am meisten Zeit kostet.“'),
('Opening with a long introduction before explaining the viewer benefit.','Mit einer langen Vorstellung beginnen, bevor der Nutzen für das Publikum erklärt wird.'),
('Writing one uninterrupted block instead of visible chapters.','Einen durchgehenden Textblock statt klar erkennbarer Kapitel schreiben.'),
('Reading every sentence at the same pace and losing conversational emphasis.','Jeden Satz im gleichen Tempo lesen und dadurch natürliche Betonung verlieren.'),
('Can I create chapter-ready scripts?','Kann ich Skripte erstellen, die sich direkt in Kapitel gliedern lassen?'),
('Yes. Use ## headings for the major sections, then carry those section names into your YouTube chapter plan.','Ja. Verwende ## Überschriften für die Hauptabschnitte und übernimm diese Namen in deine YouTube-Kapitelplanung.'),
('What format should I export?','In welchem Format soll ich exportieren?'),
('For a standard horizontal video, the local converter provides a YouTube 16:9 MP4 preset.','Für ein normales horizontales Video bietet der lokale Konverter eine YouTube-Vorgabe für MP4 in 16:9.'),
('How do I sound less scripted?','Wie klinge ich weniger abgelesen?'),
('Write short spoken sentences, rehearse once, and treat the prompt as a guide rather than forcing every word into one take.','Schreibe kurze gesprochene Sätze, probe einmal und nutze den Text als Leitfaden, statt jedes Wort in einem Take zu erzwingen.'),)

PRESENTATIONS=(
('A presentation can lose momentum when the speaker memorizes every line or keeps looking down at notes. A teleprompter works best as a speaking outline: clear transitions, intentional pauses and a readable full-screen view.','Eine Präsentation verliert an Schwung, wenn jede Zeile auswendig gelernt wird oder der Blick ständig auf Notizen fällt. Ein Teleprompter funktioniert am besten als Sprechleitfaden mit klaren Übergängen, bewussten Pausen und einer gut lesbaren Vollbildansicht.'),
('Choose the speech template and turn each slide or idea into one short speaking section.','Wähle die Redevorlage und verwandle jede Folie oder Idee in einen kurzen Sprechabschnitt.'),
('Mark transitions with ## headings and add [pause] after key claims, questions or slide changes.','Markiere Übergänge mit ## Überschriften und setze [pause] nach wichtigen Aussagen, Fragen oder Folienwechseln.'),
('Rehearse in full screen, adjust text size for the viewing distance and time the complete talk.','Probe im Vollbild, passe die Textgröße an den Betrachtungsabstand an und stoppe die Dauer des gesamten Vortrags.'),
('Use full-screen reading and increase text size when the display is farther away.','Lies im Vollbild und vergrößere den Text, wenn der Bildschirm weiter entfernt ist.'),
('Choose steady scrolling for a fixed rehearsal pace or Smart Follow when you need flexible pauses.','Nutze gleichmäßiges Scrollen für ein festes Probentempo oder Smart Follow für flexible Pausen.'),
('Keep controls accessible and test the same browser, display and connection used at the event.','Halte die Bedienelemente erreichbar und teste denselben Browser, Bildschirm und dieselbe Verbindung wie bei der Veranstaltung.'),
('Opening idea → audience relevance → three supporting points → memorable recap → clear closing.','Einstiegsidee → Bezug zum Publikum → drei stützende Punkte → einprägsame Zusammenfassung → klarer Abschluss.'),
('“Here is the question I want us to keep in mind today. [pause] What would change if this process took minutes instead of hours?”','„Diese Frage sollten wir heute im Kopf behalten. [pause] Was würde sich ändern, wenn dieser Vorgang Minuten statt Stunden dauern würde?“'),
('Copying slide text word for word instead of writing natural transitions.','Folientext Wort für Wort kopieren, statt natürliche Übergänge zu schreiben.'),
('Using text that is too small for the distance between speaker and display.','Text verwenden, der für den Abstand zwischen sprechender Person und Bildschirm zu klein ist.'),
('Skipping a full rehearsal with the actual presentation setup.','Auf eine vollständige Probe mit dem echten Präsentationsaufbau verzichten.'),
('Can I use CuePrompt for a speech without slides?','Kann ich CuePrompt für eine Rede ohne Folien verwenden?'),
('Yes. Organize the talk with headings, pauses and a strong closing, then read in full screen.','Ja. Strukturiere den Vortrag mit Überschriften, Pausen und einem starken Abschluss und lies ihn anschließend im Vollbild.'),
('How should I rehearse slide changes?','Wie soll ich Folienwechsel proben?'),
('Add a heading or [pause] marker at every transition and practice advancing the slide during that space.','Setze an jedem Übergang eine Überschrift oder [pause] und übe, die Folie in diesem Zeitraum weiterzuschalten.'),
('Does it work on a tablet?','Funktioniert CuePrompt auf einem Tablet?'),
('CuePrompt works in modern mobile, tablet and desktop browsers. Test full screen and controls on the exact device before the event.','CuePrompt funktioniert in modernen Mobil-, Tablet- und Desktop-Browsern. Teste Vollbild und Bedienung vor der Veranstaltung auf dem tatsächlich verwendeten Gerät.'),)

def localize(page,locale,slug):
 packs={'teleprompter-with-camera':CAMERA,'teleprompter-for-youtube':YOUTUBE,'teleprompter-for-presentations':PRESENTATIONS}
 if locale!='de' or slug not in packs:return page
 for source,target in sorted((*COMMON.items(),*packs[slug]),key=lambda item:len(item[0]),reverse=True):page=page.replace(source,target)
 return page
