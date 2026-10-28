'use strict';
(() => {
  const el = id => document.getElementById(id);
  const value = id => el(id).value.trim();
  const locale = document.documentElement.lang || 'en';
  const isZh = () => locale.startsWith('zh');
  const isJa = () => locale === 'ja';
  const isKo = () => locale === 'ko';
  const zhMessages = {
    'Draft ready. Review and edit before reading.': '草稿已生成。请检查并编辑后再朗读。',
    'Add a topic and at least one key point.': '请填写主题和至少一个要点。',
    'Paste or import a transcript first.': '请先粘贴或导入转录稿。',
    'Choose a TXT, MD, SRT or VTT file smaller than 5 MB.': '请选择小于 5 MB 的 TXT、MD、SRT 或 VTT 文件。',
    'Could not read this file. Please try another file.': '无法读取此文件，请换一个文件再试。',
    'Add your title and script first.': '请先填写标题和脚本。',
    'Create or paste a draft first.': '请先创建或粘贴草稿。',
    'Browser storage is unavailable. Download your draft and import it in the studio.': '浏览器存储不可用。请下载草稿后再导入工作台。',
    'Copied.': '已复制。',
    'Select the draft and copy it manually.': '请选中草稿后手动复制。'
  };
  const jaMessages = {
    'Draft ready. Review and edit before reading.': '下書きができました。読み上げる前に確認・編集してください。',
    'Add a topic and at least one key point.': 'テーマと少なくとも 1 つの要点を入力してください。',
    'Paste or import a transcript first.': 'まず文字起こしを貼り付けるか読み込んでください。',
    'Add your title and script first.': '先にタイトルとスクリプトを入力してください。',
    'Create or paste a draft first.': '先に下書きを作成または貼り付けてください。',
    'Copied.': 'コピーしました。'
  };
  const koMessages = {
    'Draft ready. Review and edit before reading.': '초안이 준비되었습니다. 읽기 전에 검토하고 편집하세요.',
    'Add a topic and at least one key point.': '주제와 핵심 내용 하나 이상을 입력하세요.',
    'Paste or import a transcript first.': '먼저 녹취록을 붙여넣거나 가져오세요.',
    'Choose a TXT, MD, SRT or VTT file smaller than 5 MB.': '5 MB 미만의 TXT, MD, SRT, VTT 파일을 선택하세요.',
    'Could not read this file. Please try another file.': '파일을 읽을 수 없습니다. 다른 파일을 선택하세요.',
    'Add your title and script first.': '먼저 제목과 대본을 입력하세요.',
    'Create or paste a draft first.': '먼저 초안을 만들거나 붙여넣으세요.',
    'Browser storage is unavailable. Download your draft and import it in the studio.': '브라우저 저장소를 사용할 수 없습니다. 초안을 다운로드한 뒤 Studio로 가져오세요.',
    'Copied.': '복사했습니다.',
    'Select the draft and copy it manually.': '초안을 선택한 뒤 직접 복사하세요.'
  };
  const status = text => { el('status').textContent = isZh() ? (zhMessages[text] || text) : isJa() ? (jaMessages[text] || text) : isKo() ? (koMessages[text] || text) : text; };
  const output = (title, text) => { el('result-title').value = title; el('result').value = text; status('Draft ready. Review and edit before reading.'); };
  const clean = text => {
    const normalized = text.replace(/^\uFEFF/, '').replace(/\r/g, '');
    if (!/\d{2}:\d{2}[.,]\d{3}\s*-->/.test(normalized)) return normalized.trim();
    return normalized.split(/\n\s*\n/).flatMap(block => {
      const lines = block.split('\n'); const time = lines.findIndex(line => /\d{2}:\d{2}[.,]\d{3}\s*-->/.test(line));
      return time < 0 ? [] : lines.slice(time + 1).map(line => line.replace(/<[^>]*>/g, '').trim());
    }).filter(Boolean).join('\n\n');
  };
  if (el('generate')) el('generate').onclick = () => {
    const topic = value('topic'), audience = value('audience'), points = value('points'), action = value('action');
    if (!topic || !points) { status('Add a topic and at least one key point.'); return; }
    const scriptLanguage = value('language');
    // On-device draft copy per script language. To support another language,
    // add a pack here and an <option> in tools/build_creator_tools.py.
    const PACKS = {
      en: {
        opening: 'Opening', closing: 'Closing', extra: 'Additional point', defaultAction: 'Thanks for your time. See you next time.',
        openings: {
          youtube: `Today we're exploring ${topic}. If you're ${audience || 'looking for a practical starting point'}, this video is for you.`,
          pitch: `Meet ${topic}. We built this for ${audience || 'people who want a better way'} to solve a real problem.`,
          course: `Welcome to ${topic}. This lesson is for ${audience || 'curious learners'}. Let's work through it step by step.`,
          meeting: `Hello everyone. Here's the latest update on ${topic}.`,
          podcast: `Welcome to ${topic}. Today we're sharing these ideas with ${audience || 'everyone listening'}.`,
          speech: `Thank you for being here. Today I'd like to share a few thoughts about ${topic}.`,
          live: `Welcome to the livestream! Today's topic is ${topic}. ${audience ? `Great to have ${audience} here.` : 'Say hello in the chat.'}`,
          interview: `Hello, I'm ${topic}. Thank you for this opportunity. Let me introduce my experience and what I can contribute.`
        },
        structures: {
          youtube: ['The hook', 'Practical steps', 'An example'], pitch: ['The problem', 'The solution', 'Proof and value'],
          course: ['Learning outcome', 'Explanation and example', 'Practice'], meeting: ['Progress', 'Blockers', 'Next steps'],
          podcast: ['Episode topic', 'Key discussion', 'Listener takeaway'], speech: ['Shared experience', 'Main message', 'Action and hope'],
          live: ["Today's agenda", 'Audience question', 'Main demonstration'], interview: ['Relevant experience', 'Achievements and strengths', 'Goals and fit']
        }
      },
      zh: {
        opening: '开场', closing: '结束', extra: '补充要点', defaultAction: '感谢你的时间。我们下次见。',
        openings: {
          youtube: `今天我们聊聊${topic}。如果你是${audience || '正在寻找新方法的人'}，这期视频就是为你准备的。`,
          pitch: `认识一下${topic}。我们希望帮助${audience || '你'}解决一个实际问题。`,
          course: `欢迎来到${topic}。这节课面向${audience || '希望学习的你'}，我们一步一步来。`,
          meeting: `大家好，下面同步${topic}的最新进展。`,
          podcast: `欢迎收听${topic}。今天我们为${audience || '每一位听众'}准备了这些值得聊的话题。`,
          speech: `感谢各位来到这里。今天我想和大家分享${topic}。`,
          live: `欢迎来到直播间！今天的主题是${topic}。${audience ? `欢迎${audience}一起参与。` : ''}`,
          interview: `你好，我是${topic}。感谢这次机会，下面简单介绍我的经历与优势。`
        },
        structures: {
          youtube: ['问题与期待', '实用方法', '示例'], pitch: ['痛点', '解决方案', '证据与价值'],
          course: ['学习目标', '解释与示例', '动手练习'], meeting: ['已完成', '阻碍', '下一步'],
          podcast: ['本期话题', '核心观点', '听众收获'], speech: ['共同经历', '核心观点', '行动与希望'],
          live: ['今日安排', '观众互动', '重点分享'], interview: ['相关经历', '成果与优势', '目标与匹配']
        }
      },
      'zh-tw': {
        opening: '開場', closing: '結束', extra: '補充要點', defaultAction: '感謝你的時間。我們下次見。',
        openings: {
          youtube: `今天我們來聊聊${topic}。如果你是${audience || '正在尋找新方法的人'}，這支影片就是為你準備的。`,
          pitch: `認識一下${topic}。我們希望幫助${audience || '你'}解決一個實際問題。`,
          course: `歡迎來到${topic}。這堂課面向${audience || '想學習的你'}，我們一步一步來。`,
          meeting: `大家好，下面同步${topic}的最新進展。`,
          podcast: `歡迎收聽${topic}。今天我們為${audience || '每一位聽眾'}準備了這些值得聊的話題。`,
          speech: `感謝各位來到這裡。今天我想和大家分享${topic}。`,
          live: `歡迎來到直播間！今天的主題是${topic}。${audience ? `歡迎${audience}一起參與。` : ''}`,
          interview: `你好，我是${topic}。感謝這次機會，下面簡單介紹我的經歷與優勢。`
        },
        structures: {
          youtube: ['問題與期待', '實用方法', '示例'], pitch: ['痛點', '解決方案', '證據與價值'],
          course: ['學習目標', '解釋與示例', '動手練習'], meeting: ['已完成', '阻礙', '下一步'],
          podcast: ['本期話題', '核心觀點', '聽眾收穫'], speech: ['共同經歷', '核心觀點', '行動與希望'],
          live: ['今日安排', '觀眾互動', '重點分享'], interview: ['相關經歷', '成果與優勢', '目標與匹配']
        }
      },
      ko: {
        opening: '도입', closing: '마무리', extra: '추가 내용', defaultAction: '시청해 주셔서 감사합니다. 다음에 또 만나요.',
        openings: {
          youtube: `오늘은 ${topic}에 대해 이야기하겠습니다. ${audience || '새로운 방법을 찾는 분들'}께 도움이 되는 영상입니다.`,
          pitch: `${topic}을 소개합니다. ${audience || '여러분'}의 실제 문제를 해결하는 방법을 살펴보겠습니다.`,
          course: `${topic} 강의에 오신 것을 환영합니다. ${audience || '배우고 싶은 분들'}과 함께 한 단계씩 알아보겠습니다.`,
          meeting: `안녕하세요. ${topic}의 최신 진행 상황을 공유하겠습니다.`,
          podcast: `${topic}에 오신 것을 환영합니다. 오늘은 ${audience || '청취자 여러분'}과 핵심 내용을 나누겠습니다.`,
          speech: `함께해 주셔서 감사합니다. 오늘은 ${topic}에 대한 이야기를 나누겠습니다.`,
          live: `라이브 방송에 오신 것을 환영합니다! 오늘의 주제는 ${topic}입니다.`,
          interview: `안녕하세요. 저는 ${topic}입니다. 제 경험과 강점을 간단히 소개하겠습니다.`
        },
        structures: {
          youtube: ['관심을 끄는 도입', '실천 방법', '예시'], pitch: ['문제', '해결 방법', '가치와 근거'],
          course: ['학습 목표', '설명과 예시', '연습'], meeting: ['진행 상황', '장애물', '다음 단계'],
          podcast: ['이번 주제', '핵심 이야기', '청취자가 얻을 내용'], speech: ['공통 경험', '핵심 메시지', '행동과 희망'],
          live: ['오늘의 순서', '시청자와 소통', '핵심 시연'], interview: ['관련 경험', '성과와 강점', '목표와 적합성']
        }
      },
      ja: {
        opening: 'オープニング', closing: 'クロージング', extra: '補足ポイント', defaultAction: 'お時間ありがとうございました。また次回お会いしましょう。',
        openings: {
          youtube: `今日は${topic}についてお話しします。${audience || '新しい方法を探している方'}のための動画です。`,
          pitch: `${topic}をご紹介します。${audience || 'あなた'}の実際の課題を解決するために作りました。`,
          course: `${topic}へようこそ。${audience || '学びたい方'}に向けて、一歩ずつ進めていきます。`,
          meeting: `こんにちは。${topic}の最新状況を共有します。`,
          podcast: `${topic}へようこそ。今日は${audience || '聴いてくださる皆さん'}と話題を分かち合います。`,
          speech: `本日はお集まりいただきありがとうございます。今日は${topic}についてお話しします。`,
          live: `配信へようこそ！今日のテーマは${topic}です。${audience ? `${audience}の皆さん、ようこそ。` : 'チャットで挨拶してくださいね。'}`,
          interview: `こんにちは、${topic}です。本日は機会をいただきありがとうございます。経験と強みをご紹介します。`
        },
        structures: {
          youtube: ['興味を引く導入', '実践ステップ', '具体例'], pitch: ['課題', '解決策', '証拠と価値'],
          course: ['学習目標', '説明と例', '練習'], meeting: ['進捗', '障害', '次のステップ'],
          podcast: ['今回のテーマ', '核心の議論', '聴きどころ'], speech: ['共通の経験', 'メインメッセージ', '行動と希望'],
          live: ['今日の予定', '視聴者との交流', 'メイン実演'], interview: ['関連する経験', '実績と強み', '目標と適合']
        }
      },
      es: {
        opening: 'Apertura', closing: 'Cierre', extra: 'Punto adicional', defaultAction: 'Gracias por tu tiempo. Nos vemos pronto.',
        openings: {
          youtube: `Hoy hablamos de ${topic}. Si eres ${audience || 'alguien que busca un punto de partida práctico'}, este video es para ti.`,
          pitch: `Te presento ${topic}. Lo creamos para que ${audience || 'tú'} resuelvas un problema real.`,
          course: `Bienvenido a ${topic}. Esta clase es para ${audience || 'quienes quieren aprender'}. Avancemos paso a paso.`,
          meeting: `Hola a todos. Aquí está la última actualización de ${topic}.`,
          podcast: `Bienvenido a ${topic}. Hoy compartimos estas ideas con ${audience || 'todos los que escuchan'}.`,
          speech: `Gracias por estar aquí. Hoy quiero compartir algunas ideas sobre ${topic}.`,
          live: `¡Bienvenido al directo! Hoy hablamos de ${topic}. ${audience ? `Qué gusto tener aquí a ${audience}.` : 'Saluda en el chat.'}`,
          interview: `Hola, soy ${topic}. Gracias por esta oportunidad. Les cuento mi experiencia y lo que puedo aportar.`
        },
        structures: {
          youtube: ['El gancho', 'Pasos prácticos', 'Un ejemplo'], pitch: ['El problema', 'La solución', 'Prueba y valor'],
          course: ['Resultado de aprendizaje', 'Explicación y ejemplo', 'Práctica'], meeting: ['Avances', 'Obstáculos', 'Próximos pasos'],
          podcast: ['Tema del episodio', 'Discusión clave', 'Aprendizaje del oyente'], speech: ['Experiencia compartida', 'Mensaje principal', 'Acción y esperanza'],
          live: ['Agenda de hoy', 'Pregunta del público', 'Demostración principal'], interview: ['Experiencia relevante', 'Logros y fortalezas', 'Metas y encaje']
        }
      },
      pt: {
        opening: 'Abertura', closing: 'Encerramento', extra: 'Ponto adicional', defaultAction: 'Obrigado pelo seu tempo. Até a próxima.',
        openings: {
          youtube: `Hoje vamos falar de ${topic}. Se você é ${audience || 'alguém que busca um ponto de partida prático'}, este vídeo é para você.`,
          pitch: `Conheça o ${topic}. Criamos isso para que ${audience || 'você'} resolva um problema real.`,
          course: `Boas-vindas a ${topic}. Esta aula é para ${audience || 'quem quer aprender'}. Vamos passo a passo.`,
          meeting: `Olá a todos. Aqui está a atualização mais recente de ${topic}.`,
          podcast: `Bem-vindo a ${topic}. Hoje compartilhamos estas ideias com ${audience || 'todos que estão ouvindo'}.`,
          speech: `Obrigado por estarem aqui. Hoje quero compartilhar algumas ideias sobre ${topic}.`,
          live: `Bem-vindo à live! O tema de hoje é ${topic}. ${audience ? `Que bom ter ${audience} aqui.` : 'Deixe um olá no chat.'}`,
          interview: `Olá, sou ${topic}. Obrigado pela oportunidade. Vou apresentar minha experiência e o que posso contribuir.`
        },
        structures: {
          youtube: ['O gancho', 'Passos práticos', 'Um exemplo'], pitch: ['O problema', 'A solução', 'Prova e valor'],
          course: ['Resultado de aprendizagem', 'Explicação e exemplo', 'Prática'], meeting: ['Progresso', 'Obstáculos', 'Próximos passos'],
          podcast: ['Tema do episódio', 'Discussão principal', 'Aprendizado do ouvinte'], speech: ['Experiência compartilhada', 'Mensagem central', 'Ação e esperança'],
          live: ['Roteiro de hoje', 'Pergunta do público', 'Demonstração principal'], interview: ['Experiência relevante', 'Conquistas e pontos fortes', 'Objetivos e alinhamento']
        }
      },
      fr: {
        opening: 'Ouverture', closing: 'Conclusion', extra: 'Point supplémentaire', defaultAction: 'Merci pour votre temps. À très vite.',
        openings: {
          youtube: `Aujourd'hui, on parle de ${topic}. Si vous êtes ${audience || "à la recherche d'un point de départ concret"}, cette vidéo est pour vous.`,
          pitch: `Découvrez ${topic}. Nous l'avons créé pour que ${audience || 'vous'} résolviez un vrai problème.`,
          course: `Bienvenue dans ${topic}. Ce cours s'adresse à ${audience || 'celles et ceux qui veulent apprendre'}. Avançons pas à pas.`,
          meeting: `Bonjour à tous. Voici les dernières nouvelles de ${topic}.`,
          podcast: `Bienvenue dans ${topic}. Aujourd'hui, nous partageons ces idées avec ${audience || 'tous les auditeurs'}.`,
          speech: `Merci d'être là. Aujourd'hui, j'aimerais partager quelques réflexions sur ${topic}.`,
          live: `Bienvenue dans le direct ! Le sujet du jour : ${topic}. ${audience ? `Heureux d'accueillir ${audience}.` : 'Dites bonjour dans le chat.'}`,
          interview: `Bonjour, je suis ${topic}. Merci pour cette opportunité. Je vous présente mon parcours et ce que je peux apporter.`
        },
        structures: {
          youtube: ["L'accroche", 'Étapes pratiques', 'Un exemple'], pitch: ['Le problème', 'La solution', 'Preuve et valeur'],
          course: ["Objectif d'apprentissage", 'Explication et exemple', 'Pratique'], meeting: ['Avancées', 'Blocs', 'Prochaines étapes'],
          podcast: ["Sujet de l'épisode", 'Discussion clé', "Ce que l'auditeur retient"], speech: ['Expérience partagée', 'Message principal', 'Action et espoir'],
          live: ['Programme du jour', 'Question du public', 'Démonstration principale'], interview: ['Expérience pertinente', 'Réussites et forces', 'Objectifs et adéquation']
        }
      },
      de: {
        opening: 'Einstieg', closing: 'Abschluss', extra: 'Zusätzlicher Punkt', defaultAction: 'Danke für deine Zeit. Bis zum nächsten Mal.',
        openings: {
          youtube: `Heute geht es um ${topic}. Wenn du ${audience || 'auf der Suche nach einem praktischen Einstieg'} bist, ist dieses Video für dich.`,
          pitch: `Das ist ${topic}. Wir haben es entwickelt, damit ${audience || 'du'} ein echtes Problem löst.`,
          course: `Willkommen zu ${topic}. Diese Lektion richtet sich an ${audience || 'alle, die lernen wollen'}. Wir gehen Schritt für Schritt vor.`,
          meeting: `Hallo zusammen. Hier ist das Update zu ${topic}.`,
          podcast: `Willkommen zu ${topic}. Heute teilen wir diese Ideen mit ${audience || 'allen Zuhörenden'}.`,
          speech: `Danke, dass ihr da seid. Heute möchte ich einige Gedanken zu ${topic} teilen.`,
          live: `Willkommen im Livestream! Das heutige Thema: ${topic}. ${audience ? `Schön, dass ${audience} dabei ist.` : 'Schreibt Hallo in den Chat.'}`,
          interview: `Hallo, ich bin ${topic}. Vielen Dank für die Gelegenheit. Ich stelle meine Erfahrung und meine Stärken vor.`
        },
        structures: {
          youtube: ['Der Aufhänger', 'Praktische Schritte', 'Ein Beispiel'], pitch: ['Das Problem', 'Die Lösung', 'Beweis und Wert'],
          course: ['Lernziel', 'Erklärung und Beispiel', 'Übung'], meeting: ['Fortschritt', 'Hindernisse', 'Nächste Schritte'],
          podcast: ['Episodenthema', 'Kerndiskussion', 'Mehrwert für Hörende'], speech: ['Gemeinsame Erfahrung', 'Kernbotschaft', 'Handlung und Hoffnung'],
          live: ['Ablauf heute', 'Publikumsfrage', 'Hauptdemonstration'], interview: ['Relevante Erfahrung', 'Erfolge und Stärken', 'Ziele und Passung']
        }
      },
      ru: {
        opening: 'Вступление', closing: 'Финал', extra: 'Дополнительный пункт', defaultAction: 'Спасибо за ваше время. До встречи.',
        openings: {
          youtube: `Сегодня поговорим о ${topic}. Если вы ${audience || 'ищете практичную отправную точку'}, это видео для вас.`,
          pitch: `Познакомьтесь с ${topic}. Мы создали его, чтобы ${audience || 'вы'} решили реальную задачу.`,
          course: `Добро пожаловать на ${topic}. Этот урок для ${audience || 'тех, кто хочет научиться'}. Пройдём всё шаг за шагом.`,
          meeting: `Всем привет. Вот последние новости по ${topic}.`,
          podcast: `Добро пожаловать в ${topic}. Сегодня делимся этими темами с ${audience || 'каждым слушателем'}.`,
          speech: `Спасибо, что пришли. Сегодня хочу поделиться мыслями о ${topic}.`,
          live: `Добро пожаловать в эфир! Тема сегодня — ${topic}. ${audience ? `Рады видеть ${audience}.` : 'Поприветствуйте нас в чате.'}`,
          interview: `Здравствуйте, я ${topic}. Спасибо за возможность. Коротко расскажу о своём опыте и сильных сторонах.`
        },
        structures: {
          youtube: ['Крючок', 'Практические шаги', 'Пример'], pitch: ['Проблема', 'Решение', 'Доказательства и ценность'],
          course: ['Цель обучения', 'Объяснение и пример', 'Практика'], meeting: ['Прогресс', 'Препятствия', 'Следующие шаги'],
          podcast: ['Тема выпуска', 'Ключевое обсуждение', 'Польза для слушателя'], speech: ['Общий опыт', 'Главная мысль', 'Действие и надежда'],
          live: ['План на сегодня', 'Вопрос зрителя', 'Главное демо'], interview: ['Релевантный опыт', 'Достижения и сильные стороны', 'Цели и соответствие']
        }
      },
      ar: {
        opening: 'الافتتاح', closing: 'الختام', extra: 'نقطة إضافية', defaultAction: 'شكرًا لوقتكم. أراكم قريبًا.',
        openings: {
          youtube: `اليوم نتحدث عن ${topic}. إذا كنت ${audience || 'تبحث عن نقطة بداية عملية'}، فهذا الفيديو لك.`,
          pitch: `تعرّف على ${topic}. صنعناه ليساعد ${audience || 'ك'} في حل مشكلة حقيقية.`,
          course: `مرحبًا بك في ${topic}. هذا الدرس موجه إلى ${audience || 'كل من يريد التعلم'}. سنتقدم خطوة بخطوة.`,
          meeting: `مرحبًا بالجميع. إليكم آخر المستجدات حول ${topic}.`,
          podcast: `مرحبًا بكم في ${topic}. نشارككم اليوم هذه الأفكار مع ${audience || 'كل المستمعين'}.`,
          speech: `شكرًا لحضوركم. أود اليوم مشاركة بعض الأفكار حول ${topic}.`,
          live: `مرحبًا بكم في البث المباشر! موضوع اليوم هو ${topic}. ${audience ? `سعداء بوجود ${audience} معنا.` : 'ألقوا التحية في الدردشة.'}`,
          interview: `مرحبًا، أنا ${topic}. شكرًا لكم على هذه الفرصة. سأعرّفكم باختصار على خبراتي ونقاط قوتي.`
        },
        structures: {
          youtube: ['خطاف البداية', 'خطوات عملية', 'مثال'], pitch: ['المشكلة', 'الحل', 'دليل وقيمة'],
          course: ['نتيجة التعلم', 'شرح ومثال', 'تطبيق'], meeting: ['التقدم', 'العقبات', 'الخطوات التالية'],
          podcast: ['موضوع الحلقة', 'نقاش أساسي', 'فائدة للمستمع'], speech: ['تجربة مشتركة', 'الرسالة الأساسية', 'عمل وأمل'],
          live: ['برنامج اليوم', 'سؤال الجمهور', 'العرض الرئيسي'], interview: ['خبرة ذات صلة', 'إنجازات ونقاط قوة', 'أهداف وتوافق']
        }
      },
      hi: {
        opening: 'शुरुआत', closing: 'समापन', extra: 'अतिरिक्त बिंदु', defaultAction: 'आपके समय के लिए धन्यवाद। फिर मिलेंगे।',
        openings: {
          youtube: `आज हम ${topic} के बारे में बात करेंगे। अगर आप ${audience || 'व्यावहारिक शुरुआती बिंदु खोज रहे हैं'}, तो यह वीडियो आपके लिए है।`,
          pitch: `मिलिए ${topic} से। हमने इसे बनाया है ताकि ${audience || 'आप'} एक असली समस्या सुलझा सकें।`,
          course: `${topic} में आपका स्वागत है। यह पाठ ${audience || 'सीखना चाहने वालों'} के लिए है। हम कदम-दर-कदम चलेंगे।`,
          meeting: `नमस्ते सभी। यहाँ ${topic} की नवीनतम जानकारी है।`,
          podcast: `${topic} में स्वागत है। आज हम ये विचार ${audience || 'हर श्रोता'} के साथ साझा कर रहे हैं।`,
          speech: `यहाँ आने के लिए धन्यवाद। आज मैं ${topic} पर कुछ विचार साझा करना चाहता हूँ।`,
          live: `लाइव स्ट्रीम में स्वागत है! आज का विषय है ${topic}। ${audience ? `${audience} का यहाँ होना खुशी की बात है।` : 'चैट में नमस्ते कहें।'}`,
          interview: `नमस्ते, मैं ${topic} हूँ। इस अवसर के लिए धन्यवाद। मेरे अनुभव और योगदान का संक्षिप्त परिचय प्रस्तुत है।`
        },
        structures: {
          youtube: ['हुक', 'व्यावहारिक कदम', 'एक उदाहरण'], pitch: ['समस्या', 'समाधान', 'प्रमाण और मूल्य'],
          course: ['सीखने का लक्ष्य', 'व्याख्या और उदाहरण', 'अभ्यास'], meeting: ['प्रगति', 'बाधाएँ', 'अगले कदम'],
          podcast: ['एपिसोड का विषय', 'मुख्य चर्चा', 'श्रोता की सीख'], speech: ['साझा अनुभव', 'मुख्य संदेश', 'कार्रवाई और उम्मीद'],
          live: ['आज की रूपरेखा', 'दर्शक प्रश्न', 'मुख्य प्रदर्शन'], interview: ['प्रासंगिक अनुभव', 'उपलब्धियाँ और क्षमताएँ', 'लक्ष्य और उपयुक्तता']
        }
      },
      id: {
        opening: 'Pembuka', closing: 'Penutup', extra: 'Poin tambahan', defaultAction: 'Terima kasih atas waktunya. Sampai jumpa.',
        openings: {
          youtube: `Hari ini kita membahas ${topic}. Jika kamu ${audience || 'sedang mencari titik awal yang praktis'}, video ini untukmu.`,
          pitch: `Kenalkan ${topic}. Kami membuatnya agar ${audience || 'kamu'} bisa menyelesaikan masalah nyata.`,
          course: `Selamat datang di ${topic}. Pelajaran ini untuk ${audience || 'siapa pun yang ingin belajar'}. Kita bahas langkah demi langkah.`,
          meeting: `Halo semuanya. Berikut perkembangan terbaru tentang ${topic}.`,
          podcast: `Selamat datang di ${topic}. Hari ini kita membagikan ide ini dengan ${audience || 'semua pendengar'}.`,
          speech: `Terima kasih sudah hadir. Hari ini saya ingin berbagi beberapa pemikiran tentang ${topic}.`,
          live: `Selamat datang di siaran langsung! Topik hari ini adalah ${topic}. ${audience ? `Senang ada ${audience} di sini.` : 'Sapa di kolom chat, ya.'}`,
          interview: `Halo, saya ${topic}. Terima kasih atas kesempatannya. Perkenalkan pengalaman dan kekuatan saya secara singkat.`
        },
        structures: {
          youtube: ['Pancingan awal', 'Langkah praktis', 'Contoh'], pitch: ['Masalah', 'Solusi', 'Bukti dan nilai'],
          course: ['Hasil belajar', 'Penjelasan dan contoh', 'Latihan'], meeting: ['Progres', 'Kendala', 'Langkah berikutnya'],
          podcast: ['Topik episode', 'Diskusi utama', 'Manfaat bagi pendengar'], speech: ['Pengalaman bersama', 'Pesan utama', 'Tindakan dan harapan'],
          live: ['Agenda hari ini', 'Pertanyaan penonton', 'Demo utama'], interview: ['Pengalaman relevan', 'Pencapaian dan kekuatan', 'Tujuan dan kecocokan']
        }
      },
      vi: {
        opening: 'Mở đầu', closing: 'Kết thúc', extra: 'Ý bổ sung', defaultAction: 'Cảm ơn thời gian của bạn. Hẹn gặp lại.',
        openings: {
          youtube: `Hôm nay chúng ta cùng nói về ${topic}. Nếu bạn ${audience || 'đang tìm một điểm khởi đầu thực tế'}, video này dành cho bạn.`,
          pitch: `Xin giới thiệu ${topic}. Chúng tôi tạo ra nó để ${audience || 'bạn'} giải quyết một vấn đề thực tế.`,
          course: `Chào mừng đến với ${topic}. Bài học này dành cho ${audience || 'những ai muốn học'}. Ta sẽ đi từng bước một.`,
          meeting: `Chào mọi người. Sau đây là cập nhật mới nhất về ${topic}.`,
          podcast: `Chào mừng đến với ${topic}. Hôm nay chúng ta chia sẻ những ý tưởng này cùng ${audience || 'mọi thính giả'}.`,
          speech: `Cảm ơn mọi người đã có mặt. Hôm nay tôi muốn chia sẻ vài suy nghĩ về ${topic}.`,
          live: `Chào mừng đến với buổi phát trực tiếp! Chủ đề hôm nay là ${topic}. ${audience ? `Rất vui có ${audience} ở đây.` : 'Hãy chào hỏi trong khung chat nhé.'}`,
          interview: `Xin chào, tôi là ${topic}. Cảm ơn vì cơ hội này. Tôi xin giới thiệu ngắn gọn kinh nghiệm và thế mạnh của mình.`
        },
        structures: {
          youtube: ['Câu mở đầu thu hút', 'Các bước thực tế', 'Một ví dụ'], pitch: ['Vấn đề', 'Giải pháp', 'Bằng chứng và giá trị'],
          course: ['Mục tiêu bài học', 'Giải thích và ví dụ', 'Luyện tập'], meeting: ['Tiến độ', 'Trở ngại', 'Bước tiếp theo'],
          podcast: ['Chủ đề tập này', 'Thảo luận chính', 'Điều thính giả nhận được'], speech: ['Trải nghiệm chung', 'Thông điệp chính', 'Hành động và hy vọng'],
          live: ['Chương trình hôm nay', 'Câu hỏi khán giả', 'Phần demo chính'], interview: ['Kinh nghiệm liên quan', 'Thành tựu và thế mạnh', 'Mục tiêu và độ phù hợp']
        }
      },
      th: {
        opening: 'เปิดเรื่อง', closing: 'ปิดท้าย', extra: 'ประเด็นเพิ่มเติม', defaultAction: 'ขอบคุณสำหรับเวลาของคุณ แล้วพบกันใหม่',
        openings: {
          youtube: `วันนี้เราจะคุยกันเรื่อง ${topic} ถ้าคุณเป็น${audience || 'คนที่กำลังมองหาจุดเริ่มต้นที่ทำได้จริง'} วิดีโอนี้เพื่อคุณ`,
          pitch: `ขอแนะนำ ${topic} เราสร้างมันขึ้นเพื่อให้${audience || 'คุณ'}แก้ปัญหาจริงได้`,
          course: `ยินดีต้อนรับสู่ ${topic} บทเรียนนี้สำหรับ${audience || 'ผู้ที่อยากเรียนรู้'} เราจะค่อย ๆ ไปทีละขั้น`,
          meeting: `สวัสดีทุกคน นี่คือความคืบหน้าล่าสุดของ ${topic}`,
          podcast: `ยินดีต้อนรับสู่ ${topic} วันนี้เราแบ่งปันไอเดียเหล่านี้กับ${audience || 'ผู้ฟังทุกท่าน'}`,
          speech: `ขอบคุณที่มาร่วมงานในวันนี้ อยากแบ่งปันมุมมองเกี่ยวกับ ${topic} ให้ทุกคนฟัง`,
          live: `ยินดีต้อนรับสู่ไลฟ์สด! หัวข้อวันนี้คือ ${topic} ${audience ? `ดีใจที่มี${audience}อยู่ด้วยกัน` : 'ทักทายกันในแชทได้เลย'}`,
          interview: `สวัสดี ฉันชื่อ ${topic} ขอบคุณสำหรับโอกาสนี้ ขอแนะนำประสบการณ์และจุดแข็งโดยย่อ`
        },
        structures: {
          youtube: ['เปิดให้สะดุดตา', 'ขั้นตอนที่ทำได้จริง', 'ตัวอย่าง'], pitch: ['ปัญหา', 'ทางออก', 'หลักฐานและคุณค่า'],
          course: ['เป้าหมายการเรียนรู้', 'คำอธิบายและตัวอย่าง', 'ฝึกปฏิบัติ'], meeting: ['ความคืบหน้า', 'อุปสรรค', 'ขั้นตอนถัดไป'],
          podcast: ['หัวข้อของตอนนี้', 'ประเด็นสนทนาหลัก', 'สิ่งที่ผู้ฟังจะได้รับ'], speech: ['ประสบการณ์ร่วม', 'ข้อความหลัก', 'การกระทำและความหวัง'],
          live: ['กำหนดการวันนี้', 'คำถามจากผู้ชม', 'เดโมหลัก'], interview: ['ประสบการณ์ที่เกี่ยวข้อง', 'ผลงานและจุดแข็ง', 'เป้าหมายและความเหมาะสม']
        }
      },
    };
    const pack = PACKS[scriptLanguage] || PACKS.en;
    const headings = pack.structures[value('scene')];
    const body = points.split('\n').filter(s=>s.trim()).map((s,i)=>`## ${headings[i] || pack.extra}\n${s.trim()}`).join('\n\n');
    output(topic, `## ${pack.opening}\n${pack.openings[value('scene')]}\n\n[pause]\n\n${body}\n\n## ${pack.closing}\n[slow] ${action || pack.defaultAction}`);
  };
  document.querySelectorAll('[data-template-scene]').forEach(card => card.onclick = () => {
    if (!el('scene')) return;
    el('scene').value = card.dataset.templateScene;
    document.querySelectorAll('[data-template-scene]').forEach(item => item.classList.toggle('selected', item === card));
    el('topic').focus({preventScroll:true}); el('topic').scrollIntoView({behavior:'smooth', block:'center'});
  });
  if (el('clean')) {
    el('clean').onclick = () => { if (!value('transcript')) { status('Paste or import a transcript first.'); return; } output(isKo() ? '정리된 녹취록' : 'Cleaned transcript', clean(value('transcript'))); };
    el('transcript-file').onchange = async event => {
      const file = event.target.files[0]; if (!file) return;
      if (!/\.(txt|md|srt|vtt)$/i.test(file.name) || file.size > 5 * 1024 * 1024) { status('Choose a TXT, MD, SRT or VTT file smaller than 5 MB.'); return; }
      try { el('transcript').value = await file.text(); output(file.name.replace(/\.[^.]+$/, ''), clean(el('transcript').value)); } catch { status('Could not read this file. Please try another file.'); }
    };
  }
  if (el('package')) el('package').onclick = () => {
    const title = value('video-title'), script = value('publish-script');
    if (!title || !script) { status('Add your title and script first.'); return; }
    const lines = script.split('\n').map(s => s.replace(/^#+\s*/, '').replace(/\[(pause|slow)\]/g, '').trim()).filter(Boolean);
    const tags = value('keywords').split(',').map(s => s.trim().replace(/[^\p{L}\p{N}_]/gu, '')).filter(Boolean).slice(0, 10).map(s => '#' + s).join(' ');
    output(title, `TITLE\n${title}\n\nDESCRIPTION\n${lines.slice(0, 5).join('\n')}\n\n${value('publish-action')}\n\nTAGS\n${tags}\n\nBEFORE YOU PUBLISH\n□ Watch the exported video\n□ Check audio and captions\n□ Verify links and names\n□ Choose a thumbnail\n□ Review platform visibility`);
  };
  const handoff = readNow => {
    if (!value('result')) { status('Create or paste a draft first.'); return; }
    try {
      sessionStorage.setItem('cueprompt-incoming', JSON.stringify({title:value('result-title'), text:value('result'), read:!!readNow}));
      const studioPaths = {'zh-CN':'/zh/','zh-TW':'/zh-tw/',es:'/es/',pt:'/pt/',fr:'/fr/',de:'/de/',ja:'/ja/',ko:'/ko/',ru:'/ru/',ar:'/ar/',hi:'/hi/',id:'/id/',vi:'/vi/',th:'/th/'};
      location.href = (studioPaths[locale] || '/') + '#studio';
    } catch { status('Browser storage is unavailable. Download your draft and import it in the studio.'); }
  };
  el('use').onclick = () => handoff(false);
  el('read').onclick = () => handoff(true);
  el('download').onclick = () => {
    if (!value('result')) { status('Create or paste a draft first.'); return; }
    const url = URL.createObjectURL(new Blob([el('result').value], {type:'text/plain;charset=utf-8'}));
    const a = document.createElement('a'); a.href = url; a.download = (value('result-title').replace(/[^\p{L}\p{N}_-]/gu, '-').slice(0, 100) || 'cueprompt-draft') + '.txt'; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  el('copy').onclick = async () => { try { await navigator.clipboard.writeText(el('result').value); status('Copied.'); } catch { status('Select the draft and copy it manually.'); } };
})();
