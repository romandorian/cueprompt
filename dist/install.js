'use strict';
if ('serviceWorker' in navigator && window.isSecureContext) {
  window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => {}));
}
let installPrompt;
window.addEventListener('beforeinstallprompt', event => {
  event.preventDefault(); installPrompt = event;
  const button = document.createElement('button'); button.className = 'ghost-button'; button.textContent = 'Install CuePrompt';
  button.onclick = async () => { await installPrompt.prompt(); const answer = await installPrompt.userChoice; if (answer.outcome === 'accepted') button.remove(); installPrompt = null; button.remove(); };
  document.querySelector('footer')?.append(button);
});
