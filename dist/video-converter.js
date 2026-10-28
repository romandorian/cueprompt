'use strict';
(async () => {
  const $ = id => document.getElementById(id), W = CueWorkflow;
  let incoming, ff, busy = false, cancelled = false, outputURL;
  const ko = document.documentElement.lang === 'ko';
  const koCopy = {
    'Ready: your latest studio recording. Choose a file to use a different video.': '마지막 Studio 녹화 파일을 사용할 수 있습니다. 다른 영상을 사용하려면 파일을 선택하세요.',
    'Choose a video to get started.': '시작하려면 영상을 선택하세요.',
    'Saved local take removed. Downloaded files are unaffected.': '기기에 저장된 녹화 영상을 삭제했습니다. 다운로드한 파일은 그대로입니다.',
    'Could not remove the saved take. Try again.': '저장된 녹화 영상을 삭제하지 못했습니다. 다시 시도하세요.',
    'File ready. Choose export settings.': '파일이 준비되었습니다. 내보내기 설정을 선택하세요.',
    'Choose a video under 150 MB.': '150 MB 미만의 영상을 선택하세요.',
    'Loading local video engine…': '기기 내 영상 처리 엔진을 불러오는 중…',
    'Could not convert this video. Try a smaller MP4 or WebM file.': '영상을 변환하지 못했습니다. 더 작은 MP4 또는 WebM 파일을 사용하세요.',
    'Export ready. Play it back and check audio before downloading.': '내보내기가 완료되었습니다. 다운로드 전에 영상과 소리를 확인하세요.',
    'Cancelled. Your original video is unchanged.': '취소했습니다. 원본 영상은 그대로입니다.',
    'Processing failed. Try a smaller recording.': '처리에 실패했습니다. 더 작은 녹화 파일로 시도하세요.',
    'Cancelling…': '취소 중…'
  };
  const translate = text => ko ? (koCopy[text] || text) : text;
  const status = text => { $('media-status').textContent = translate(text); };
  try { incoming = await W.read('recording'); if (incoming?.blob) status('Ready: your latest studio recording. Choose a file to use a different video.'); } catch { status('Choose a video to get started.'); }
  const forget = document.createElement('button'); forget.textContent = ko ? '기기에 저장된 녹화 삭제' : 'Remove saved local take'; forget.hidden = !incoming?.blob;
  ($('media-file').closest('.file-field') || $('media-file')).after(forget);
  forget.onclick = async () => { if (busy) return; try { await W.remove('recording'); incoming = null; forget.hidden = true; status('Saved local take removed. Downloaded files are unaffected.'); } catch { status('Could not remove the saved take. Try again.'); } };
  $('media-file').onchange = () => { incoming = null; status('File ready. Choose export settings.'); };
  const presets = {
    youtube: {canvas:'landscape', format:'mp4', quality:'23', suffix:'youtube-16x9', note:'YouTube video preset: MP4, H.264, 16:9 canvas at 1280 × 720. Keep your original if it is already higher quality.'},
    shorts: {canvas:'portrait', format:'mp4', quality:'23', suffix:'youtube-short', note:'YouTube Shorts preset: MP4, H.264, 9:16 canvas at 720 × 1280. Confirm current duration and upload rules before posting.'},
    tiktok: {canvas:'portrait', format:'mp4', quality:'23', suffix:'tiktok', note:'TikTok preset: MP4, H.264, 9:16 canvas at 720 × 1280. Check captions and safe areas in the exported preview.'},
    reels: {canvas:'portrait', format:'mp4', quality:'23', suffix:'instagram-reel', note:'Instagram Reels preset: MP4, H.264, 9:16 canvas at 720 × 1280. Review the preview before upload.'}
  };
  const applyPreset = () => {
    const preset = presets[$('media-preset').value];
    if (!preset) { $('media-preset-note').textContent = ko ? '사용자 지정 내보내기. 형식, 화면 비율, 화질을 선택하세요.' : 'Custom export. Pick your own format, canvas and quality.'; return; }
    $('media-canvas').value = preset.canvas; $('media-format').value = preset.format; $('media-quality').value = preset.quality;
    const koNotes = {
      youtube: 'YouTube 영상: MP4, H.264, 가로 16:9, 1280 × 720. 원본 화질이 더 높으면 원본도 보관하세요.',
      shorts: 'YouTube Shorts: MP4, H.264, 세로 9:16, 720 × 1280. 게시 전 길이와 업로드 규칙을 확인하세요.',
      tiktok: 'TikTok: MP4, H.264, 세로 9:16, 720 × 1280. 자막과 화면 안전 영역을 확인하세요.',
      reels: 'Instagram Reels: MP4, H.264, 세로 9:16, 720 × 1280. 업로드 전 미리보기를 확인하세요.'
    };
    $('media-preset-note').textContent = ko ? koNotes[$('media-preset').value] : preset.note;
  };
  $('media-preset').onchange = applyPreset;
  $('media-cancel').onclick = () => { cancelled = true; ff?.terminate(); status('Cancelling…'); };
  $('convert').onclick = async () => {
    if (busy) return;
    const file = $('media-file').files[0] || incoming?.blob;
    if (!file || file.size > 150 * 1024 * 1024) return status('Choose a video under 150 MB.');
    busy = true; cancelled = false; $('convert').disabled = true; $('media-cancel').hidden = false; $('media-download').hidden = true;
    $('media-progress').value = 0;
    try {
      status('Loading local video engine…'); ff = await W.engine(p => { if (!cancelled) { $('media-progress').value = p; status(ko ? `기기에서 처리 중 · ${p}%` : `Processing locally · ${p}%`); } });
      if (cancelled) throw new DOMException('Cancelled', 'AbortError');
      await ff.writeFile('input', new Uint8Array(await file.arrayBuffer()));
      const format = $('media-format').value, canvas = $('media-canvas').value, quality = $('media-quality').value;
      const filter = canvas === 'portrait' ? 'scale=720:1280:force_original_aspect_ratio=decrease:force_divisible_by=2,pad=720:1280:(ow-iw)/2:(oh-ih)/2,setsar=1' : canvas === 'landscape' ? 'scale=1280:720:force_original_aspect_ratio=decrease:force_divisible_by=2,pad=1280:720:(ow-iw)/2:(oh-ih)/2,setsar=1' : 'scale=trunc(iw/2)*2:trunc(ih/2)*2,setsar=1';
      const codecs = format === 'mp4' ? ['-c:v','libx264','-threads','1','-preset','fast','-crf',quality,'-pix_fmt','yuv420p','-c:a','aac','-b:a','128k','-movflags','+faststart'] : ['-c:v','libvpx','-threads','1','-deadline','realtime','-cpu-used','4','-b:v','1200k','-crf',quality,'-c:a','libopus','-b:a','96k'];
      const preset = presets[$('media-preset').value];
      const name = 'output.' + format;
      const code = await ff.exec(['-i','input','-map','0:v:0','-map','0:a:0?','-vf',filter,...codecs,name]);
      if (cancelled) throw new DOMException('Cancelled', 'AbortError');
      if (code !== 0) throw new Error('Could not convert this video. Try a smaller MP4 or WebM file.');
      const data = await ff.readFile(name), blob = new Blob([data], {type:'video/' + format});
      if (outputURL) URL.revokeObjectURL(outputURL); outputURL = URL.createObjectURL(blob);
      $('media-preview').src = outputURL; $('media-download').href = outputURL; $('media-download').download = 'cueprompt-' + (preset?.suffix || 'custom-export') + '.' + format; $('media-download').hidden = false;
      const change = Math.round((1 - blob.size / file.size) * 100);
      const size = n => n < 1048576 ? (n / 1024).toFixed(1) + ' KB' : (n / 1048576).toFixed(1) + ' MB';
      $('media-summary').textContent = `${size(file.size)} → ${size(blob.size)} · ${ko ? (change >= 0 ? change + '% 감소' : -change + '% 증가; 여백, 형식, 원본 화질에 따라 달라집니다') : (change >= 0 ? change + '% smaller' : -change + '% larger; padding, format and source quality affect file size')}`;
      $('media-progress').value = 100; status('Export ready. Play it back and check audio before downloading.');
    } catch (e) { status(cancelled ? 'Cancelled. Your original video is unchanged.' : e.message || 'Processing failed. Try a smaller recording.'); }
    finally { ff?.terminate(); ff = null; busy = false; $('convert').disabled = false; $('media-cancel').hidden = true; }
  };
  window.addEventListener('pagehide', () => { ff?.terminate(); if (outputURL) URL.revokeObjectURL(outputURL); });
})();
