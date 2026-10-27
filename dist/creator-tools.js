'use strict';
(() => {
  const el = id => document.getElementById(id);
  const value = id => el(id).value.trim();
  const status = text => { el('status').textContent = text; };
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
    const zh = value('language') === 'zh';
    const openings = zh ? {
      youtube: `今天我们聊聊${topic}。如果你是${audience || '正在寻找新方法的人'}，这期视频就是为你准备的。`,
      pitch: `认识一下${topic}。我们希望帮助${audience || '你'}解决一个实际问题。`,
      course: `欢迎来到${topic}。这节课面向${audience || '希望学习的你'}，我们一步一步来。`,
      meeting: `大家好，下面同步${topic}的最新进展。`,
      podcast: `欢迎收听${topic}。今天我们为${audience || '每一位听众'}准备了这些值得聊的话题。`,
      speech: `感谢各位来到这里。今天我想和大家分享${topic}。`,
      live: `欢迎来到直播间！今天的主题是${topic}。${audience ? `欢迎${audience}一起参与。` : ''}`,
      interview: `你好，我是${topic}。感谢这次机会，下面简单介绍我的经历与优势。`
    } : {
      youtube: `Today we're exploring ${topic}. If you're ${audience || 'looking for a practical starting point'}, this video is for you.`,
      pitch: `Meet ${topic}. We built this for ${audience || 'people who want a better way'} to solve a real problem.`,
      course: `Welcome to ${topic}. This lesson is for ${audience || 'curious learners'}. Let's work through it step by step.`,
      meeting: `Hello everyone. Here's the latest update on ${topic}.`,
      podcast: `Welcome to ${topic}. Today we're sharing these ideas with ${audience || 'everyone listening'}.`,
      speech: `Thank you for being here. Today I'd like to share a few thoughts about ${topic}.`,
      live: `Welcome to the livestream! Today's topic is ${topic}. ${audience ? `Great to have ${audience} here.` : 'Say hello in the chat.'}`,
      interview: `Hello, I'm ${topic}. Thank you for this opportunity. Let me introduce my experience and what I can contribute.`
    };
    const structures = {
      youtube: zh ? ['问题与期待','实用方法','示例'] : ['The hook','Practical steps','An example'],
      pitch: zh ? ['痛点','解决方案','证据与价值'] : ['The problem','The solution','Proof and value'],
      course: zh ? ['学习目标','解释与示例','动手练习'] : ['Learning outcome','Explanation and example','Practice'],
      meeting: zh ? ['已完成','阻碍','下一步'] : ['Progress','Blockers','Next steps'],
      podcast: zh ? ['本期话题','核心观点','听众收获'] : ['Episode topic','Key discussion','Listener takeaway'],
      speech: zh ? ['共同经历','核心观点','行动与希望'] : ['Shared experience','Main message','Action and hope'],
      live: zh ? ['今日安排','观众互动','重点分享'] : ["Today's agenda",'Audience question','Main demonstration'],
      interview: zh ? ['相关经历','成果与优势','目标与匹配'] : ['Relevant experience','Achievements and strengths','Goals and fit']
    };
    const headings = structures[value('scene')];
    const body = points.split('\n').filter(s=>s.trim()).map((s,i)=>`## ${headings[i] || (zh ? '补充要点' : 'Additional point')}\n${s.trim()}`).join('\n\n');
    output(topic, `## ${zh ? '开场' : 'Opening'}\n${openings[value('scene')]}\n\n[pause]\n\n${body}\n\n## ${zh ? '结束' : 'Closing'}\n[slow] ${action || (zh ? '感谢你的时间。我们下次见。' : 'Thanks for your time. See you next time.')}`);
  };
  if (el('clean')) {
    el('clean').onclick = () => { if (!value('transcript')) { status('Paste or import a transcript first.'); return; } output('Cleaned transcript', clean(value('transcript'))); };
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
    try { sessionStorage.setItem('cueprompt-incoming', JSON.stringify({title:value('result-title'), text:value('result'), read:!!readNow})); location.href = '/#studio'; } catch { status('Browser storage is unavailable. Download your draft and import it in the studio.'); }
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
